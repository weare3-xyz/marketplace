# NFT Marketplace on Solana

A decentralized NFT marketplace built on Solana blockchain using Anchor framework and Next.js.

## 🚀 Features

### ✅ **Implemented & Live**
- **Wallet Integration**: Multi-wallet support (Phantom, Solflare) with seamless connection
- **Role-Based Access**: Three distinct user roles (Artist, Collector, Curator) with different permissions
- **Dynamic Role Switching**: Users can change roles seamlessly with blockchain updates
- **Complete Profile Management**: Full on-chain profile system with editing capabilities
- **Profile Dashboard**: Dedicated profile page with real-time blockchain data
- **Profile Dropdown**: Quick access profile viewer with completeness tracking
- **Smart Contract User Profiles**: Comprehensive on-chain user profile system
- **Deployed on Devnet**: Fully functional smart contracts deployed and tested on Solana devnet
- **Modern UI**: Responsive design with Tailwind CSS and SSR/hydration support
- **Smart Contracts**: Written in Rust using Anchor framework with comprehensive state management
- **TypeScript**: Full type safety across the stack

### 🚧 **Coming Next**
- **NFT Trading**: Listing, purchasing, and marketplace browsing
- **Collection Management**: NFT collections and curation tools
- **Advanced Features**: Auctions, offers, and royalty distribution

## 🛠️ Tech Stack

### Blockchain
- **Solana**: Layer 1 blockchain for smart contracts
- **Anchor**: Rust framework for Solana development
- **Metaplex**: NFT standard protocol

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **@solana/wallet-adapter**: Wallet integration library

### Development Tools
- **Anchor CLI**: Smart contract development
- **Solana CLI**: Blockchain interaction
- **npm/yarn**: Package management

## 📦 Project Structure

```
nft-marketplace/
├── programs/
│   └── nft-marketplace/          # Anchor smart contracts
│       ├── src/
│       │   ├── lib.rs           # Main program entry
│       │   ├── instructions/    # Contract instructions (user management)
│       │   ├── state/          # Data structures (UserProfile, UserStats, MarketplaceConfig)
│       │   └── error.rs        # Custom errors
│       └── Cargo.toml
├── app/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Home/Dashboard
│   │   │   ├── profile/        # Profile management page
│   │   │   └── layout.tsx      # Root layout
│   │   ├── components/         # React components
│   │   │   ├── ProfileDropdown.tsx    # Profile avatar dropdown
│   │   │   ├── SmartContractRoleSelection.tsx
│   │   │   ├── WalletProvider.tsx
│   │   │   └── WalletButton.tsx
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks (useUserProfile, useProgram)
│   │   ├── lib/                # Utility libraries
│   │   └── types/              # TypeScript types
│   ├── package.json
│   └── next.config.ts
├── tests/                       # Smart contract tests
├── migrations/                  # Deployment scripts
├── index_users.js              # User indexing utility
├── check_user_profile.js       # Profile verification utility
├── Anchor.toml                 # Anchor configuration
└── package.json               # Workspace dependencies
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Rust** (latest stable version)
- **Solana CLI** (v1.17.0 or higher)
- **Anchor CLI** (v0.28.0 or higher)
- **Git**

### Installation Commands

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Install Anchor CLI
npm install -g @coral-xyz/anchor-cli
```

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/weare3-xyz/marketplace.git
cd marketplace
```

### 2. Install Dependencies

```bash
# Install Anchor dependencies
yarn install

# Install Frontend dependencies
cd app
npm install
cd ..
```

### 3. Configure Solana

```bash
# Set config to devnet
solana config set --url devnet

# Create a new keypair (if you don't have one)
solana-keygen new

# Airdrop SOL for testing
solana airdrop 2
```

### 4. Build Smart Contracts

```bash
# Build the Anchor program
anchor build

# Run tests
anchor test
```

### 5. Start Development Server

```bash
# Start the frontend
cd app
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🌐 Live Demo & Deployment Status

### 🚀 Live Application
**Try it now: [https://app-topaz-three.vercel.app](https://app-topaz-three.vercel.app)**

Anyone can now access and test the NFT marketplace! Simply:
1. Visit the live demo
2. Connect your Solana wallet (set to testnet mode)
3. Select your role and create an on-chain profile
4. Test the role-based functionality

### Devnet Deployment ✅
- **Program ID**: `9AvbivndosEuSExjRmdJQz1NswXCvbDzeHVBg4Ls4cDw`
- **Network**: Solana Devnet
- **Status**: ✅ Active and functional
- **Marketplace**: ✅ Initialized (2.5% fee, 10% max royalty)
- **Frontend**: ✅ Deployed on Vercel
- **Current Users**: 4 registered profiles with active role changing
- **Last Activity**: Role changes and profile updates working perfectly (Sep 22, 2025)

### 📊 Live Marketplace Statistics
- **Total Users**: 4 on-chain profiles
- **Role Distribution**:
  - 🎭 Curators: 2 users (50%)
  - 🎨 Artists: 1 user (25%)
  - 👥 Collectors: 1 user (25%)
- **Profile Completion**: Users actively filling profiles (60-80% complete)
- **Recent Activity**: Multiple role changes tested and working perfectly
- **Role Changes**: 2 users have successfully changed roles multiple times

### Testing the Live Application
1. **Set up your wallet for devnet**:
   ```bash
   # In your Solana wallet (Phantom/Solflare), switch to "Testnet" mode
   ```

2. **Get devnet SOL**:
   ```bash
   solana airdrop 2 --url devnet
   # Or use: https://faucet.solana.com/
   ```

3. **Test the complete profile system**:
   - Connect your wallet at the live app
   - Select a role (Artist, Collector, or Curator)
   - Create your on-chain profile with username and bio
   - Click your profile avatar to view the dropdown
   - Navigate to `/profile` to edit your complete profile
   - Update all profile fields (website, Twitter, avatar, etc.)
   - Test role changing by clicking "Change Role" button
   - Select a different role and confirm the blockchain update

4. **Monitor your profile and role changes**:
   ```bash
   # Index all marketplace users
   node index_users.js

   # Check for recent role changes
   node test_role_change.js

   # Check specific user profile details
   node check_user_profile.js
   ```

## 🧪 Testing

### Smart Contract Tests

```bash
# Run Anchor tests
anchor test

# Run tests with logs
anchor test --skip-local-validator
```

### Frontend Testing

```bash
cd app
npm run test        # Run unit tests
npm run test:e2e    # Run e2e tests (when available)
```

## 🚀 Deployment

### Smart Contract Deployment

1. **Configure for Mainnet**:
   ```bash
   solana config set --url mainnet-beta
   ```

2. **Deploy Program**:
   ```bash
   anchor deploy
   ```

### Frontend Deployment

The frontend can be deployed to various platforms:

- **Vercel** (Recommended)
- **Netlify**
- **AWS Amplify**

```bash
cd app
npm run build
```

## 🔑 Environment Variables

Create `.env.local` in the `app` directory:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

## 📖 API Reference

### Smart Contract Instructions

#### User Management (Implemented ✅)
- `initialize_marketplace()`: Initialize the marketplace configuration
- `create_user_profile()`: Create a new user profile with role selection
- `update_user_profile()`: Update existing user profile information and role changes

#### NFT Trading (Coming Next)
- `list_nft()`: List an NFT for sale
- `buy_nft()`: Purchase a listed NFT
- `cancel_listing()`: Cancel an active listing
- `make_offer()`: Make an offer on an NFT
- `accept_offer()`: Accept an offer

#### Account Types
- **UserProfile**: Stores user role, username, bio, and social links
- **UserStats**: Tracks user's NFT activity and reputation
- **MarketplaceConfig**: Global marketplace settings and configuration

### Frontend Components & Pages

#### Implemented ✅
- **Core Components**:
  - `WalletProvider`: Wallet connection management with SSR support
  - `UserContext`: User state management and role persistence
  - `SmartContractRoleSelection`: Role selection UI with blockchain integration
  - `RoleChangeModal`: Modal interface for seamless role switching
  - `ProfileSyncer`: Automatic blockchain profile synchronization
  - `WalletButton`: Dynamic wallet connection component
- **Profile Management**:
  - `ProfileDropdown`: Avatar dropdown with profile preview and quick actions
  - `ProfilePage` (`/profile`): Complete profile editing interface with real-time blockchain sync
- **Custom Hooks**:
  - `useUserProfile`: Blockchain profile operations (create, update, fetch)
  - `useProgram`: Anchor program connection and management

#### Profile Management Features ✅
- **Profile Creation**: On-chain profile creation with role selection
- **Dynamic Role Switching**:
  - Seamless role changes through modal interface
  - Preserves existing profile data during role changes
  - Updates blockchain via `updateUserProfile()` smart contract function
  - Multiple role changes supported per user
- **Profile Editing**: Full profile editing with all supported fields:
  - Username (max 32 chars)
  - Bio (max 200 chars)
  - Avatar URL (max 200 chars)
  - Website (max 100 chars)
  - Twitter handle (max 50 chars)
  - Role switching (Artist/Collector/Curator)
- **Profile Completeness**: Visual progress tracking with missing field indicators
- **Real-time Updates**: Instant blockchain synchronization
- **Role-based UI**: Dynamic theming based on user role
- **Automatic Profile Sync**: Background sync between blockchain and frontend state

#### Coming Next
- `NFTCard`: Display NFT information
- `ListingForm`: Create new NFT listings
- `MarketplaceGrid`: Display marketplace items
- `CollectionManager`: NFT collection management tools

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and configuration
- [x] Wallet integration
- [x] Basic UI components
- [x] Smart contract structure

### Phase 2: User Management System ✅
- [x] Smart contract architecture with comprehensive user management
- [x] Role-based access system (Artist, Collector, Curator)
- [x] Complete on-chain user profile creation and management
- [x] Profile editing system with all profile fields
- [x] Deployed smart contracts on Solana devnet
- [x] Frontend integration with smart contracts
- [x] Transaction handling and wallet interaction
- [x] Profile dropdown with completeness tracking
- [x] Dedicated profile management page (`/profile`)
- [x] Real-time blockchain synchronization
- [x] Dynamic role switching with blockchain updates
- [x] Multiple role changes per user supported
- [x] Profile data preservation during role changes
- [x] Automatic profile synchronization between blockchain and frontend
- [x] Profile indexing and monitoring tools

### Phase 3: NFT Trading (Next Priority)
- [ ] NFT listing functionality
- [ ] Purchase mechanism
- [ ] Marketplace browsing interface
- [ ] Collection management tools

### Phase 4: Advanced Features
- [ ] Auction system
- [ ] Offer/bidding mechanism
- [ ] Royalty distribution
- [ ] Advanced collection management

### Phase 5: Polish & Launch
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Security audit
- [ ] Mainnet deployment

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Ensure you have a Solana wallet installed
   - Check that you're on the correct network (devnet/mainnet)

2. **Build Errors**
   - Run `anchor clean` and rebuild
   - Check Rust and Anchor versions

3. **Frontend Issues**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility

4. **Profile Issues**
   - Ensure you're connected to the correct wallet
   - Check that you have devnet SOL for transactions
   - Try refreshing the page if profile data doesn't load

## 🛠️ Development Utilities

### User Management Scripts
```bash
# Index all users on the marketplace
node index_users.js

# Check specific user profile details
node check_user_profile.js

# Initialize marketplace (if needed)
node init_marketplace.js
```

### Profile Monitoring
- **Real-time indexing**: Track all marketplace users and their profile completion
- **Profile verification**: Verify blockchain data matches expected format
- **Activity monitoring**: Track profile updates and user activity

## 📚 Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Metaplex Documentation](https://docs.metaplex.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Solana Foundation for the blockchain infrastructure
- Anchor team for the development framework
- Metaplex for NFT standards
- The amazing Solana developer community

---

**Built with ❤️ by [weare3.xyz](https://weare3.xyz)**

For questions and support, please open an issue or contact us at [contact@weare3.xyz](mailto:contact@weare3.xyz)