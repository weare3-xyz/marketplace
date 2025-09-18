use anchor_lang::prelude::*;
use crate::state::MarketplaceConfig;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = MarketplaceConfig::LEN,
        seeds = [MarketplaceConfig::MARKETPLACE_SEED],
        bump
    )]
    pub marketplace_config: Account<'info, MarketplaceConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let marketplace_config = &mut ctx.accounts.marketplace_config;
    let authority = &ctx.accounts.authority;

    marketplace_config.authority = authority.key();
    marketplace_config.fee_recipient = authority.key(); // Initially set to authority
    marketplace_config.marketplace_fee_bp = 250; // 2.5% marketplace fee
    marketplace_config.max_royalty_bp = 1000; // 10% max royalty
    marketplace_config.is_paused = false;
    marketplace_config.total_users = 0;
    marketplace_config.total_nfts = 0;
    marketplace_config.total_volume = 0;
    marketplace_config.bump = ctx.bumps.marketplace_config;

    msg!("Marketplace initialized with authority: {:?}", authority.key());
    Ok(())
}
