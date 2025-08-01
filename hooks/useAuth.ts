import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { type AuthContextType } from '@/lib/auth/types'

/**
 * Hook to access authentication context
 * Provides access to authentication state and functions
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Re-export the context for direct access if needed
export { AuthContext } from '@/contexts/AuthContext'