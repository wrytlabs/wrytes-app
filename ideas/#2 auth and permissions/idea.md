# Web3 Wallet Authentication Integration

## Overview
Integrate the existing custom signature-based authentication system with the frontend application using Reown AppKit for wallet connection and signature generation.

## Current Authentication System Analysis

### Backend API Architecture
- **Framework**: NestJS with JWT authentication
- **Authentication Method**: Custom signature-based system using wallet addresses
- **Key Components**: 
  - `AuthController` with two main endpoints
  - `AuthService` for message generation and signature verification
  - `WalletService` for signature validation
  - Role-based access control with permissions

### Authentication Flow
The API implements a two-step authentication process:

1. **Message Generation** (`POST /auth/message`)
   - Input: `{ address: string, valid?: number, expired?: number }`
   - Output: Custom message string for signing
   - Message format: `"Signing this message confirms your control over the wallet address: {address} valid: {timestamp} expired: {timestamp}"`

2. **Signature Verification** (`POST /auth/signin`)
   - Input: `{ message: string, signature: string }`
   - Process: Verifies signature against message and wallet address
   - Output: JWT access token for authenticated requests

### Security Features
- **Message Validation**: Timestamp validation (valid/expired windows)
- **Address Verification**: Ethereum address format validation
- **Signature Verification**: Cryptographic signature verification using WalletService
- **User Management**: Automatic user creation for new wallet addresses
- **JWT Tokens**: Secure token generation with user payload

## Integration Goals

### 1. Frontend Wallet Integration
- **Technology**: Reown AppKit Web3 package
- **Documentation**: https://docs.reown.com/appkit/overview
- **Implementation**:
  - Connect wallet using the ctaButton in the dashboard with ctaAction funtion
  - Message signing functionality
  - Signature generation for API authentication

### 2. Authentication Flow Integration
- **Step 1**: User connects wallet via AppKit
- **Step 2**: Frontend calls `/auth/message` with wallet address
- **Step 3**: User signs the returned message using AppKit
- **Step 4**: Frontend calls `/auth/signin` with message and signature
- **Step 5**: Store JWT token for subsequent API requests

### 3. Role-Based Access Control
- **Existing Roles**: Admin, Moderator, User (from API)
- **Frontend Implementation**:
  - Role-based navigation and UI components
  - Permission-based route protection
  - Conditional rendering based on user permissions

### 4. Management Interfaces
- **Admin Dashboard**: Full user, role, and permission management
- **Moderator Dashboard**: Limited user management capabilities
- **User Profile**: Basic profile management and role viewing

## Technical Implementation Plan

### Phase 1: AppKit Integration
- [ ] Install and configure Reown AppKit
- [ ] Create wallet connection function for ctaButton
- [ ] Implement message signing functionality
- [ ] Build authentication service for API communication

### Phase 2: Authentication Flow
- [ ] Create authentication context/provider
- [ ] Implement message generation and signing flow
- [ ] Add JWT token storage and management
- [ ] Build authentication guards for protected routes

### Phase 3: Role-Based UI
- [ ] Create role-based navigation components
- [ ] Implement permission-based UI rendering
- [ ] Build protected route components
- [ ] Add role-based dashboard layouts

### Phase 4: Management Interfaces
- [ ] Design and implement admin dashboard
- [ ] Create user management components
- [ ] Build role and permission management UI
- [ ] Implement moderator dashboard

### Phase 5: Testing & Polish
- [ ] End-to-end authentication flow testing
- [ ] Security testing and validation
- [ ] UI/UX improvements
- [ ] Performance optimization

## API Integration Details

### Message Generation Endpoint
```typescript
POST /auth/message
Body: { address: string, valid?: number, expired?: number }
Response: string (message to sign)
```

### Sign In Endpoint
```typescript
POST /auth/signin
Body: { message: string, signature: string }
Response: { accessToken: string }
```

### User Profile Endpoint
```typescript
GET /auth/me
Headers: { Authorization: "Bearer {token}" }
Response: User profile with roles and permissions
```

## Technical Considerations

### Security
- **Message Validation**: Ensure proper timestamp validation on frontend
- **Signature Verification**: Trust the API's cryptographic verification
- **Token Management**: Secure JWT storage and refresh mechanisms
- **Address Validation**: Validate wallet addresses before API calls

### User Experience
- **Smooth Flow**: Seamless wallet connection and signing experience
- **Error Handling**: Clear error messages for authentication failures
- **Loading States**: Proper loading indicators during authentication
- **Fallback Options**: Handle wallet connection failures gracefully

### Performance
- **Token Caching**: Efficient JWT token storage and retrieval
- **API Optimization**: Minimize authentication API calls
- **State Management**: Efficient user state management across components

## Success Metrics
- Successful wallet-based authentication flow with existing API
- Role-based access control working correctly
- Admin and moderator can manage users effectively
- Seamless integration between frontend and custom API authentication
- Secure signature verification and JWT token management