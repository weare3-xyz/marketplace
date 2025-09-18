const anchor = require('@coral-xyz/anchor');
const { Connection, PublicKey } = require('@solana/web3.js');

// Your wallet address
const USER_WALLET = '7uJ2F6ZviRzMZ76y2kpndoSATrvTq2qPEMcbkKsLxEiH';
const PROGRAM_ID = '9AvbivndosEuSExjRmdJQz1NswXCvbDzeHVBg4Ls4cDw';

async function checkUserProfile() {
  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  try {
    const userWallet = new PublicKey(USER_WALLET);

    // Derive the user profile PDA
    const [userProfilePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('user_profile'), userWallet.toBuffer()],
      new PublicKey(PROGRAM_ID)
    );

    console.log('User Wallet:', USER_WALLET);
    console.log('User Profile PDA:', userProfilePDA.toString());

    // Check if the account exists
    const accountInfo = await connection.getAccountInfo(userProfilePDA);

    if (accountInfo) {
      console.log('\n✅ User profile account exists!');
      console.log('Account data length:', accountInfo.data.length);
      console.log('Account owner:', accountInfo.owner.toString());
      console.log('Lamports:', accountInfo.lamports);

      // Try to deserialize the account data
      try {
        // Basic parsing (first 8 bytes are discriminator, then the actual data)
        const data = accountInfo.data;
        console.log('\n📊 Account Data:');
        console.log('Raw data (first 50 bytes):', data.slice(0, 50).toString('hex'));

        // Skip discriminator (8 bytes) and try to read basic fields
        let offset = 8;

        // Read role (1 byte enum)
        const role = data[offset];
        const roleNames = ['Artist', 'Collector', 'Curator'];
        console.log('Role:', roleNames[role] || 'Unknown');
        offset += 1;

        // Read username length (4 bytes) then username
        const usernameLength = data.readUInt32LE(offset);
        offset += 4;
        const username = data.slice(offset, offset + usernameLength).toString('utf8');
        console.log('Username:', username);
        offset += usernameLength;

        // Read bio length (4 bytes) then bio
        const bioLength = data.readUInt32LE(offset);
        offset += 4;
        const bio = data.slice(offset, offset + bioLength).toString('utf8');
        console.log('Bio:', bio);

      } catch (parseError) {
        console.log('Error parsing account data:', parseError.message);
      }

    } else {
      console.log('\n❌ User profile account does not exist');
      console.log('This means the transaction might have failed or the account creation was not successful');
    }

    // Also check recent transactions for your wallet
    console.log('\n🔍 Checking recent transactions...');
    const signatures = await connection.getSignaturesForAddress(userWallet, { limit: 10 });

    if (signatures.length > 0) {
      console.log(`Found ${signatures.length} recent transactions:`);
      for (let i = 0; i < Math.min(3, signatures.length); i++) {
        const sig = signatures[i];
        console.log(`  ${i + 1}. ${sig.signature} - ${sig.err ? 'FAILED' : 'SUCCESS'} - ${new Date(sig.blockTime * 1000).toLocaleString()}`);

        // Get transaction details
        if (!sig.err) {
          try {
            const tx = await connection.getTransaction(sig.signature, { commitment: 'confirmed' });
            if (tx && tx.meta && tx.meta.logMessages) {
              const programLogs = tx.meta.logMessages.filter(log => log.includes(PROGRAM_ID));
              if (programLogs.length > 0) {
                console.log('    Program logs:', programLogs);
              }
            }
          } catch (txError) {
            console.log('    Could not fetch transaction details');
          }
        }
      }
    } else {
      console.log('No recent transactions found');
    }

  } catch (error) {
    console.error('Error checking user profile:', error);
  }
}

checkUserProfile();