# NFT Marketplace on Solana

A decentralized NFT marketplace built on Solana blockchain using Anchor framework and Next.js.

## 🚀 Features

- **Wallet Integration**: Multi-wallet support (Phantom, Solflare) with seamless connection
- **Role-Based Access**: Three distinct user roles (Artist, Collector, Curator) with different permissions
- **Smart Contract User Profiles**: On-chain user profile system with role-based functionality
- **Deployed on Devnet**: Fully functional smart contracts deployed and tested on Solana devnet
- **Decentralized Trading**: Built on Solana for fast, low-cost transactions
- **Modern UI**: Responsive design with Tailwind CSS and SSR/hydration support
- **Smart Contracts**: Written in Rust using Anchor framework with comprehensive state management
- **TypeScript**: Full type safety across the stack

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
│       │   ├── instructions/    # Contract instructions
│       │   ├── state/          # Data structures
│       │   └── error.rs        # Custom errors
│       └── Cargo.toml
├── app/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   └── components/         # React components
│   ├── package.json
│   └── next.config.ts
├── tests/                       # Smart contract tests
├── migrations/                  # Deployment scripts
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
- **Status**: Active and functional
- **Marketplace**: Initialized and ready
- **Frontend**: Deployed on Vercel

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

3. **Test user profile creation**:
   - Connect your wallet at `http://localhost:3000`
   - Select a role (Artist, Collector, or Curator)
   - Fill in username and bio
   - Sign the transaction to create your on-chain profile

4. **Verify your profile**:
   ```bash
   # Run the verification script
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
- `update_user_profile()`: Update existing user profile information

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

### Frontend Components

#### Implemented ✅
- `WalletProvider`: Wallet connection management with SSR support
- `UserContext`: User state management and role persistence
- `SmartContractRoleSelection`: Role selection UI with blockchain integration
- `WalletButton`: Dynamic wallet connection component

#### Coming Next
- `NFTCard`: Display NFT information
- `ListingForm`: Create new NFT listings
- `MarketplaceGrid`: Display marketplace items
- `UserProfile`: User profile display and management

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

### Phase 2: Core Features ✅
- [x] Smart contract architecture with user management
- [x] Role-based access system (Artist, Collector, Curator)
- [x] User profile creation and management on-chain
- [x] Deployed smart contracts on Solana devnet
- [x] Frontend integration with smart contracts
- [x] Transaction handling and wallet interaction
- [ ] NFT listing functionality (Next)
- [ ] Purchase mechanism (Next)
- [ ] Marketplace browsing (Next)

### Phase 3: Advanced Features
- [ ] Auction system
- [ ] Offer/bidding mechanism
- [ ] Royalty distribution
- [ ] Collection management

### Phase 4: Polish & Launch
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