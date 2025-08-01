import React from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserShield, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/useAuth'

interface RequireRoleProps {
  role: string | string[]
  children: React.ReactNode
  fallback?: React.ReactNode
  showError?: boolean
  errorMessage?: string
}

export function RequireRole({ 
  role, 
  children, 
  fallback,
  showError = true,
  errorMessage
}: RequireRoleProps) {
  const { hasRole, user, isAuthenticated } = useAuth()

  // If not authenticated, don't render anything
  if (!isAuthenticated || !user) {
    return null
  }

  const roles = Array.isArray(role) ? role : [role]
  const hasRequiredRole = roles.some(r => hasRole(r))

  // If user has required role, render children
  if (hasRequiredRole) {
    return <>{children}</>
  }

  // If fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>
  }

  // If showError is false, render nothing
  if (!showError) {
    return null
  }

  // Default error display
  const defaultErrorMessage = errorMessage || 
    `Access denied. Required role: ${Array.isArray(role) ? role.join(' or ') : role}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
    >
      <div className="flex items-center text-red-400">
        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
        <span className="text-sm">{defaultErrorMessage}</span>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Current role: {user.role?.name || 'No role assigned'}
      </div>
    </motion.div>
  )
}

// Higher-order component version for route-level protection
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string | string[],
  options?: {
    fallback?: React.ReactNode
    showError?: boolean
    errorMessage?: string
  }
) {
  const ProtectedComponent = (props: P) => {
    return (
      <RequireRole
        role={requiredRole}
        fallback={options?.fallback}
        showError={options?.showError}
        errorMessage={options?.errorMessage}
      >
        <Component {...props} />
      </RequireRole>
    )
  }

  ProtectedComponent.displayName = `withRoleProtection(${Component.displayName || Component.name})`
  
  return ProtectedComponent
}

// Component for displaying role badge
export function RoleBadge({ className = '' }: { className?: string }) {
  const { user } = useAuth()

  if (!user?.role) return null

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'moderator':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'user':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRoleColor(user.role.name)} ${className}`}>
      <FontAwesomeIcon icon={faUserShield} className="mr-1 text-xs" />
      {user.role.name}
    </div>
  )
}