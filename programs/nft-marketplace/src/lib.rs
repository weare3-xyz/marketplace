pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("9AvbivndosEuSExjRmdJQz1NswXCvbDzeHVBg4Ls4cDw");

#[program]
pub mod nft_marketplace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }

    pub fn create_user_profile(
        ctx: Context<CreateUserProfile>,
        input: state::UserProfileInput,
    ) -> Result<()> {
        instructions::user::create_user_profile(ctx, input)
    }

    pub fn update_user_profile(
        ctx: Context<UpdateUserProfile>,
        input: state::UserProfileInput,
    ) -> Result<()> {
        instructions::user::update_user_profile(ctx, input)
    }
}
