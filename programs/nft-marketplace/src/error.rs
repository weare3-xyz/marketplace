use anchor_lang::prelude::*;

#[error_code]
pub enum MarketplaceError {
    #[msg("Unauthorized access")]
    UnauthorizedAccess,

    #[msg("Username too long")]
    UsernameTooLong,

    #[msg("Bio too long")]
    BioTooLong,

    #[msg("Avatar URI too long")]
    AvatarUriTooLong,

    #[msg("Website URL too long")]
    WebsiteTooLong,

    #[msg("Twitter handle too long")]
    TwitterTooLong,

    #[msg("Invalid role for this action")]
    InvalidRole,

    #[msg("Marketplace is paused")]
    MarketplacePaused,

    #[msg("User profile not found")]
    UserProfileNotFound,

    #[msg("User profile already exists")]
    UserProfileAlreadyExists,

    #[msg("Invalid input")]
    InvalidInput,

    #[msg("Insufficient permissions")]
    InsufficientPermissions,
}
