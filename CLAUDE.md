# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Wrytes** repository - a production-ready Next.js application for Wrytes AG, a Swiss company based in Zug, Switzerland, specializing in software development, R&D, Bitcoin/Blockchain technology, and AI solutions. The application serves as both a corporate landing page and a sophisticated DeFi management platform, for now vault managment is Integrated. 

## Current State

The repository is **fully implemented and production-ready** with comprehensive features:

### **Core Features Implemented:**
- ✅ **Corporate Landing Page** - Swiss-branded company presentation
- ✅ **Web3 Authentication System** - Wallet-based auth with role management
- ✅ **DeFi Vault Management** - Multi-protocol vault integration with real-time data
- ✅ **Admin Dashboard** - User management, role permissions, system health
- ✅ **Apollo GraphQL Integration** - Morpho protocol data fetching
- ✅ **Role-Based Access Control** - Admin, moderator, user permissions
- ✅ **Dark Theme UI System** - Comprehensive component library
- ✅ **Multi-Wallet Support** - MetaMask, WalletConnect, Coinbase, Safe

### **Key Integrations:**
- **Morpho Protocol** - Real-time vault metrics via GraphQL
- **Curve Finance** - Liquidity pool integrations
- **Ethereum Mainnet** - Primary blockchain network
- **Base Network** - Secondary L2 support
- **Alchemy RPC** - Reliable blockchain infrastructure

## Technology Stack

### **Core Framework & Language:**
- **Next.js 15.4.5** with Page Router (not App Router)
- **React 19.1.0** with TypeScript strict mode
- **TypeScript 5.8.2** - Comprehensive type safety

### **Styling & UI:**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Advanced animations and transitions
- **Headless UI 2.3.1** - Accessible UI components
- **FontAwesome 6.8.0** - Icon system (solid, brands, regular)
- **Inter Font** - Primary typography (Google Fonts)
- **Avenir** - Branding typography

### **Web3 & Blockchain:**
- **Wagmi 2.16.1** - React hooks for Ethereum
- **Apollo Client 3.13.9** - GraphQL data management
- **Viem 2.33.2** - TypeScript Ethereum library
- **WAGMI_CONFIG** - Centralized Wagmi configuration
- **Reown AppKit** - Wallet connection
- **Reown AppKit Networks** - Network definitions from @reown/appkit/networks
- **readContract()** - Wagmi action for contract interactions

### **Forms & Validation:**
- **React Hook Form 7.56.0** - Performant form library
- **Zod 3.24.1** - Schema validation
- **React Hot Toast 2.4.4** - Toast notifications

### **Development & Build:**
- **Turbopack** - Fast bundler for development
- **ESLint 9.18.0** - Code linting
- **Prettier 4.1.0** - Code formatting
- **@next/bundle-analyzer** - Bundle size analysis

## Project Structure

```
/wrytes/
├── pages/                    # Next.js Page Router
│   ├── _app.tsx             # App wrapper with providers
│   ├── _document.tsx        # Custom document
│   ├── index.tsx            # Landing page
│   ├── dashboard/           # Dashboard pages
│   │   ├── index.tsx        # Main dashboard
│   │   └── vaults.tsx       # Vault management
│   └── admin/               # Admin pages
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── features/           # Feature-specific components
│   │   ├── Dashboard/      # Dashboard components
│   │   ├── Vaults/         # Vault management UI
│   │   └── Admin/          # Admin panel components
│   ├── layout/             # Layout components (Header, Footer)
│   ├── sections/           # Landing page sections
│   └── ui/                 # Reusable UI components
├── lib/                    # Business logic & integrations
│   ├── auth/              # Authentication services
│   ├── vaults/            # Vault configurations & logic
│   │   ├── morpho/        # Morpho vault configs
│   │   ├── curve/         # Curve pool configs
│   │   └── savings/       # Savings vault configs
│   ├── graphql/           # Apollo Client & GraphQL queries
│   ├── web3/              # Web3 configuration
│   └── utils/             # Utility functions
├── hooks/                  # Custom React hooks
│   ├── auth/              # Authentication hooks
│   ├── vaults/            # Vault data hooks
│   └── morpho/            # Morpho-specific hooks
├── contexts/              # React Context providers
├── types/                 # TypeScript type definitions
├── styles/               # Global CSS & Tailwind config
└── public/               # Static assets
```

## Development Commands

**IMPORTANT: Always use Yarn instead of npm for this project.**

### **Development Workflow:**
```bash
yarn dev          # Start development server (Turbopack)
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint errors automatically
yarn type-check   # TypeScript type checking
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
yarn analyze      # Analyze bundle size
```

### **GraphQL Development:**
```bash
yarn codegen      # Generate GraphQL types from schema
yarn graphql      # GraphQL development tools
```

## Architecture Patterns

### **Component Architecture:**
- **Feature-based organization** - Components grouped by platform domain
- **Composition over inheritance** - Reusable component composition
- **TypeScript interfaces** - Comprehensive type definitions
- **Custom hooks** - platform logic extraction
- **Error boundaries** - Graceful error handling

### **State Management:**
- **React Context** - Authentication and global state
- **Apollo Client Cache** - GraphQL data caching
- **Local State** - UI interactions and forms
- **Custom Hooks** - Data fetching and platform logic

### **Data Fetching Patterns:**
- **GraphQL** - Morpho protocol data (Apollo Client)
- **Contract Calls** - Direct blockchain interactions (Wagmi/Viem)
- **REST APIs** - Authentication and user management
- **Fallback Mechanisms** - Graceful degradation when APIs fail

## Web3 Integration

### **Supported Wallets:**
- MetaMask (Injected)
- WalletConnect v2
- Coinbase Wallet
- Safe (Gnosis Safe)

### **Blockchain Networks:**
- **Ethereum Mainnet** (Chain ID: 1) - Primary network
- **Base** (Chain ID: 8453) - Layer 2 support

### **RPC Configuration:**
- **Alchemy** - Primary RPC provider with API keys
- **Fallback RPCs** - Public endpoints for redundancy

### **Contract Interactions:**
- **Vault Deposits/Withdrawals** - ERC-4626 compatible
- **Balance Reading** - Multi-vault balance tracking
- **Transaction Handling** - Comprehensive error management
- **Gas Optimization** - Smart gas estimation

## Vault System Architecture

### **Supported Protocols:**

**Morpho Vaults:**
- `Alpha USDC Core` - 0xb0f05E4De970A1aaf77f8C2F823953a367504BA9
- `USDU Core` - 0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a
- `Alpha ZCHF Vault` - (Additional Morpho integration)

**Curve Pools:**
- `DAI/USDC/USDT` - Stable coin liquidity pool
- `USDU/USDC` - USDU stablecoin pair

**Savings Vaults:**
- `ZCHF Savings` - 0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC

### **Data Sources:**
- **Morpho GraphQL API** - Real-time vault metrics, APY, TVL
- **Contract Calls** - Direct blockchain data as fallback
- **Apollo Cache** - 5-minute cache for performance

### **Vault Configuration Pattern:**
```typescript
interface Vault {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  description: string;
  apy: () => Promise<number>;
  tvl: () => Promise<number>;
  untilUnlocked?: number | (() => Promise<number>);
  riskLevel: 'low' | 'medium' | 'high';
  chainId: number;
  strategy: string;
}
```

## Authentication System

### **Web3 Authentication Flow:**
1. **Wallet Connection** - User connects via supported wallet
2. **Challenge Generation** - Backend generates unique challenge
3. **Message Signing** - User signs challenge with private key
4. **JWT Token** - Backend validates signature and issues JWT
5. **Role Assignment** - Token includes user roles and permissions

### **Role-Based Access Control:**
- **Admin** - Full system access, user management
- **Moderator** - Limited admin functions
- **User** - Standard app access

### **Protected Routes:**
- `/admin/*` - Admin only
- `/dashboard`
- `/dashboard/vaults`

## Design System

### **Dark Theme Color Palette:**
```css
/* Primary Colors */
--color-dark-bg: #1a1a1a          /* Main background */
--color-dark-card: #2a2a2a        /* Card backgrounds */
--color-dark-surface: #1f1f1f     /* Interactive surfaces */
--color-dark-border: #333333      /* Borders and dividers */

/* Accent Colors */
--color-accent-orange: #ff6b35     /* Primary accent */
--color-accent-gold: #ffd700       /* Secondary accent */

/* Text Colors */
--color-text-primary: #ffffff      /* Primary text */
--color-text-secondary: #b3b3b3    /* Secondary text */
--color-text-muted: #666666        /* Muted text */
```

### **Typography Scale:**
- **Headings** - Inter font, weights 600-800
- **Body Text** - Inter font, weights 400-500
- **Branding** - Avenir font for company elements

### **Component Standards:**
- **Cards** - Rounded corners (xl/2xl), subtle gradients
- **Buttons** - Multiple variants (primary, secondary, ghost)
- **Forms** - Comprehensive validation with error states
- **Modals** - Backdrop blur, slide animations
- **Loading States** - Skeleton components and spinners

## Environment Configuration

### **Required Environment Variables:**
```bash
# API Configuration
NEXT_PUBLIC_APP_URL=https://wrytes.io
NEXT_PUBLIC_API_URL=https://api.wrytes.io
NEXT_PUBLIC_INDEXER_URL=https://indexer.wrytes.io

# Development URLs (for local development)
# NEXT_PUBLIC_API_URL=http://localhost:3030
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Web3 Configuration
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_RPC_URL=alchemy_rpc_key

# GraphQL APIs (Optional)
NEXT_PUBLIC_MORPHO_GRAPHQL_ENDPOINT=https://api.morpho.org/graphql
NEXT_PUBLIC_MORPHO_API_KEY=your_morpho_api_key_if_required
```

## Implementation Guidelines

### **Code Style:**
- **TypeScript Strict Mode** - No `any` types allowed
- **Component Composition** - Prefer composition over inheritance
- **Custom Hooks** - Extract business logic into reusable hooks
- **Error Boundaries** - Implement error boundaries for features
- **Accessibility** - Include proper ARIA labels and semantic HTML

### **Performance Standards:**
- **Core Web Vitals** - LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size** - Monitor with bundle analyzer
- **Image Optimization** - Next.js Image component with WebP/AVIF
- **Code Splitting** - Automatic by route, manual for large components
- **Font Loading** - Preload critical fonts, swap for non-critical

### **Security Best Practices:**
- **No Private Key Storage** - Never store private keys in app
- **Signature Verification** - All auth via message signing
- **JWT Validation** - Proper token validation on backend
- **Input Sanitization** - Zod schemas for all user inputs
- **XSS Protection** - Proper escaping and sanitization

## Business Context

### **Wrytes AG Company Profile:**
- **Founded** - Swiss AG company
- **Location** - Zug, Switzerland (Crypto Valley)
- **Industry Focus** - Bitcoin/Blockchain, AI/ML, Software Development
- **Target Market** - Professional DeFi users, institutions, crypto traders

### **Core Business Functions:**
1. **DeFi Portfolio Management** - Multi-protocol vault aggregation
2. **Yield Optimization** - Automated strategy execution
3. **Risk Assessment** - Professional risk evaluation tools
4. **Swiss Compliance** - Regulatory-compliant financial services

### **Revenue Streams:**
- Management fees on vault strategies
- Option trading on Bitcoin positions
- Custom blockchain development
- AI/ML consulting services

## Quality Assurance

### **Testing Strategy:**
- **Type Safety** - Comprehensive TypeScript coverage
- **Component Testing** - React component unit tests
- **Integration Testing** - Web3 integration testing
- **E2E Testing** - Critical user journey testing

### **Code Quality Tools:**
- **ESLint** - Comprehensive linting rules
- **Prettier** - Consistent code formatting
- **TypeScript** - Strict type checking
- **Husky** - Pre-commit hooks

### **Deployment Standards:**
- **Production Build** - Optimized builds with Next.js
- **Environment Validation** - Required env var checking
- **Health Checks** - API and GraphQL endpoint monitoring
- **Error Tracking** - Comprehensive error logging

## Monitoring & Analytics

### **Performance Monitoring:**
- **Core Web Vitals** - Real user metrics
- **Bundle Analysis** - Regular size monitoring
- **API Response Times** - GraphQL and REST monitoring

### **Business Metrics:**
- **User Engagement** - Dashboard usage analytics
- **Vault Performance** - APY and TVL tracking
- **Transaction Success** - Web3 interaction monitoring

---

## Development Notes

### **Common Patterns:**
- Use `useVaultData` hook for vault information
- Implement loading states for all async operations
- Follow the established component structure in `components/features/`
- Use Apollo Client for GraphQL data fetching
- Implement proper error boundaries

### **Troubleshooting:**
- **Build Errors** - Run `yarn type-check` first
- **Wallet Issues** - Check `REOWN_PROJECT_ID` configuration
- **GraphQL Errors** - Verify Morpho API endpoint and keys
- **Slow Performance** - Use `yarn analyze` to check bundle size

### **Architecture Decisions:**
- **Page Router over App Router** - Better compatibility with Web3 libraries
- **Apollo over React Query** - Better GraphQL integration with Morpho
- **Wagmi over Web3.js** - Modern React-first Web3 library
- **Tailwind over Styled Components** - Better performance and maintainability