const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram } = require("@solana/web3.js");

async function initializeMarketplace() {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NftMarketplace;

  // Derive marketplace config PDA
  const [marketplaceConfigPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("marketplace")],
    program.programId
  );

  try {
    // Check if marketplace is already initialized
    const marketplaceConfig = await program.account.marketplaceConfig.fetch(marketplaceConfigPDA);
    console.log("✅ Marketplace already initialized with authority:", marketplaceConfig.authority.toString());
    return;
  } catch (error) {
    // Marketplace not initialized, proceed with initialization
    console.log("🚀 Initializing marketplace...");
  }

  try {
    const tx = await program.methods
      .initialize()
      .accounts({
        marketplaceConfig: marketplaceConfigPDA,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc({
        commitment: 'confirmed'
      });

    console.log("✅ Marketplace initialized successfully!");
    console.log("📝 Transaction signature:", tx);
    console.log("🏪 Marketplace Config PDA:", marketplaceConfigPDA.toString());
    console.log("👤 Authority:", provider.wallet.publicKey.toString());

    // Verify initialization
    const marketplaceConfig = await program.account.marketplaceConfig.fetch(marketplaceConfigPDA);
    console.log("📊 Marketplace Fee (bps):", marketplaceConfig.marketplaceFeeBp);
    console.log("👥 Total Users:", marketplaceConfig.totalUsers.toString());

  } catch (error) {
    console.error("❌ Error initializing marketplace:", error);
    throw error;
  }
}

initializeMarketplace().catch(console.error);