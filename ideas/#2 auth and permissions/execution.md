# Web3 Authentication & Permissions - Execution Guide

## Quick Start Instructions

This execution guide provides step-by-step instructions for implementing the Web3 authentication and permissions system as outlined in `plan.md`.

### Prerequisites
- Review `idea.md` and `plan.md` in this folder
- Ensure you have access to the existing NestJS backend API
- Verify the current Wrytes frontend codebase is set up and running
- Confirm you're on the `feature/auth-permissions-implementation` branch

### Implementation Workflow
1. **Follow the phase-based approach** defined in plan.md
2. **Use the todo list** created for tracking progress
3. **Test each phase** before moving to the next
4. **Update todos** as you complete tasks

---

## Phase 1: Core Authentication Infrastructure

### Step 1.1: Install and Configure Reown AppKit

```bash
# Install Reown AppKit and dependencies
yarn add @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query

# Install additional Web3 utilities if needed
yarn add ethers @types/ethers
```

**Configuration Setup:**
1. Create `lib/web3/config.ts` for AppKit configuration
2. Set up wallet provider configuration
3. Configure supported networks (Ethereum mainnet, testnets as needed)
4. Add project ID from Reown Cloud dashboard

**Files to Create:**
- `lib/web3/config.ts` - AppKit configuration
- `lib/web3/constants.ts` - Web3 constants and addresses

### Step 1.2: Create Authentication Service Layer

**Create AuthService (`lib/auth/AuthService.ts`):**
```typescript
class AuthService {
  // Message generation: POST /auth/message
  async generateMessage(address: string): Promise<string>
  
  // Signature verification: POST /auth/signin  
  async signIn(message: string, signature: string): Promise<AuthResponse>
  
  // Token management
  getStoredToken(): string | null
  setToken(token: string): void
  clearToken(): void
  
  // User profile: GET /auth/me
  async getCurrentUser(): Promise<UserProfile>
}
```

**Files to Create:**
- `lib/auth/AuthService.ts` - Main authentication service
- `lib/auth/types.ts` - TypeScript interfaces for auth
- `lib/auth/storage.ts` - Token storage utilities

### Step 1.3: Wallet Integration

**Create Wallet Components:**
1. `components/auth/WalletConnector.tsx` - Main wallet connection component
2. `components/auth/SignMessage.tsx` - Message signing interface
3. `hooks/useWallet.ts` - Wallet connection hook

**Integration Points:**
- Update existing CTA button to trigger wallet connection
- Add wallet connection state to dashboard components

---

## Phase 2: Authentication Flow Implementation

### Step 2.1: Authentication Context

**Create Authentication Provider (`contexts/AuthContext.tsx`):**
```typescript
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (address: string) => Promise<void>
  signOut: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}
```

**Files to Create:**
- `contexts/AuthContext.tsx` - React context for auth state
- `hooks/useAuth.ts` - Authentication hook
- `hooks/usePermissions.ts` - Permission checking hook

### Step 2.2: Authentication Flow Components

**Component Structure:**
```
components/auth/
├── AuthModal.tsx          # Main authentication modal
├── WalletConnection.tsx   # Wallet connection step
├── MessageSigning.tsx     # Message signing step  
├── AuthSuccess.tsx        # Success confirmation
├── AuthError.tsx          # Error handling
└── AuthStepper.tsx        # Progress indicator
```

**Key Features:**
- Step-by-step authentication flow
- Loading states and progress indicators
- Error handling with retry mechanisms
- Success confirmation with role display

### Step 2.3: Protected Routes & Guards

**Route Protection System:**
1. `components/auth/ProtectedRoute.tsx` - Route wrapper component
2. `components/auth/RequireRole.tsx` - Role-based access component
3. `hooks/useRouteProtection.ts` - Route protection logic

**Implementation Pattern:**
```typescript
// Protect entire pages
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>

// Protect specific components
<RequireRole role="admin">
  <UserManagementPanel />
</RequireRole>
```

---

## Phase 3: Role-Based Permission System

### Step 3.1: Permission Management Utilities

**Create Permission System (`lib/permissions/`):**
```typescript
// lib/permissions/types.ts
interface Permission {
  id: string
  name: string
  description: string
}

interface Role {
  id: string
  name: string
  permissions: Permission[]
}

// lib/permissions/utils.ts
export const checkPermission = (user: User, permission: string): boolean
export const checkRole = (user: User, role: string): boolean
export const getAvailableActions = (user: User): string[]
```

**Files to Create:**
- `lib/permissions/types.ts` - Permission type definitions
- `lib/permissions/utils.ts` - Permission checking utilities
- `lib/permissions/constants.ts` - Available permissions and roles

### Step 3.2: Role-Based UI Components

**Create Conditional Rendering Components:**
```typescript
// components/auth/ConditionalRender.tsx
<ConditionalRender
  condition="permission"
  value="user.manage"
  fallback={<AccessDenied />}
>
  <UserManagementButton />
</ConditionalRender>

// components/auth/RoleBasedNavigation.tsx
<RoleBasedNavigation 
  userRole={user.role}
  navigationConfig={navigationConfig}
/>
```

**Files to Create:**
- `components/auth/ConditionalRender.tsx` - Conditional UI rendering
- `components/auth/RoleBasedNavigation.tsx` - Dynamic navigation
- `components/auth/PermissionGate.tsx` - Permission-based gates

### Step 3.3: Dashboard Layout Integration

**Update Existing Components:**
1. Modify dashboard header to show user info and role
2. Update CTA button behavior based on authentication state
3. Add role-specific dashboard sections
4. Implement permission-based menu items

**Integration Tasks:**
- Update `components/layout/Header.tsx` with auth state
- Modify dashboard CTA button with wallet connection
- Add user profile dropdown with role display
- Implement logout functionality

---

## Phase 4: Management Interfaces

### Step 4.1: Admin Dashboard

**Create Admin Interface (`pages/admin/` or `components/admin/`):**
```
admin/
├── AdminDashboard.tsx     # Main admin interface
├── UserManagement.tsx     # User list and management
├── RoleManagement.tsx     # Role assignment interface
├── PermissionMatrix.tsx   # Permission management grid
└── UserActivityLog.tsx    # Activity monitoring
```

**Key Features:**
- User list with search and filtering
- Role assignment and modification
- Permission management interface
- User activity monitoring
- Bulk user operations

### Step 4.2: Moderator Dashboard

**Create Moderator Interface:**
- Limited user management capabilities
- Basic user role viewing
- User status management
- Moderation tools specific to platform needs

### Step 4.3: User Profile Management

**Create User Profile Interface:**
- Profile viewing and basic settings
- Role and permission display
- Wallet address management
- Authentication history

---

## Phase 5: Integration & Polish

### Step 5.1: Dashboard Integration

**Integration Checklist:**
- [ ] Update main dashboard with authentication state
- [ ] Modify CTA button to show "Connect Wallet" when not authenticated
- [ ] Add user info display in dashboard header
- [ ] Implement smooth transitions between auth states
- [ ] Add loading states during wallet operations

### Step 5.2: User Experience Enhancements

**UX Improvements:**
- Add Framer Motion animations for auth flow
- Implement proper loading skeletons
- Add accessibility features (ARIA labels, keyboard navigation)
- Create comprehensive error boundaries
- Add toast notifications for auth events

### Step 5.3: Security Hardening

**Security Implementation:**
- JWT token expiration handling
- Automatic session timeout
- Secure logout with token cleanup
- CSRF protection measures
- Input validation and sanitization

---

## Phase 6: Testing & Quality Assurance

### Step 6.1: Automated Testing

**Test Structure:**
```
__tests__/auth/
├── AuthService.test.ts      # Unit tests for auth service
├── AuthContext.test.tsx     # Context provider tests
├── PermissionUtils.test.ts  # Permission logic tests
├── AuthFlow.e2e.test.ts     # End-to-end auth flow
└── RoleBasedUI.test.tsx     # Role-based rendering tests
```

**Testing Commands:**
```bash
# Run all tests
yarn test

# Run auth-specific tests
yarn test --testPathPattern=auth

# Run e2e tests
yarn test:e2e
```

### Step 6.2: Security Testing

**Security Validation:**
- Test signature verification with various wallet types
- Validate JWT token security and expiration
- Verify role-based access controls cannot be bypassed
- Test session management and timeout behavior
- Conduct basic penetration testing

### Step 6.3: Performance Testing

**Performance Metrics:**
- Authentication flow completion time < 5 seconds
- Wallet connection establishment < 3 seconds
- Page load times remain under 3 seconds
- Memory usage monitoring for auth state
- Bundle size impact analysis

---

## Development Guidelines

### Code Style & Standards
- Follow existing TypeScript patterns in the codebase
- Use existing UI components and styling patterns
- Implement proper error boundaries
- Add comprehensive TypeScript types
- Follow accessibility best practices

### Git Workflow
```bash
# Create feature branches for major components
git checkout -b feature/auth-service
git checkout -b feature/wallet-integration
git checkout -b feature/role-system

# Regular commits with descriptive messages
git commit -m "feat: implement wallet connection with AppKit"
git commit -m "feat: add role-based route protection"
git commit -m "test: add authentication service unit tests"
```

### Environment Configuration
```env
# Add to .env.local
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id
NEXT_PUBLIC_API_URL=https://api.wrytes.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
```

### API Integration Points
```typescript
// API endpoints to integrate with
const API_ENDPOINTS = {
  generateMessage: 'POST /auth/message',
  signIn: 'POST /auth/signin', 
  getCurrentUser: 'GET /auth/me',
  // Add other endpoints as needed
}
```

---

## Troubleshooting Guide

### Common Issues

**Wallet Connection Problems:**
- Verify Reown project configuration
- Check network compatibility
- Validate wallet provider setup

**Authentication Flow Issues:**
- Confirm API endpoint availability
- Verify message format matches backend expectations
- Check signature generation and verification

**Permission System Problems:**
- Validate role data structure from API
- Confirm permission checking logic
- Test role-based rendering conditions

### Debug Tools
- Browser developer tools for Web3 debugging
- React DevTools for component state inspection
- Network tab for API request monitoring
- Console logging for authentication flow

---

## Success Criteria Checklist

### Functional Requirements
- [ ] Users can connect Web3 wallet via Reown AppKit
- [ ] Authentication flow integrates with existing NestJS API
- [ ] Role-based access control functions correctly
- [ ] Admin/Moderator dashboards work properly
- [ ] Protected routes require authentication
- [ ] Permission system prevents unauthorized access

### Technical Requirements  
- [ ] Authentication service handles all API communication
- [ ] JWT tokens are managed securely
- [ ] Wallet connection state is maintained properly
- [ ] Error handling covers all failure scenarios
- [ ] Loading states provide proper user feedback

### Security Requirements
- [ ] Signature verification works correctly
- [ ] Tokens are stored securely (httpOnly cookies recommended)
- [ ] Role-based permissions cannot be bypassed client-side
- [ ] Session timeout functions properly
- [ ] No sensitive data exposed in client

### Performance Requirements
- [ ] Authentication flow completes in < 5 seconds
- [ ] Wallet connection establishes in < 3 seconds  
- [ ] Page load times remain under 3 seconds
- [ ] No memory leaks in authentication state
- [ ] Bundle size impact is minimal

---

## Next Steps After Implementation

1. **User Acceptance Testing** with different wallet types
2. **Security Audit** of authentication implementation
3. **Performance Optimization** based on usage metrics  
4. **Documentation** for users and administrators
5. **Monitoring Setup** for authentication metrics
6. **Backup and Recovery** procedures for user data

---

## Resources & Documentation

- **Reown AppKit Docs**: https://docs.reown.com/appkit/overview
- **Wagmi Documentation**: https://wagmi.sh/
- **Existing API Documentation**: [Link to internal API docs]
- **Design System**: Follow existing Wrytes design patterns
- **Testing Guidelines**: Use existing Jest/Testing Library setup

---

*This execution guide should be used alongside the detailed plan.md and the comprehensive todo list for systematic implementation of the Web3 authentication and permissions system.*