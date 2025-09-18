use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Debug)]
pub enum UserRole {
    Artist,
    Collector,
    Curator,
}

impl Default for UserRole {
    fn default() -> Self {
        UserRole::Collector
    }
}

#[account]
pub struct UserProfile {
    pub authority: Pubkey,           // Wallet address that owns this profile
    pub role: UserRole,              // User's selected role
    pub username: String,            // Display name (max 32 chars)
    pub bio: String,                 // User bio (max 200 chars)
    pub avatar_uri: String,          // IPFS/Arweave URI for avatar (max 200 chars)
    pub website: String,             // Website URL (max 100 chars)
    pub twitter: String,             // Twitter handle (max 50 chars)
    pub created_at: i64,             // Unix timestamp
    pub updated_at: i64,             // Unix timestamp
    pub is_verified: bool,           // Verification status
    pub nft_count: u32,              // Number of NFTs created (for artists)
    pub collection_count: u32,       // Number of collections owned
    pub bump: u8,                    // PDA bump seed
}

impl UserProfile {
    pub const MAX_USERNAME_LEN: usize = 32;
    pub const MAX_BIO_LEN: usize = 200;
    pub const MAX_AVATAR_URI_LEN: usize = 200;
    pub const MAX_WEBSITE_LEN: usize = 100;
    pub const MAX_TWITTER_LEN: usize = 50;

    pub const LEN: usize = 8 +        // discriminator
        32 +                          // authority pubkey
        1 +                           // role enum
        4 + Self::MAX_USERNAME_LEN +  // username string
        4 + Self::MAX_BIO_LEN +       // bio string
        4 + Self::MAX_AVATAR_URI_LEN + // avatar_uri string
        4 + Self::MAX_WEBSITE_LEN +   // website string
        4 + Self::MAX_TWITTER_LEN +   // twitter string
        8 +                           // created_at i64
        8 +                           // updated_at i64
        1 +                           // is_verified bool
        4 +                           // nft_count u32
        4 +                           // collection_count u32
        1;                            // bump u8

    pub fn validate_role_permissions(&self, required_role: &UserRole) -> bool {
        match required_role {
            UserRole::Artist => matches!(self.role, UserRole::Artist),
            UserRole::Collector => true, // All roles can collect
            UserRole::Curator => matches!(self.role, UserRole::Curator),
        }
    }

    pub fn can_create_nft(&self) -> bool {
        matches!(self.role, UserRole::Artist)
    }

    pub fn can_curate(&self) -> bool {
        matches!(self.role, UserRole::Curator)
    }

    pub fn can_moderate(&self) -> bool {
        matches!(self.role, UserRole::Curator)
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UserProfileInput {
    pub role: UserRole,
    pub username: String,
    pub bio: String,
    pub avatar_uri: String,
    pub website: String,
    pub twitter: String,
}