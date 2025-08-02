# Component Organization & Cleanup - Execution Plan

## Executive Summary

This document provides a comprehensive execution plan to transform the Wrytes React/Next.js codebase from large, mixed-concern components into a clean, maintainable component architecture. The plan systematically addresses current issues while building on existing strengths.

## Current State Analysis

### Issues Identified Through Code Analysis

**Large Page Components:**
- `pages/dashboard/index.tsx` (114 lines): Contains hardcoded stats grid, activity items, mixed UI/logic
- `pages/dashboard/savings.tsx` (210 lines): Complex component with stats, modal management, effects
- `components/savings/SavingsVaultCard.tsx` (174 lines): Multiple responsibilities in single component

**Code Duplication:**
- Stat card pattern repeated 8 times (4 in dashboard + 4 in savings)
- Activity item structure duplicated 3 times in dashboard
- Modal state management replicated across components
- Loading state handling inconsistent

**Mixed Concerns:**
- Pages contain UI rendering + business logic + data fetching + state management
- No clear separation between presentation and business logic
- Components tightly coupled to specific use cases

**Limited Reusability:**
- Only basic Card/Button components are reusable
- Most components are too specific to current contexts
- No standardized patterns for common UI elements

## Implementation Strategy

### Phase 1: Core UI Components (Week 1)
*Goal: Create foundational reusable components*

#### 1.1 StatCard Component System

**Problem:** Stat cards duplicated 8 times across dashboard and savings pages

**Files to Create:**
```
components/ui/Stats/
├── index.ts              # Barrel exports
├── StatCard.tsx          # Main stat component  
├── StatGrid.tsx          # Responsive grid layout
└── types.ts              # TypeScript interfaces
```

**StatCard.tsx Implementation:**
```typescript
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  color?: 'orange' | 'green' | 'blue' | 'purple';
  loading?: boolean;
  className?: string;
}
```

**Features:**
- Icon support with color variants
- Loading skeleton states  
- Trend indicators with up/down arrows
- Responsive design with proper spacing
- Hover effects and animations
- Accessibility (ARIA labels, keyboard navigation)

**Extraction Target:** Replace 8 hardcoded stat cards in dashboard and savings pages

#### 1.2 Enhanced Modal System

**Problem:** Modal state management duplicated, no standardized modal components

**Files to Create:**
```
components/ui/Modal/
├── index.ts              # Barrel exports
├── Modal.tsx             # Base modal component
├── ConfirmModal.tsx      # Confirmation dialog
└── types.ts              # Modal interfaces
```

**Modal.tsx Implementation:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}
```

**Features:**
- Backdrop blur and click-to-close
- Smooth enter/exit animations (Framer Motion)
- Keyboard navigation (ESC to close, focus trapping)
- Size variants and responsive behavior
- Portal rendering for proper z-index stacking
- ARIA compliance for screen readers

**Extraction Target:** Replace inline modal logic in savings page

#### 1.3 Layout Components  

**Problem:** Inconsistent page headers and content section styling

**Files to Create:**
```
components/ui/Layout/
├── index.ts              # Barrel exports
├── PageHeader.tsx        # Consistent page headers
├── Section.tsx           # Content sections
└── types.ts              # Layout interfaces
```

**PageHeader.tsx Implementation:**
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info';
  };
  actions?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}
```

**Features:**
- Consistent typography and spacing
- Optional badge indicators (like "LIVE" in savings)
- Action button placement
- Breadcrumb navigation support
- Responsive layout for mobile devices

**Extraction Target:** Replace header sections in dashboard and savings pages

### Phase 2: Feature Components (Week 2)
*Goal: Extract page-specific logic into focused components*

#### 2.1 Dashboard Feature Components

**Files to Create:**
```
components/features/Dashboard/
├── index.ts              # Barrel exports
├── DashboardStats.tsx    # Stats grid extraction
├── RecentActivity.tsx    # Activity feed component
├── QuickActions.tsx      # Action buttons grid
└── types.ts              # Dashboard-specific types
```

**DashboardStats.tsx:**
- Extract stats grid logic from dashboard page
- Use new StatCard components  
- Handle loading states and error handling
- Support dynamic data fetching

**RecentActivity.tsx:**
- Extract hardcoded activity items
- Support filtering and pagination
- Real-time updates capability
- Empty state handling

**Extraction Target:** Reduce dashboard page from 114 to <50 lines

#### 2.2 Savings Feature Components

**Files to Create:**
```
components/features/Savings/
├── index.ts                  # Barrel exports
├── SavingsOverview.tsx       # Stats overview extraction
├── VaultGrid.tsx             # Vault display grid
├── VaultCard.tsx             # Refactored vault card
├── VaultActions.tsx          # Deposit/withdraw flows
└── types.ts                  # Savings-specific types
```

**SavingsOverview.tsx:**
- Extract stats overview from savings page
- Use new StatCard components
- Dynamic APY and TVL calculation
- Loading state management

**VaultCard.tsx (Refactored):**
- Reduce current 174 lines to <100 lines
- Extract action logic to VaultActions
- Simplify prop interface
- Improve performance with React.memo

**Extraction Target:** Reduce savings page from 210 to <80 lines

#### 2.3 Component Refactoring Strategy

**SavingsVaultCard Breakdown:**
Current responsibilities:
- Vault display (UI)
- Balance fetching (Web3)
- Stats loading (API)
- Action handling (Business logic)

New structure:
- `VaultCard.tsx`: Pure UI component for display
- `useVaultData.ts`: Hook for balance/stats fetching  
- `VaultActions.tsx`: Separate component for deposit/withdraw
- Props interface simplification

### Phase 3: Business Logic Hooks (Week 3)
*Goal: Separate business logic from UI components*

#### 3.1 Generic Web3 Hooks

**Files to Create:**
```
hooks/web3/
├── index.ts                 # Barrel exports
├── useContractRead.ts       # Generic contract reading
├── useContractWrite.ts      # Generic contract writing
├── useBalance.ts            # Balance checking with auto-refresh
└── types.ts                 # Web3 hook types
```

**useContractRead.ts Implementation:**
```typescript
interface UseContractReadProps {
  address: string;
  abi: any[];
  functionName: string;
  args?: any[];
  chainId?: number;
  enabled?: boolean;
  refetchInterval?: number;
}
```

**Features:**
- Automatic error handling and retry logic
- Caching with SWR or React Query integration
- Loading states and optimistic updates
- Network switching support
- Gas estimation for write operations

#### 3.2 UI Management Hooks

**Files to Create:**
```
hooks/ui/
├── index.ts                 # Barrel exports  
├── useModal.ts              # Modal state management
├── useLoadingState.ts       # Consistent loading patterns
└── useToastActions.ts       # Enhanced toast integration
```

**useModal.ts Implementation:**
```typescript
interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  openWith: (data: any) => void;
  data: any;
}
```

#### 3.3 Business Logic Hooks

**Files to Create:**
```
hooks/business/
├── index.ts                 # Barrel exports
├── useSavings.ts            # Savings-specific logic
├── useDashboard.ts          # Dashboard business logic  
└── useVaultData.ts          # Vault data management
```

**useSavings.ts Implementation:**
- Vault data aggregation
- APY/TVL calculations
- User balance tracking
- Transaction history

### Phase 4: Page Refactoring (Week 4)
*Goal: Clean up page components using new structure*

#### 4.1 Dashboard Page Refactoring

**Before (114 lines):**
```typescript
// Mixed concerns: UI + logic + data
export default function Dashboard() {
  // 20+ lines of UI rendering
  // Hardcoded stat cards (40+ lines)
  // Hardcoded activity items (30+ lines)
}
```

**After (<50 lines):**
```typescript
export default function Dashboard() {
  return (
    <>
      <Head>...</Head>
      <div className="space-y-6">
        <PageHeader 
          title="Dashboard Overview" 
          description="Welcome back! Here's what's happening." 
        />
        <DashboardStats />
        <RecentActivity />
      </div>
    </>
  );
}
```

#### 4.2 Savings Page Refactoring

**Before (210 lines):**
```typescript
// Complex component with multiple responsibilities
export default function SavingsPage() {
  // State management (20 lines)
  // Effects and data loading (30 lines)  
  // Stats overview rendering (50 lines)
  // Vault grid rendering (40 lines)
  // Modal management (30 lines)
  // Risk disclaimer (20 lines)
}
```

**After (<80 lines):**
```typescript
export default function SavingsPage() {
  const { selectedVault, modals } = useSavings();
  
  return (
    <>
      <Head>...</Head>
      <div className="space-y-6">
        <PageHeader 
          title="Savings Vaults" 
          badge={{ text: "LIVE", variant: "success" }}
          description="Earn yield on your assets with automated DeFi strategies"
        />
        <SavingsOverview />
        <InfoSection />
        <VaultGrid />
        <RiskDisclaimer />
      </div>
      <VaultActions vault={selectedVault} {...modals} />
    </>
  );
}
```

## Implementation Guidelines

### Code Standards
- **Component Size**: <100 lines per component
- **Single Responsibility**: Each component has one clear purpose
- **TypeScript**: Full type safety with proper interfaces
- **Testing**: Unit tests for all new components
- **Documentation**: JSDoc comments for complex logic

### Performance Requirements
- **Memoization**: React.memo for expensive renders
- **Code Splitting**: Dynamic imports for feature components
- **Bundle Size**: Monitor with webpack-bundle-analyzer
- **Loading States**: Skeleton loaders and proper loading indicators

### Design System Integration
- **Tailwind CSS**: Consistent utility classes
- **Theme Variables**: Use defined color tokens
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

## Testing Strategy

### Unit Testing
- **Component Tests**: React Testing Library for UI components
- **Hook Tests**: @testing-library/react-hooks for custom hooks
- **Integration Tests**: Test component interactions

### Test Files Structure:
```
components/ui/Stats/__tests__/
├── StatCard.test.tsx
├── StatGrid.test.tsx
└── integration.test.tsx
```

## Migration Strategy

### Gradual Implementation
1. **Create New Components**: Build alongside existing code
2. **Feature Flags**: Use conditional rendering during migration  
3. **Parallel Testing**: Test new components with existing data
4. **Incremental Replacement**: Replace one page section at a time

### Risk Mitigation
- **Preserve Functionality**: All existing features must work
- **Performance Monitoring**: Track bundle size and loading times
- **User Testing**: Validate UI/UX improvements
- **Rollback Plan**: Ability to revert changes if issues arise

## Success Metrics

### Quantitative Goals
- ✅ Dashboard page: <50 lines (from 114)
- ✅ Savings page: <80 lines (from 210)  
- ✅ SavingsVaultCard: <100 lines (from 174)
- ✅ Component reusability: 80% across pages
- ✅ Bundle size: No increase in final bundle
- ✅ Performance: Maintain current loading times

### Qualitative Goals
- ✅ Developer experience: Easier to add new features
- ✅ Code maintainability: Clear separation of concerns
- ✅ Design consistency: Uniform UI across application
- ✅ Error handling: Better error states and user feedback

## Timeline and Dependencies

### Week 1: Foundation (Core UI Components)
- Day 1-2: StatCard system implementation
- Day 3-4: Modal system with animations
- Day 5: Layout components (PageHeader, Section)

### Week 2: Feature Extraction  
- Day 1-2: Dashboard feature components
- Day 3-4: Savings feature components
- Day 5: SavingsVaultCard refactoring

### Week 3: Business Logic
- Day 1-2: Web3 hooks (useContractRead/Write)
- Day 3-4: UI hooks (useModal, useLoadingState)
- Day 5: Business logic hooks (useSavings)

### Week 4: Integration & Testing
- Day 1-2: Dashboard page refactoring
- Day 3-4: Savings page refactoring  
- Day 5: Testing, validation, and documentation

## File Structure (Post-Implementation)

```
components/
├── ui/                         # Reusable UI components
│   ├── Stats/
│   │   ├── StatCard.tsx        # ✅ Replaces 8 hardcoded cards
│   │   ├── StatGrid.tsx        # ✅ Responsive grid layout
│   │   └── types.ts
│   ├── Modal/
│   │   ├── Modal.tsx           # ✅ Base modal with animations
│   │   ├── ConfirmModal.tsx    # ✅ Confirmation dialogs
│   │   └── types.ts
│   ├── Layout/
│   │   ├── PageHeader.tsx      # ✅ Consistent page headers
│   │   ├── Section.tsx         # ✅ Content sections
│   │   └── types.ts
│   └── [existing]              # Keep Button, Card, etc.
├── features/                   # Feature-specific components
│   ├── Dashboard/
│   │   ├── DashboardStats.tsx  # ✅ Extract from dashboard page
│   │   ├── RecentActivity.tsx  # ✅ Extract from dashboard page
│   │   └── types.ts
│   ├── Savings/
│   │   ├── SavingsOverview.tsx # ✅ Extract from savings page
│   │   ├── VaultGrid.tsx       # ✅ Vault display grid
│   │   ├── VaultCard.tsx       # ✅ Refactored (<100 lines)
│   │   └── types.ts
│   └── Admin/                  # Future admin components
└── [existing]                  # Keep auth, layout, sections

hooks/
├── ui/                         # UI-related hooks
│   ├── useModal.ts             # ✅ Modal state management
│   ├── useLoadingState.ts      # ✅ Loading patterns
│   └── index.ts
├── web3/                       # Web3 interaction hooks
│   ├── useContractRead.ts      # ✅ Generic contract reading
│   ├── useContractWrite.ts     # ✅ Generic contract writing
│   ├── useBalance.ts           # ✅ Balance with auto-refresh
│   └── index.ts
├── api/                        # API interaction hooks
│   ├── useApiCall.ts           # ✅ Generic API calls
│   └── index.ts
├── business/                   # Business logic hooks
│   ├── useSavings.ts           # ✅ Savings business logic
│   ├── useDashboard.ts         # ✅ Dashboard business logic
│   └── index.ts
└── [existing]                  # Keep useAuth, useToast, useWallet
```

## Next Steps

1. **Environment Setup**: Ensure all dependencies are installed
2. **Branch Creation**: Create feature branch for component refactoring
3. **Implementation**: Start with Phase 1 - Core UI Components
4. **Testing**: Write tests alongside component development
5. **Documentation**: Update component documentation as components are built
6. **Code Review**: Regular reviews to ensure quality and consistency

This execution plan provides a systematic approach to transforming the codebase while maintaining all existing functionality and improving developer experience, maintainability, and performance.