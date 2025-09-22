const anchor = require('@coral-xyz/anchor');
const { Connection, clusterApiUrl, PublicKey } = require('@solana/web3.js');

// Program ID
const PROGRAM_ID = new PublicKey('9AvbivndosEuSExjRmdJQz1NswXCvbDzeHVBg4Ls4cDw');

async function checkRoleChanges() {
  try {
    console.log('🔍 Checking for recent role changes...\n');

    const connection = new Connection(clusterApiUrl('devnet'));

    // Get program accounts (all user profiles)
    const profiles = await connection.getProgramAccounts(PROGRAM_ID, {
      filters: [
        {
          dataSize: 669, // UserProfile account size
        }
      ]
    });

    console.log(`📊 Found ${profiles.length} user profiles\n`);

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];

      try {
        // Parse the account data
        const data = profile.account.data;

        // Skip discriminator (8 bytes)
        let offset = 8;

        // Read authority (32 bytes)
        const authority = new PublicKey(data.slice(offset, offset + 32));
        offset += 32;

        // Read role (1 byte)
        const roleEnum = data[offset];
        const roleMap = { 0: 'Artist', 1: 'Collector', 2: 'Curator' };
        const role = roleMap[roleEnum] || 'Unknown';
        offset += 1;

        // Read username (variable length)
        const usernameLen = data.readUInt32LE(offset);
        offset += 4;
        const username = data.slice(offset, offset + usernameLen).toString('utf8');
        offset += usernameLen;

        // Read bio (variable length)
        const bioLen = data.readUInt32LE(offset);
        offset += 4;
        offset += bioLen; // skip bio content

        // Read avatar_uri (variable length)
        const avatarLen = data.readUInt32LE(offset);
        offset += 4;
        offset += avatarLen; // skip avatar content

        // Read website (variable length)
        const websiteLen = data.readUInt32LE(offset);
        offset += 4;
        offset += websiteLen; // skip website content

        // Read twitter (variable length)
        const twitterLen = data.readUInt32LE(offset);
        offset += 4;
        offset += twitterLen; // skip twitter content

        // Read timestamps (8 bytes each, little endian)
        const createdAt = data.readBigInt64LE(offset);
        offset += 8;
        const updatedAt = data.readBigInt64LE(offset);

        const createdDate = new Date(Number(createdAt) * 1000);
        const updatedDate = new Date(Number(updatedAt) * 1000);

        // Check if updated recently (different from created time)
        const timeDiff = Number(updatedAt) - Number(createdAt);
        const isRecentlyUpdated = timeDiff > 60; // More than 1 minute difference

        console.log(`👤 User #${i + 1}: ${username}`);
        console.log(`   Wallet: ${authority.toString()}`);
        console.log(`   Role: ${role}`);
        console.log(`   Created: ${createdDate.toLocaleString()}`);
        console.log(`   Updated: ${updatedDate.toLocaleString()}`);

        if (isRecentlyUpdated) {
          console.log(`   🔄 ROLE CHANGED! (${Math.floor(timeDiff / 60)} minutes after creation)`);
        } else {
          console.log(`   📝 Original profile (no role changes)`);
        }
        console.log('   ──────────────────────────────────────\n');

      } catch (parseError) {
        console.log(`❌ Error parsing profile #${i + 1}:`, parseError.message);
      }
    }

  } catch (error) {
    console.error('Error checking role changes:', error);
  }
}

checkRoleChanges();