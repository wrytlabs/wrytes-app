# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with the **Wrytes** DeFi dashboard platform as repository.

## 🎯 **Application / Repository Philosophy & Vision**

**Wrytes** is not just a vault management application - it's a **comprehensive DeFi management platform** designed with a **generic, extensible architecture**. The vault feature is merely the **first implementation** of a broader vision for professional DeFi portfolio management.

### **Core Design Principles:**

1. **🔄 Generic & Modular Architecture** - Every feature is designed to be extensible and reusable
2. **🧩 Component Reusability** - Maximize reuse of existing components before building new ones
3. **📱 Mobile-First Responsive** - Consistent patterns across all features
4. **🏢 Enterprise-Grade** - Built for professional/institutional users with proper error handling
5. **🔧 Feature-Based Structure** - Each major feature is self-contained and pluggable

### **Platform Vision:**
- **Vault Management** (Current) - Multi-protocol yield optimization
- **Transaction Queue Management** (Current) - Multi-tx batch optimization for e.g. DAOs like Aragon
- **Portfolio Analytics** (Future) - Cross-protocol performance tracking
- **Strategy Builder** (Future) - Custom DeFi strategy creation
- **Strategy Management** (Future) - Professional tools
- **Blockchain Tools** (Future) - Inovative and brand new features

## 🏗️ **Architecture Overview**

### **Technology Stack Philosophy:**
- **Next.js 15** with Pages Router - Optimal Web3 compatibility
- **React 19** with TypeScript - Type-safe, modern development
- **Wagmi 2.x + Viem + Reown AppKit** - Modern Web3 stack
- **Redux Toolkit + Persist** - Centralized state with persistence
- **Apollo Client** - GraphQL for protocol data
- **Tailwind CSS + Framer Motion** - Consistent, performant styling
- **React Hook Form + Zod** - Robust form handling

### **State Management Strategy:**
- **Redux** - Global application state (transactions, user preferences)
- **Apollo Cache** - GraphQL data caching and synchronization
- **React Context** - Authentication and theme management

## 📁 **Project Structure Philosophy**

```
/wrytes/
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
│   ├── ui/                 # Generic UI hooks
│   ├── web3/               # Web3 interaction hooks
│   ├── vaults/             # Vault-specific hooks
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
   - `useToast.ts` - Toast notification system

### **Component Composition Patterns:**
```typescript
// ✅ GOOD: Reuse existing components
<Card>
  <CardHeader>
    <h3>New Feature</h3>
  </CardHeader>
  <CardContent>
    <StatGrid>
      <StatCard title="Metric" value={value} />
    </StatGrid>
  </CardContent>
</Card>

// ❌ AVOID: Building from scratch
<div className="custom-card">
  <div className="custom-header">...</div>
</div>
```

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
- [ ] Create feature-specific hooks in `hooks/[feature]/`
- [ ] Add to navigation system
- [ ] Implement proper loading states
- [ ] Add error boundaries
- [ ] Include proper TypeScript types
- [ ] Add to Redux if global state needed

## 🔗 **Web3 Integration Philosophy**

### **Multi-Protocol Support:**
- **Current:** Morpho, Curve, Savings protocols
- **Future:** Any DeFi protocol with standardized interfaces

### **Wallet Integration:**
- **Reown AppKit** - Modern wallet connection
- **Multi-wallet support** - MetaMask, WalletConnect, Coinbase, Safe
- **Network switching** - Ethereum Mainnet, Base L2

### **Contract Interaction Patterns:**
```typescript
// ✅ Use existing patterns from vaults/
const { data, isLoading, error } = useContractRead({
  address: vaultAddress,
  abi: vaultABI,
  functionName: 'balanceOf',
  args: [userAddress]
});
```

## 📊 **Data Management Strategy**

### **GraphQL Integration:**
- **Apollo Client** - Centralized GraphQL management
- **Protocol-specific queries** - Morpho, future protocols
- **Caching strategy** - 5-minute cache for performance

### **Real-time Updates:**
- **WebSocket subscriptions** - For live data updates
- **Polling fallbacks** - When WebSocket unavailable
- **Optimistic updates** - For better UX

## 🎨 **Design System Philosophy**

### **Dark Theme Consistency:**
- **Professional aesthetic** - Institutional DeFi platform
- **Accessibility first** - WCAG 2.1 AA compliance
- **Responsive design** - Mobile-first approach

### **Component Variants:**
```typescript
// Button variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Subtle Action</Button>

// Card variants
<Card variant="default">Standard Card</Card>
<Card variant="elevated">Prominent Card</Card>
```

## 🔧 **Development Workflow**

### **Code Quality Standards:**
- **TypeScript Strict Mode** - No `any` types
- **Component Composition** - Prefer composition over inheritance
- **Custom Hooks** - Extract business logic
- **Error Boundaries** - Graceful error handling
- **Accessibility** - ARIA labels and semantic HTML

### **Performance Standards:**
- **Core Web Vitals** - LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size** - Monitor with analyzer
- **Code Splitting** - Automatic by route
- **Image Optimization** - Next.js Image component

### **Security Best Practices:**
- **No Private Key Storage** - Never store private keys
- **Signature Verification** - All auth via message signing
- **Input Sanitization** - Zod schemas for validation
- **XSS Protection** - Proper escaping

## 🚀 **Future Feature Architecture**

### **Planned Features:**
1. **Portfolio Analytics** - Cross-protocol performance tracking
2. **Strategy Builder** - Custom DeFi strategy creation
3. **Risk Management** - Professional risk assessment
4. **Institutional Tools** - Compliance and reporting

### **Extensibility Patterns:**
```typescript
// Protocol integration pattern
interface ProtocolConfig {
  name: string;
  type: 'lending' | 'dex' | 'yield';
  endpoints: {
    graphql?: string;
    rpc?: string;
  };
  vaults: VaultConfig[];
}

// Feature module pattern
interface FeatureModule {
  name: string;
  route: string;
  component: React.ComponentType;
  permissions: string[];
  navigation: NavigationItem;
}
```

## 📈 **Business Context**

### **Wrytes AG Profile:**
- **Swiss AG** - Based in Zug (Crypto Valley)
- **Focus Areas** - Bitcoin/Blockchain, AI/ML, Software Development
- **Target Market** - Professional DeFi users, institutions

### **Platform Goals:**
1. **DeFi Portfolio Management** - Multi-protocol aggregation
2. **Yield Optimization** - Automated strategy execution
3. **Risk Assessment** - Professional risk evaluation
4. **Swiss Compliance** - Regulatory-compliant services

## 🛠️ **Development Commands**

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server

# Code Quality
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint errors
yarn type-check   # TypeScript checking
yarn format       # Format with Prettier

# Analysis
yarn analyze      # Bundle analysis
```

## 🎯 **Key Development Principles**

### **1. Component Reusability First**
- Always check `components/ui/` before building new components
- Adapt existing patterns from `features/` directories
- Use composition over custom implementation

### **2. Generic Architecture**
- Design features to be protocol-agnostic
- Use standardized interfaces for data structures
- Implement feature modules that can be easily extended

### **3. Type Safety**
- Comprehensive TypeScript coverage
- No `any` types allowed
- Proper interface definitions for all data structures

### **4. Performance Focus**
- Optimize for Core Web Vitals
- Implement proper loading states
- Use code splitting and lazy loading

### **5. Error Handling**
- Graceful degradation when APIs fail
- Comprehensive error boundaries
- User-friendly error messages

## 🔍 **Troubleshooting Guide**

### **Common Issues:**
- **Build Errors** → Run `yarn type-check` first
- **Wallet Issues** → Check `REOWN_PROJECT_ID` configuration
- **GraphQL Errors** → Verify API endpoints and keys
- **Performance Issues** → Use `yarn analyze` for bundle analysis

### **Architecture Decisions:**
- **Page Router** over App Router - Better Web3 compatibility
- **Apollo** over React Query - Better GraphQL integration
- **Wagmi** over Web3.js - Modern React-first approach
- **Tailwind** over Styled Components - Better performance

---

## 🎯 **Remember: This is a Platform, Not Just a Vault App**

The vault feature is the **first implementation** of a broader DeFi management platform. Every decision should consider:

1. **How will this scale to other protocols?**
2. **Can this pattern be reused for future features?**
3. **Is this component generic enough for other use cases?**
4. **Does this follow the established architecture patterns?**

**Think platform-first, feature-second.**