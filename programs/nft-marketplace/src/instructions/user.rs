use anchor_lang::prelude::*;
use crate::state::{UserProfile, UserProfileInput, UserStats, MarketplaceConfig};
use crate::error::MarketplaceError;

#[derive(Accounts)]
pub struct CreateUserProfile<'info> {
    #[account(
        init,
        payer = authority,
        space = UserProfile::LEN,
        seeds = [b"user_profile", authority.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        init,
        payer = authority,
        space = UserStats::LEN,
        seeds = [b"user_stats", user_profile.key().as_ref()],
        bump
    )]
    pub user_stats: Account<'info, UserStats>,

    #[account(
        mut,
        seeds = [MarketplaceConfig::MARKETPLACE_SEED],
        bump = marketplace_config.bump
    )]
    pub marketplace_config: Account<'info, MarketplaceConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUserProfile<'info> {
    #[account(
        mut,
        seeds = [b"user_profile", authority.key().as_ref()],
        bump = user_profile.bump,
        has_one = authority @ MarketplaceError::UnauthorizedAccess
    )]
    pub user_profile: Account<'info, UserProfile>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetUserProfile<'info> {
    #[account(
        seeds = [b"user_profile", user_authority.key().as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    /// CHECK: This is just used for deriving the PDA
    pub user_authority: UncheckedAccount<'info>,
}

pub fn create_user_profile(
    ctx: Context<CreateUserProfile>,
    input: UserProfileInput,
) -> Result<()> {
    let user_profile = &mut ctx.accounts.user_profile;
    let user_stats = &mut ctx.accounts.user_stats;
    let marketplace_config = &mut ctx.accounts.marketplace_config;
    let authority = &ctx.accounts.authority;

    // Validate input lengths
    require!(
        input.username.len() <= UserProfile::MAX_USERNAME_LEN,
        MarketplaceError::UsernameTooLong
    );
    require!(
        input.bio.len() <= UserProfile::MAX_BIO_LEN,
        MarketplaceError::BioTooLong
    );
    require!(
        input.avatar_uri.len() <= UserProfile::MAX_AVATAR_URI_LEN,
        MarketplaceError::AvatarUriTooLong
    );
    require!(
        input.website.len() <= UserProfile::MAX_WEBSITE_LEN,
        MarketplaceError::WebsiteTooLong
    );
    require!(
        input.twitter.len() <= UserProfile::MAX_TWITTER_LEN,
        MarketplaceError::TwitterTooLong
    );

    let clock = Clock::get()?;
    let current_timestamp = clock.unix_timestamp;

    // Initialize user profile
    user_profile.authority = authority.key();
    user_profile.role = input.role;
    user_profile.username = input.username;
    user_profile.bio = input.bio;
    user_profile.avatar_uri = input.avatar_uri;
    user_profile.website = input.website;
    user_profile.twitter = input.twitter;
    user_profile.created_at = current_timestamp;
    user_profile.updated_at = current_timestamp;
    user_profile.is_verified = false;
    user_profile.nft_count = 0;
    user_profile.collection_count = 0;
    user_profile.bump = ctx.bumps.user_profile;

    // Initialize user stats
    user_stats.user_profile = user_profile.key();
    user_stats.nfts_created = 0;
    user_stats.nfts_sold = 0;
    user_stats.nfts_purchased = 0;
    user_stats.total_earned = 0;
    user_stats.total_spent = 0;
    user_stats.collections_curated = 0;
    user_stats.last_activity = current_timestamp;
    user_stats.bump = ctx.bumps.user_stats;

    // Update marketplace stats
    marketplace_config.total_users = marketplace_config.total_users.checked_add(1).unwrap();

    msg!(
        "User profile created for {} with role {:?}",
        authority.key(),
        user_profile.role
    );

    Ok(())
}

pub fn update_user_profile(
    ctx: Context<UpdateUserProfile>,
    input: UserProfileInput,
) -> Result<()> {
    let user_profile = &mut ctx.accounts.user_profile;

    // Validate input lengths (same as create)
    require!(
        input.username.len() <= UserProfile::MAX_USERNAME_LEN,
        MarketplaceError::UsernameTooLong
    );
    require!(
        input.bio.len() <= UserProfile::MAX_BIO_LEN,
        MarketplaceError::BioTooLong
    );
    require!(
        input.avatar_uri.len() <= UserProfile::MAX_AVATAR_URI_LEN,
        MarketplaceError::AvatarUriTooLong
    );
    require!(
        input.website.len() <= UserProfile::MAX_WEBSITE_LEN,
        MarketplaceError::WebsiteTooLong
    );
    require!(
        input.twitter.len() <= UserProfile::MAX_TWITTER_LEN,
        MarketplaceError::TwitterTooLong
    );

    let clock = Clock::get()?;

    // Update profile
    user_profile.role = input.role;
    user_profile.username = input.username;
    user_profile.bio = input.bio;
    user_profile.avatar_uri = input.avatar_uri;
    user_profile.website = input.website;
    user_profile.twitter = input.twitter;
    user_profile.updated_at = clock.unix_timestamp;

    msg!(
        "User profile updated for {} with new role {:?}",
        user_profile.authority,
        user_profile.role
    );

    Ok(())
}