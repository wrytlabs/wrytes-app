# Wrytes - Professional DeFi Management Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css)
![Wagmi](https://img.shields.io/badge/Wagmi-2.16.1-purple?logo=wagmi)

**A comprehensive DeFi management platform built for professional users**

[Live Demo](https://wrytes.io) • [Documentation](./CLAUDE.md) • [API Docs](https://api.wrytes.io)

</div>

---

## 🎯 **Platform Vision**

**Wrytes** is not just a vault management application - it's a **comprehensive DeFi management platform** designed with a **generic, extensible architecture**. The vault feature is merely the **first implementation** of a broader vision for professional DeFi portfolio management.

### **🏗️ Core Business Philosophy:**
- **💰 Profit-Driven Independence** - Operating exclusively with company assets, profits fund R&D
- **🔬 Research-First Development** - Every tool serves our research and innovation goals
- **🧩 Component Reusability** - Maximize reuse of existing components before building new ones
- **📱 Mobile-First Responsive** - Consistent patterns across all features
- **🏢 Swiss Precision** - Built with meticulous attention to detail and quality
- **🔧 Feature-Based Structure** - Each major feature is self-contained and pluggable

### **🚀 Business & Technology Roadmap:**
- **💰 Proprietary Trading Operations** (Core) - Bitcoin option strategies funding R&D
- **🛠️ Technical Services** (Revenue) - Development services for clients and partners
- **🚀 Platform Development** (Innovation) - Proprietary tools and research prototyping
- **🤝 Strategic Partnerships** (Growth) - M&A and technology sharing agreements
- **🏦 DeFi Management Tools** (Current) - Multi-protocol yield optimization platform
- **🔄 Transaction Queue Management** (Current) - Redux-powered batch operations
- **📊 Advanced Trading Tools** (Future) - Enhanced Bitcoin strategy platforms
- **🔬 Blockchain Research Tools** (Future) - Cutting-edge protocol development

## 🏢 About Wrytes AG

**Wrytes AG** is a Swiss company based in Zug, Switzerland (Crypto Valley), specializing in:
- **Proprietary Bitcoin Trading** - Option strategies funding continuous R&D operations
- **Blockchain Technology R&D** - Cutting-edge protocol development and experimentation
- **Software Development Services** - Expert technical services for clients and partners
- **Platform Development** - Proprietary tools for internal operations and research
- **Strategic Partnerships** - Technology sharing and acquisition opportunities

## ✨ Current Features

### 🔗 **Web3 Integration**
- **Multi-Wallet Support** - MetaMask, WalletConnect, Coinbase, Safe
- **Ethereum + Base** - Multi-chain support with automatic switching
- **Contract Interactions** - Seamless vault deposits/withdrawals
- **Real-Time Balances** - Live user portfolio tracking

### 🏦 **Vault Management** *(First Feature)*
- **Morpho Vaults** - Alpha USDC Core, USDU Core, ZCHF Vault with enhanced GraphQL integration
- **Curve Pools** - DAI/USDC/USDT, USDU/USDC liquidity provision  
- **Savings Vaults** - ZCHF native savings, Staked Falcon USD
- **Dynamic APY** - Real-time yield calculations from multiple protocol adapters
- **Enhanced UX** - Improved modals with `managedBy` field display

### 🎨 **User Experience**
- **Dark Theme UI** - Professional Swiss design aesthetic
- **Responsive Design** - Mobile-first, works on all devices
- **Loading States** - Skeleton components and smooth transitions
- **Error Handling** - Graceful fallbacks and user-friendly messages
- **Transaction Queue** - Redux-powered batch transaction management UI

### 🛡️ **Security & Compliance**
- **Role-Based Access** - Admin, moderator, user permissions
- **Signature Auth** - No private key storage, message signing only
- **Input Validation** - Comprehensive Zod schema validation
- **Swiss Standards** - Built for regulatory compliance

## 🛠️ Technology Stack

### **Core Framework**
- **[Next.js 15.4.5](https://nextjs.org/)** - React framework with Page Router
- **[React 19.1.0](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5.8.2](https://www.typescriptlang.org/)** - Full type safety

### **Web3 & Blockchain**
- **[Wagmi 2.16.1](https://wagmi.sh/)** - React hooks for Ethereum
- **[Viem 2.33.2](https://viem.sh/)** - TypeScript Ethereum library
- **[Reown AppKit 1.6.4](https://reown.com/)** - Multi-wallet connection
- **[Apollo Client 3.13.9](https://www.apollographql.com/)** - GraphQL state management

### **UI & Styling**
- **[Tailwind CSS 3.4.17](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion 12.23.12](https://www.framer.com/motion/)** - Advanced animations
- **[Headless UI 2.2.7](https://headlessui.com/)** - Accessible UI components
- **[FontAwesome 7.0.0](https://fontawesome.com/)** - Professional icon system

### **State Management**
- **[Redux Toolkit 2.8.2](https://redux-toolkit.js.org/)** - Global state management
- **[React Redux 9.2.0](https://react-redux.js.org/)** - React bindings for Redux
- **[Redux Persist 6.0.0](https://github.com/rt2zz/redux-persist)** - State persistence

### **Forms & Validation**
- **[React Hook Form 7.61.1](https://react-hook-form.com/)** - Performant forms
- **[Zod 4.0.14](https://zod.dev/)** - Schema validation
- **[React Hot Toast 2.5.2](https://react-hot-toast.com/)** - Toast notifications

### **Development Tools**
- **[Turbopack](https://turbo.build/)** - Fast development bundler
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[GraphQL Codegen](https://the-guild.dev/graphql/codegen)** - Type-safe GraphQL

## 📁 Project Structure

```
wrytes/
├── components/              # 🧩 Reusable UI Components
│   ├── ui/                 # Generic UI primitives (ALWAYS REUSE THESE)
│   │   ├── Button.tsx      # Multi-variant button system
│   │   ├── Card.tsx        # Flexible card component
│   │   ├── Modal/          # Modal system with variants
│   │   ├── Stats/          # Metric display components
│   │   └── TransactionQueue/ # Generic transaction management
│   ├── features/           # 🚀 Feature-specific components
│   │   ├── Dashboard/      # Dashboard feature module
│   │   ├── Vaults/         # Vault management (FIRST FEATURE)
│   │   └── [Future]/       # Future feature modules
│   ├── layout/             # 📐 Layout components
│   └── sections/           # 🏠 Landing page sections
├── hooks/                  # 🔗 Custom React hooks
│   ├── adapter/            # Protocol adapter hooks (Falcon, Morpho)
│   ├── redux/              # Redux state hooks
│   ├── ui/                 # Generic UI hooks
│   ├── vaults/             # Vault-specific hooks
│   ├── web3/               # Web3 interaction hooks
│   └── [feature]/          # Feature-specific hooks
├── lib/                    # 🛠️ Business logic & integrations
│   ├── vaults/             # Vault configurations (extensible)
│   ├── web3/               # Web3 configuration
│   ├── graphql/            # GraphQL client & queries
│   └── utils/              # Utility functions
├── redux/                  # 📊 Global state management
│   └── slices/             # Feature-specific slices
└── pages/                  # 🚀 Next.js pages
```

## 🧩 **Component Reusability Strategy**

### **CRITICAL: Always Reuse Existing Components**

**Before building new components, check these locations:**

1. **`components/ui/`** - Generic UI primitives
   - `Button.tsx` - Supports primary, secondary, ghost variants
   - `Card.tsx` - Flexible card with header, content, footer
   - `Modal/` - Complete modal system with confirm variants
   - `Stats/` - Metric display with various layouts
   - `TransactionQueue/` - Generic transaction management

2. **`components/features/[existing-feature]/`** - Feature-specific patterns
   - Reuse patterns from `Vaults/` for similar data management
   - Adapt `Dashboard/` patterns for analytics features

3. **`hooks/ui/`** - Generic UI hooks
   - `useModal.ts` - Modal state management

4. **`hooks/adapter/`** - Protocol-specific data fetching hooks
   - `useFalconData.ts` - Falcon protocol integration
   - `useMorphoVaultData.ts` - Enhanced Morpho vault data fetching

5. **`hooks/redux/`** - Redux state management hooks
   - `useTransactionQueue.ts` - Transaction queue management

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** 
- **Yarn** (required, not npm)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/wrytlabs/wrytes.git
cd wrytes

# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env.local

# Configure your environment variables
# Edit .env.local with your API keys and endpoints

# Start development server
yarn dev
```

### Environment Setup

Create `.env.local` with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.wrytes.io
NEXT_PUBLIC_APP_URL=https://wrytes.io
NEXT_PUBLIC_INDEXER_URL=https://indexer.wrytes.io

# Web3 Configuration
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_RPC_URL=your_alchemy_api_key

# Optional: GraphQL APIs
NEXT_PUBLIC_MORPHO_GRAPHQL_ENDPOINT=https://api.morpho.org/graphql
NEXT_PUBLIC_MORPHO_API_KEY=your_morpho_api_key_if_required
```

## 📜 Available Scripts

### **Development**
```bash
yarn dev          # Start development server (with Turbopack)
yarn build        # Build for production
yarn start        # Start production server
yarn type-check   # TypeScript type checking
```

### **Code Quality**
```bash
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint errors automatically
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
```

### **Analysis**
```bash
yarn analyze      # Analyze bundle size
```

## 🏗️ Architecture Overview

### **Component Architecture**
- **Feature-Based Organization** - Components grouped by business domain
- **Composition Pattern** - Reusable component composition
- **Custom Hooks** - Business logic extraction from components
- **TypeScript Interfaces** - Comprehensive type definitions

### **State Management**
- **Redux Toolkit** - Global application state (transactions, user preferences, queue management)
- **Apollo Client Cache** - GraphQL data caching and normalization
- **React Context** - Authentication and theme management
- **Local State** - Component-level UI state

### **Data Flow**
```
User Action → Component → Custom Hook/Adapter → API/Contract → Apollo Cache/Redux → UI Update
```

## 🔐 Authentication System

### **Web3 Authentication Flow**
1. User connects wallet (MetaMask, WalletConnect, etc.)
2. Backend generates unique challenge message
3. User signs message with private key
4. Backend validates signature and issues JWT token
5. Token includes user roles and permissions

### **Role-Based Access Control**
- **👑 Admin** - Full system access, user management
- **🛠️ Moderator** - Limited admin functions
- **👤 User** - Standard app access

## 🏦 Vault System *(First Feature)*

### **Supported Protocols**

| Protocol | Vault | Address | Features |
|----------|--------|---------|----------|
| **Morpho** | Alpha USDC Core | `0xb0f0...8C8` | Real-time APY via enhanced GraphQL |
| **Morpho** | USDU Core | `0xce22...0a` | Automated yield optimization |
| **Morpho** | Alpha ZCHF Vault | `0x...` | Swiss franc denominated |
| **Morpho** | Gauntlet EURC Core | `0x...` | Euro-denominated vault |
| **Curve** | DAI/USDC/USDT | `0x...` | Stable coin liquidity |
| **Curve** | USDU/USDC | `0x...` | USDU pair trading |
| **Savings** | ZCHF Savings | `0x637F...BC` | Time-locked savings |
| **Savings** | Staked Falcon USD | `0x...` | Falcon protocol integration |

### **Data Sources**
- **🔗 Morpho GraphQL API** - Enhanced real-time vault metrics via adapter hooks
- **🦅 Falcon Protocol** - Integrated via `useFalconData` adapter hook
- **📊 Contract Calls** - Direct blockchain data (fallback)
- **💾 Apollo Cache** - 5-minute cache for performance
- **🔄 Redux Store** - Transaction queue and user preferences

## 🚀 **Feature Development Guidelines**

### **New Feature Implementation Pattern:**

1. **Create Feature Directory:**
   ```
   components/features/[FeatureName]/
   ├── index.ts              # Feature exports
   ├── types.ts              # Feature-specific types
   ├── [FeatureName].tsx     # Main feature component
   └── [sub-components].tsx  # Feature sub-components
   ```

2. **Create Feature Hooks:**
   ```
   hooks/[feature]/
   ├── index.ts              # Hook exports
   ├── use[Feature]Data.ts   # Data fetching
   └── use[Feature]Actions.ts # Feature actions
   ```

   **OR use Protocol Adapters:**
   ```
   hooks/adapter/
   ├── use[Protocol]Data.ts  # Protocol-specific data fetching
   ```

3. **Add to Navigation:**
   ```
   lib/navigation/dashboard.ts
   ```

4. **Follow Existing Patterns:**
   - Use `Vaults/` as reference for data-heavy features
   - Use `Dashboard/` as reference for analytics features
   - Reuse `ui/` components extensively

### **Feature Integration Checklist:**
- [ ] Reuse existing UI components from `components/ui/`
- [ ] Create feature-specific hooks in `hooks/[feature]/` or protocol adapters in `hooks/adapter/`
- [ ] Add to navigation system
- [ ] Implement proper loading states
- [ ] Add error boundaries
- [ ] Include proper TypeScript types
- [ ] Add to Redux if global state needed
- [ ] Integrate with transaction queue system if transactions required

## 🚧 Development Roadmap

### **Phase 1: Foundation** ✅ *Completed*
- [x] Next.js project setup with TypeScript
- [x] Dark theme UI system with Tailwind CSS
- [x] Web3 integration with Wagmi and Viem
- [x] Multi-wallet connection support

### **Phase 2: Authentication** ✅ *Completed*
- [x] Wallet-based authentication system
- [x] Role-based access control
- [x] Protected routes and permissions
- [x] Admin dashboard implementation

### **Phase 3: Vault Management** ✅ *Completed*
- [x] Multi-protocol vault integration *(First Feature)*
- [x] Real-time APY and TVL data with enhanced GraphQL
- [x] Morpho GraphQL API integration with adapter hooks
- [x] Falcon protocol integration via `useFalconData`
- [x] Enhanced vault deposit/withdrawal UI with `managedBy` field
- [x] Transaction queue system with Redux integration

### **Phase 4: Platform Expansion** 🔄 *In Progress*
- [ ] Portfolio Analytics - Cross-protocol performance tracking
- [ ] Strategy Builder - Custom DeFi strategy creation
- [ ] Risk Management - Professional risk assessment tools
- [ ] Mobile app development

### **Phase 5: Enterprise Features** 📋 *Planned*
- [ ] Institutional client onboarding
- [ ] Advanced risk management tools
- [ ] Regulatory compliance features
- [ ] White-label solutions

## 📈 Project History

### **🎯 2025 Q1 - Genesis**
- Project conception for Wrytes AG
- Swiss regulatory research and compliance planning
- Technology stack selection and architecture design

### **⚡ 2025 Q1 - Development Sprint**
- Core platform development with Next.js and TypeScript
- Web3 integration with multi-wallet support
- Dark theme UI system implementation
- Authentication system with role management

### **🚀 2025 Q4 - Platform Launch**
- Morpho protocol integration with GraphQL
- Vault management system completion *(First Feature)*
- Admin dashboard and user management
- Production deployment and testing

### **📊 Current Status**
- **Lines of Code**: ~15,000+ TypeScript/TSX
- **Components**: 50+ reusable UI components with enhanced transaction queue
- **Vaults Supported**: 8+ across 4 protocols (Morpho, Curve, Savings, Falcon) *(First Feature)*
- **Architecture**: Protocol adapter pattern with Redux state management
- **Test Coverage**: Comprehensive TypeScript coverage

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines:

### **Development Setup**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`yarn type-check && yarn lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **Code Standards**
- **TypeScript strict mode** - No `any` types
- **ESLint + Prettier** - Consistent code formatting
- **Comprehensive type definitions** - Full type safety
- **Component testing** - Test critical functionality
- **Component reusability** - Always check existing components first

## 📄 License

This project is proprietary software of **Wrytes AG**. All rights reserved.

## 📞 Contact & Support

### **Wrytes AG**
- **🏢 Address**: Zug, Switzerland
- **🌐 Website**: [wrytes.io](https://wrytes.io)
- **📧 Contact**: [info@wrytes.io](mailto:info@wrytes.io)

### **Development Team**
- **🔧 Technical Issues**: Create an issue on GitHub
- **💡 Feature Requests**: Create an issue on GitHub
- **🐛 Bug Reports**: [info@wrytes.io](mailto:info@wrytes.io)

---

<div align="center">

**Built with 🇨🇭 Swiss precision by [Wrytes AG](https://wrytes.io)**

*Profit-driven innovation through proprietary Bitcoin strategies*

**Remember: This is an R&D Platform for Sustainable Innovation**

This platform serves **Wrytes AG's core mission**: using proprietary Bitcoin trading strategies to fund continuous blockchain research and development. Every technical decision should consider:

1. **How does this serve our R&D and trading operations?**
2. **Can this pattern be reused for future research tools?**
3. **Is this component generic enough for multiple business functions?**
4. **Does this maintain Swiss precision and quality standards?**
5. **How will this scale as our research and business operations grow?**

**Think research-first, business-sustainability-second, technical-excellence-always.**

</div>