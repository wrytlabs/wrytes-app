# Claude Code Task: Implement Component Organization & Cleanup Plan

## Context
I have a React/Next.js web3 application with dashboard and savings functionality that needs component refactoring. The current codebase has large page components (100-200+ lines) with mixed concerns, repeated UI patterns, and limited reusability.

## Your Mission
Implement the component organization plan by refactoring the existing codebase into a clean, maintainable component structure following the specifications below.

## Current State
- **Components**: 5 directories (auth, layout, savings, sections, ui)
- **Pages**: Dashboard pages with mixed UI/business logic/data fetching
- **Hooks**: 3 custom hooks (useAuth, useToast, useWallet)
- **Issues**: Large components, repeated patterns, mixed concerns, limited reusability

## Target Structure to Implement

### 1. Core UI Components (`components/ui/`)
Create these reusable UI components:

**Card System:**
- `Card/index.tsx` - Main Card component with variants
- `Card/StatsCard.tsx` - Specialized stats display with icon, value, label, change indicator
- `Card/ActivityCard.tsx` - Activity/feed items with timestamp, status, actions
- `Card/types.ts` - TypeScript interfaces

**Button System:**
- `Button/index.tsx` - Main Button with variants (primary, secondary, outline, ghost)
- `Button/IconButton.tsx` - Icon-only buttons with proper accessibility
- `Button/types.ts` - Button prop types

**Modal System:**
- `Modal/index.tsx` - Base modal with backdrop, close handlers, animations
- `Modal/ConfirmModal.tsx` - Confirmation dialogs with customizable actions
- `Modal/types.ts` - Modal interfaces

**Stats Components:**
- `Stats/StatCard.tsx` - Reusable stat display (icon, value, label, trend)
- `Stats/StatGrid.tsx` - Responsive grid layout for stats
- `Stats/types.ts` - Stats-related types

**Layout Components:**
- `Layout/PageHeader.tsx` - Page headers with title, description, actions
- `Layout/Section.tsx` - Content sections with consistent spacing
- `Layout/types.ts` - Layout prop types

### 2. Feature Components (`components/features/`)
Extract page-specific logic into focused components:

**Dashboard Features:**
- `Dashboard/DashboardStats.tsx` - Dashboard overview statistics
- `Dashboard/RecentActivity.tsx` - Activity feed with filtering
- `Dashboard/QuickActions.tsx` - Action buttons grid
- `Dashboard/types.ts` - Dashboard-specific types

**Savings Features:**
- `Savings/SavingsOverview.tsx` - Savings summary statistics
- `Savings/VaultGrid.tsx` - Vault display with search/filter
- `Savings/VaultActions.tsx` - Deposit/withdraw modal flows
- `Savings/types.ts` - Savings-related interfaces

### 3. Enhanced Hooks (`hooks/`)
Create generic, reusable business logic:

**Generic Hooks:**
- `api/useApiCall.ts` - Generic API call with loading/error states
- `api/useMutation.ts` - Generic mutation hook with optimistic updates
- `web3/useContractRead.ts` - Generic contract read operations
- `web3/useContractWrite.ts` - Generic contract write with gas estimation
- `web3/useBalance.ts` - Balance checking with auto-refresh
- `ui/useModal.ts` - Modal state management
- `business/useSavings.ts` - Savings-specific business logic

## Implementation Requirements

### Technical Requirements:
1. **TypeScript**: Full type safety with proper interfaces
2. **Performance**: Implement proper memoization and lazy loading
3. **Accessibility**: ARIA labels, keyboard navigation, focus management
4. **Responsive**: Mobile-first design with proper breakpoints
5. **Error Handling**: Proper error boundaries and fallback states
6. **Loading States**: Skeleton loaders and loading indicators
7. **Code Splitting**: Dynamic imports where appropriate

### Component Standards:
- Each component should be <100 lines
- Props should be well-typed with TypeScript
- Include JSDoc comments for complex components
- Use consistent naming conventions
- Implement proper error boundaries
- Support ref forwarding where needed

### Design System Integration:
- Use Tailwind CSS for styling
- Implement consistent spacing (4px grid system)
- Support theme variables for colors
- Include hover/focus states
- Add smooth animations where appropriate

## Priority Implementation Order:

### Phase 1 (High Priority): Core UI Components
1. Start with `StatCard` component - extract from dashboard stats
2. Create base `Modal` system with confirmation variant
3. Enhance `Card` system with variants and gradients
4. Build `PageHeader` and `Section` layout components

### Phase 2 (Medium Priority): Feature Components
1. Extract `DashboardStats` from dashboard page
2. Create `RecentActivity` component
3. Build `VaultGrid` for savings page
4. Implement `VaultActions` modal flows

### Phase 3 (Medium Priority): Generic Hooks
1. Create `useContractRead` and `useContractWrite` hooks
2. Build `useApiCall` with caching
3. Implement `useModal` state management
4. Extract `useSavings` business logic

### Phase 4 (Low Priority): Page Refactoring
1. Refactor dashboard page to use new components
2. Clean up savings page implementation
3. Update routing and lazy loading

## Success Criteria:
- [ ] Page components reduced to <100 lines each
- [ ] 80% component reusability across pages  
- [ ] Clear separation of UI, business logic, and data fetching
- [ ] Improved performance with proper code splitting
- [ ] Comprehensive TypeScript coverage
- [ ] Consistent design system implementation

## Special Considerations:
- Preserve existing functionality during refactoring
- Maintain Web3 integration (wallet connections, contract calls)
- Keep authentication flows intact
- Ensure responsive design is maintained
- Test thoroughly on different screen sizes

## Getting Started:
1. Analyze the current component structure
2. Identify the largest/most complex components first
3. Start with the most reusable UI components
4. Extract business logic into custom hooks
5. Refactor pages to use new component structure
6. Test and validate functionality

Please implement this component organization plan systematically, ensuring each component is production-ready with proper TypeScript types, error handling, and documentation.