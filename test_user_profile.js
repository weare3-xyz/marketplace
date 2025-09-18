const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");

async function testUserProfileCreation() {
  // Configure the client to use the devnet cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NftMarketplace;

  // Derive PDAs
  const [marketplaceConfigPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("marketplace")],
    program.programId
  );

  const [userProfilePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_profile"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  const [userStatsPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_stats"), userProfilePDA.toBuffer()],
    program.programId
  );

  console.log("🔍 Checking if user profile exists...");

  try {
    // Check if user profile already exists
    const existingProfile = await program.account.userProfile.fetch(userProfilePDA);
    console.log("✅ User profile already exists!");
    console.log("👤 Authority:", existingProfile.authority.toString());
    console.log("🎭 Role:", Object.keys(existingProfile.role)[0]);
    console.log("📝 Username:", existingProfile.username);
    console.log("📄 Bio:", existingProfile.bio);
    return;
  } catch (error) {
    // User profile doesn't exist, proceed with creation
    console.log("🚀 Creating new user profile...");
  }

  try {
    const tx = await program.methods
      .createUserProfile({
        role: { artist: {} }, // Testing with artist role
        username: "Test_Artist_User",
        bio: "Testing artist profile creation on devnet",
        avatarUri: "",
        website: "",
        twitter: "",
      })
      .accounts({
        userProfile: userProfilePDA,
        userStats: userStatsPDA,
        marketplaceConfig: marketplaceConfigPDA,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc({
        commitment: 'confirmed'
      });

    console.log("✅ User profile created successfully!");
    console.log("📝 Transaction signature:", tx);
    console.log("👤 User Profile PDA:", userProfilePDA.toString());
    console.log("📊 User Stats PDA:", userStatsPDA.toString());

    // Verify creation
    const userProfile = await program.account.userProfile.fetch(userProfilePDA);
    const userStats = await program.account.userStats.fetch(userStatsPDA);

    console.log("\n📋 Profile Details:");
    console.log("🎭 Role:", Object.keys(userProfile.role)[0]);
    console.log("📝 Username:", userProfile.username);
    console.log("📄 Bio:", userProfile.bio);
    console.log("✅ Verified:", userProfile.isVerified);
    console.log("🎨 NFT Count:", userProfile.nftCount);

    console.log("\n📈 Stats:");
    console.log("🎨 NFTs Created:", userStats.nftsCreated);
    console.log("💰 Total Earned:", userStats.totalEarned.toString());
    console.log("🛒 Total Spent:", userStats.totalSpent.toString());

  } catch (error) {
    console.error("❌ Error creating user profile:", error);
    throw error;
  }
}

testUserProfileCreation().catch(console.error);