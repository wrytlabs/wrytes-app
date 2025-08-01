import { type Address } from 'viem'

// Authentication related types
export interface AuthMessageRequest {
  address: Address
  valid?: number
  expired?: number
}

export interface AuthSignInRequest {
  message: string
  signature: `0x${string}`
}

export interface AuthResponse {
  accessToken: string
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem?: boolean
}

export interface User {
  id: string
  walletAddress: Address
  username?: string
  email?: string
  isActive: boolean
  profileData?: Record<string, unknown>
  createdAt: string
  updatedAt: string
  lastLogin?: string
  roles: Role[]
}

export interface UserProfile extends User {
  preferences?: {
    theme?: 'light' | 'dark'
    language?: string
    notifications?: boolean
  }
}

// Authentication state types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  token: string | null
}

export interface AuthContextType extends AuthState {
  signIn: (address: Address) => Promise<void>
  signOut: () => void
  refreshToken: () => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  clearError: () => void
  authFlow: AuthFlowState
}

// Wallet connection types
export interface WalletState {
  isConnected: boolean
  isConnecting: boolean
  address: Address | null
  chainId: number | null
  error: string | null
}

// API error types
export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, unknown>
}

// Authentication flow steps
export enum AuthStep {
  CONNECT_WALLET = 'connect_wallet',
  GENERATE_MESSAGE = 'generate_message',
  SIGN_MESSAGE = 'sign_message',
  VERIFY_SIGNATURE = 'verify_signature',
  AUTHENTICATED = 'authenticated',
  ERROR = 'error',
}

export interface AuthFlowState {
  currentStep: AuthStep
  isLoading: boolean
  error: string | null
  message?: string
  signature?: `0x${string}`
}

// Permission checking types
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage'
export type PermissionResource = 'user' | 'role' | 'permission' | 'dashboard' | 'admin' | 'moderator'

export interface PermissionCheck {
  resource: PermissionResource
  action: PermissionAction
}

// Component prop types for conditional rendering
export interface ConditionalRenderProps {
  condition: 'permission' | 'role' | 'authenticated'
  value?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}