const anchor = require('@coral-xyz/anchor');
const { Connection, PublicKey } = require('@solana/web3.js');

const PROGRAM_ID = '9AvbivndosEuSExjRmdJQz1NswXCvbDzeHVBg4Ls4cDw';
const CONNECTION_URL = 'https://api.devnet.solana.com';

async function indexAllUsers() {
  console.log('🔍 Indexing all users on the NFT marketplace...\n');

  const connection = new Connection(CONNECTION_URL, 'confirmed');

  try {
    // Get all accounts owned by our program
    const programAccounts = await connection.getProgramAccounts(
      new PublicKey(PROGRAM_ID),
      {
        filters: [
          {
            dataSize: 8 + 32 + 1 + 4 + 32 + 4 + 200 + 4 + 200 + 4 + 100 + 4 + 50 + 8 + 8 + 1 + 4 + 4 + 1 // UserProfile size
          }
        ]
      }
    );

    console.log(`📊 Found ${programAccounts.length} user profile accounts\n`);

    if (programAccounts.length === 0) {
      console.log('❌ No user profiles found. Make sure users have created profiles on the marketplace.');
      return;
    }

    const users = [];

    for (let i = 0; i < programAccounts.length; i++) {
      const account = programAccounts[i];

      try {
        console.log(`\n👤 User Profile #${i + 1}`);
        console.log('Account Address:', account.pubkey.toString());

        const data = account.account.data;
        let offset = 8; // Skip discriminator

        // Read authority (32 bytes)
        const authority = new PublicKey(data.slice(offset, offset + 32));
        console.log('Wallet Address:', authority.toString());
        offset += 32;

        // Read role (1 byte enum)
        const roleIndex = data[offset];
        const roleNames = ['Artist', 'Collector', 'Curator'];
        const role = roleNames[roleIndex] || 'Unknown';
        console.log('Role:', role);
        offset += 1;

        // Read username (4 bytes length + string)
        const usernameLength = data.readUInt32LE(offset);
        offset += 4;
        const username = data.slice(offset, offset + usernameLength).toString('utf8');
        console.log('Username:', username || 'No username');
        offset += usernameLength;

        // Read bio (4 bytes length + string)
        const bioLength = data.readUInt32LE(offset);
        offset += 4;
        const bio = data.slice(offset, offset + bioLength).toString('utf8');
        console.log('Bio:', bio || 'No bio');
        offset += bioLength;

        // Read avatar_uri (4 bytes length + string)
        const avatarLength = data.readUInt32LE(offset);
        offset += 4;
        const avatarUri = data.slice(offset, offset + avatarLength).toString('utf8');
        console.log('Avatar URI:', avatarUri || 'No avatar');
        offset += avatarLength;

        // Read website (4 bytes length + string)
        const websiteLength = data.readUInt32LE(offset);
        offset += 4;
        const website = data.slice(offset, offset + websiteLength).toString('utf8');
        console.log('Website:', website || 'No website');
        offset += websiteLength;

        // Read twitter (4 bytes length + string)
        const twitterLength = data.readUInt32LE(offset);
        offset += 4;
        const twitter = data.slice(offset, offset + twitterLength).toString('utf8');
        console.log('Twitter:', twitter || 'No twitter');
        offset += twitterLength;

        // Read timestamps (8 bytes each)
        const createdAt = Number(data.readBigInt64LE(offset));
        const createdDate = new Date(createdAt * 1000);
        console.log('Created At:', createdDate.toLocaleString());
        offset += 8;

        const updatedAt = Number(data.readBigInt64LE(offset));
        const updatedDate = new Date(updatedAt * 1000);
        console.log('Updated At:', updatedDate.toLocaleString());
        offset += 8;

        // Read verification status (1 byte)
        const isVerified = data[offset] === 1;
        console.log('Verified:', isVerified ? '✅' : '❌');
        offset += 1;

        // Read counts (4 bytes each)
        const nftCount = data.readUInt32LE(offset);
        console.log('NFT Count:', nftCount);
        offset += 4;

        const collectionCount = data.readUInt32LE(offset);
        console.log('Collection Count:', collectionCount);
        offset += 4;

        // Store user data
        users.push({
          profileAddress: account.pubkey.toString(),
          walletAddress: authority.toString(),
          role,
          username,
          bio,
          avatarUri,
          website,
          twitter,
          createdAt: createdDate,
          updatedAt: updatedDate,
          isVerified,
          nftCount,
          collectionCount
        });

        console.log('─'.repeat(50));

      } catch (parseError) {
        console.error(`❌ Error parsing account ${account.pubkey.toString()}:`, parseError.message);
      }
    }

    // Summary
    console.log(`\n📈 SUMMARY`);
    console.log(`Total Users: ${users.length}`);

    const roleCount = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    console.log('Role Distribution:');
    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`  ${role}: ${count}`);
    });

    const verifiedCount = users.filter(u => u.isVerified).length;
    console.log(`Verified Users: ${verifiedCount}/${users.length}`);

    // Most recent users
    const recentUsers = users
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);

    console.log('\n🕒 Most Recent Users:');
    recentUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.username || 'Unnamed'} (${user.role}) - ${user.createdAt.toLocaleDateString()}`);
    });

    // Check marketplace config
    console.log('\n🏪 Checking Marketplace Configuration...');
    const [marketplaceConfigPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('marketplace')],
      new PublicKey(PROGRAM_ID)
    );

    const marketplaceAccount = await connection.getAccountInfo(marketplaceConfigPDA);
    if (marketplaceAccount) {
      console.log('✅ Marketplace is initialized');
      const data = marketplaceAccount.data;
      let offset = 8; // Skip discriminator

      // Skip authority (32 bytes) and fee_recipient (32 bytes)
      offset += 64;

      // Read marketplace fee (2 bytes)
      const marketplaceFee = data.readUInt16LE(offset);
      console.log(`Marketplace Fee: ${marketplaceFee / 100}%`);
      offset += 2;

      // Read max royalty (2 bytes)
      const maxRoyalty = data.readUInt16LE(offset);
      console.log(`Max Royalty: ${maxRoyalty / 100}%`);
      offset += 2;

      // Read pause status (1 byte)
      const isPaused = data[offset] === 1;
      console.log(`Status: ${isPaused ? '⏸️  PAUSED' : '✅ ACTIVE'}`);
      offset += 1;

      // Read total users (8 bytes)
      const totalUsers = Number(data.readBigUInt64LE(offset));
      console.log(`Total Users (on-chain counter): ${totalUsers}`);
    } else {
      console.log('❌ Marketplace not initialized');
    }

  } catch (error) {
    console.error('❌ Error indexing users:', error);
  }
}

indexAllUsers();