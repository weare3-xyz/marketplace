use anchor_lang::prelude::*;

#[account]
pub struct MarketplaceConfig {
    pub authority: Pubkey,           // Admin authority
    pub fee_recipient: Pubkey,       // Where marketplace fees go
    pub marketplace_fee_bp: u16,     // Marketplace fee in basis points (100 = 1%)
    pub max_royalty_bp: u16,         // Maximum royalty in basis points
    pub is_paused: bool,             // Emergency pause
    pub total_users: u64,            // Total registered users
    pub total_nfts: u64,             // Total NFTs listed
    pub total_volume: u64,           // Total trading volume in lamports
    pub bump: u8,                    // PDA bump seed
}

impl MarketplaceConfig {
    pub const LEN: usize = 8 +       // discriminator
        32 +                         // authority
        32 +                         // fee_recipient
        2 +                          // marketplace_fee_bp
        2 +                          // max_royalty_bp
        1 +                          // is_paused
        8 +                          // total_users
        8 +                          // total_nfts
        8 +                          // total_volume
        1;                           // bump

    pub const MARKETPLACE_SEED: &'static [u8] = b"marketplace";
}

#[account]
pub struct UserStats {
    pub user_profile: Pubkey,        // Reference to user profile
    pub nfts_created: u32,           // NFTs created by this user
    pub nfts_sold: u32,              // NFTs sold by this user
    pub nfts_purchased: u32,         // NFTs purchased by this user
    pub total_earned: u64,           // Total SOL earned from sales
    pub total_spent: u64,            // Total SOL spent on purchases
    pub collections_curated: u32,    // Collections curated (for curators)
    pub last_activity: i64,          // Last activity timestamp
    pub bump: u8,                    // PDA bump seed
}

impl UserStats {
    pub const LEN: usize = 8 +       // discriminator
        32 +                         // user_profile
        4 +                          // nfts_created
        4 +                          // nfts_sold
        4 +                          // nfts_purchased
        8 +                          // total_earned
        8 +                          // total_spent
        4 +                          // collections_curated
        8 +                          // last_activity
        1;                           // bump
}