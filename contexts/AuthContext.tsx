import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { type Address } from 'viem'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { AuthService } from '@/lib/auth/AuthService'
import { AuthStorage } from '@/lib/auth/storage'
import {
  type AuthContextType,
  type AuthState,
  type User,
  type ApiError,
  AuthStep,
  type AuthFlowState,
} from '@/lib/auth/types'

// Auth state management
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_AUTH_FLOW'; payload: Partial<AuthFlowState> }

const initialAuthState: AuthState & { authFlow: AuthFlowState } = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  authFlow: {
    currentStep: AuthStep.CONNECT_WALLET,
    isLoading: false,
    error: null,
  },
}

function authReducer(
  state: AuthState & { authFlow: AuthFlowState },
  action: AuthAction
): AuthState & { authFlow: AuthFlowState } {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_TOKEN':
      return { ...state, token: action.payload }
    case 'CLEAR_AUTH':
      return {
        ...initialAuthState,
        authFlow: { ...initialAuthState.authFlow },
      }
    case 'SET_AUTH_FLOW':
      return {
        ...state,
        authFlow: { ...state.authFlow, ...action.payload },
      }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)
  const authService = AuthService.getInstance()
  
  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        const token = authService.getStoredToken()
        const storedUser = authService.getStoredUser()

        if (token && storedUser && authService.isAuthenticated()) {
          dispatch({ type: 'SET_TOKEN', payload: token })
          dispatch({ type: 'SET_USER', payload: storedUser })
          
          // Try to refresh user data
          try {
            const currentUser = await authService.getCurrentUser()
            dispatch({ type: 'SET_USER', payload: currentUser })
          } catch (error) {
            // If refresh fails, clear stored data
            console.warn('Failed to refresh user data:', error)
            authService.clearToken()
            authService.getStoredUser() && AuthStorage.clearUser()
            dispatch({ type: 'CLEAR_AUTH' })
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' })
      }
    }

    initializeAuth()
  }, [])

  // Handle wallet connection state changes
  useEffect(() => {
    if (isConnected && address) {
      dispatch({
        type: 'SET_AUTH_FLOW',
        payload: { 
          currentStep: state.isAuthenticated ? AuthStep.AUTHENTICATED : AuthStep.GENERATE_MESSAGE,
          error: null,
        },
      })
    } else if (!isConnected) {
      dispatch({
        type: 'SET_AUTH_FLOW',
        payload: { 
          currentStep: AuthStep.CONNECT_WALLET,
          error: null,
        },
      })
    }
  }, [isConnected, address, state.isAuthenticated])

  // Sign in function
  const signIn = useCallback(async (walletAddress: Address) => {
    if (!walletAddress) {
      throw new Error('Wallet address is required')
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    dispatch({
      type: 'SET_AUTH_FLOW',
      payload: { 
        currentStep: AuthStep.GENERATE_MESSAGE,
        isLoading: true,
        error: null,
      },
    })

    try {
      // Step 1: Generate message
      const message = await authService.generateMessage(walletAddress)
      dispatch({
        type: 'SET_AUTH_FLOW',
        payload: { 
          currentStep: AuthStep.SIGN_MESSAGE,
          message,
          isLoading: false,
        },
      })

      // Step 2: Sign message
      dispatch({
        type: 'SET_AUTH_FLOW',
        payload: { isLoading: true },
      })
      
      const signature = await signMessageAsync({ message }) as `0x${string}`
      dispatch({
        type: 'SET_AUTH_FLOW',
        payload: { 
          currentStep: AuthStep.VERIFY_SIGNATURE,
          signature,
        },
      })

      // Step 3: Verify signature and get token
      const authResponse = await authService.signIn(message, signature)
      dispatch({ type: 'SET_TOKEN', payload: authResponse.accessToken })

      // Step 4: Get user profile
      const user = await authService.getCurrentUser()
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({
        type: 'SET_AUTH_FLOW',
        payload: { 
          currentStep: AuthStep.AUTHENTICATED,
          isLoading: false,
        },
      })

    } catch (error) {
      console.error('Sign in error:', error)
      const apiError = error as ApiError
      const errorMessage = apiError.message || 'Authentication failed'
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      dispatch({
        type: 'SET_AUTH_FLOW',
        payload: { 
          currentStep: AuthStep.ERROR,
          isLoading: false,
          error: errorMessage,
        },
      })
    }
  }, [signMessageAsync])

  // Sign out function
  const signOut = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      await authService.signOut()
      disconnect()
    } catch (error) {
      console.warn('Sign out error:', error)
    } finally {
      dispatch({ type: 'CLEAR_AUTH' })
    }
  }, [disconnect])

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken()
      dispatch({ type: 'SET_TOKEN', payload: response.accessToken })
      
      // Get updated user profile
      const user = await authService.getCurrentUser()
      dispatch({ type: 'SET_USER', payload: user })
    } catch (error) {
      console.error('Token refresh error:', error)
      // If refresh fails, sign out
      await signOut()
    }
  }, [signOut])

  // Check if user has specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user || !state.user.roles) return false
    
    return state.user.roles.some(role => 
      role.permissions?.some(p => 
        p.name === permission || 
        `${p.resource}.${p.action}` === permission
      )
    )
  }, [state.user])

  // Check if user has specific role
  const hasRole = useCallback((role: string): boolean => {
    if (!state.user || !state.user.roles) return false
    return state.user.roles.some(r => r.name.toLowerCase() === role.toLowerCase())
  }, [state.user])

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null })
    dispatch({
      type: 'SET_AUTH_FLOW',
      payload: { error: null },
    })
  }, [])

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!state.isAuthenticated || !state.token) return

    const checkTokenExpiration = () => {
      if (authService.isTokenExpiringSoon()) {
        refreshToken()
      }
    }

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [state.isAuthenticated, state.token, refreshToken])

  const contextValue: AuthContextType = {
    ...state,
    signIn,
    signOut,
    refreshToken,
    hasPermission,
    hasRole,
    clearError,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}