import { type User, type PermissionCheck } from '@/lib/auth/types'

/**
 * Check if user has a specific permission
 */
export function checkPermission(user: User | null, permission: string): boolean {
  if (!user || !user.roles) return false
  
  return user.roles.some(role => 
    role.permissions?.some(p => 
      p.name === permission || 
      `${p.resource}.${p.action}` === permission ||
      `${p.resource}.*` === permission || // Wildcard for all actions on resource
      '*.*' === permission // Super admin permission
    )
  )
}

/**
 * Check if user has a specific role
 */
export function checkRole(user: User | null, role: string): boolean {
  if (!user || !user.roles) return false
  return user.roles.some(r => r.name.toLowerCase() === role.toLowerCase())
}

/**
 * Check if user has any of the specified roles
 */
export function checkAnyRole(user: User | null, roles: string[]): boolean {
  if (!user || !user.roles) return false
  return roles.some(role => checkRole(user, role))
}

/**
 * Check if user has all of the specified roles (for multi-role systems)
 */
export function checkAllRoles(user: User | null, roles: string[]): boolean {
  if (!user || !user.roles) return false
  return roles.every(role => checkRole(user, role))
}

/**
 * Get all available actions for a user on a specific resource
 */
export function getAvailableActions(user: User | null, resource: string): string[] {
  if (!user || !user.roles) return []
  
  const allPermissions = user.roles.flatMap(role => role.permissions || [])
  
  return allPermissions
    .filter(p => p.resource === resource || p.resource === '*')
    .map(p => p.action)
    .filter((action, index, arr) => arr.indexOf(action) === index) // Remove duplicates
}

/**
 * Get all resources a user has access to
 */
export function getAccessibleResources(user: User | null): string[] {
  if (!user || !user.roles) return []
  
  const allPermissions = user.roles.flatMap(role => role.permissions || [])
  
  return allPermissions
    .map(p => p.resource)
    .filter((resource, index, arr) => arr.indexOf(resource) === index) // Remove duplicates
    .filter(resource => resource !== '*') // Exclude wildcard
}

/**
 * Check multiple permissions at once
 */
export function checkMultiplePermissions(
  user: User | null, 
  permissions: string[], 
  requireAll: boolean = false
): boolean {
  if (!user) return false
  
  if (requireAll) {
    return permissions.every(permission => checkPermission(user, permission))
  } else {
    return permissions.some(permission => checkPermission(user, permission))
  }
}

/**
 * Check structured permission (resource + action)
 */
export function checkStructuredPermission(
  user: User | null, 
  check: PermissionCheck
): boolean {
  if (!user) return false
  
  const permissionString = `${check.resource}.${check.action}`
  return checkPermission(user, permissionString)
}

/**
 * Check if user is admin (has admin role or admin permissions)
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false
  
  // Check role
  if (checkRole(user, 'admin')) return true
  
  // Check for admin-level permissions
  return checkPermission(user, '*.*') || 
         checkPermission(user, 'admin.*') ||
         checkMultiplePermissions(user, [
           'user.manage',
           'role.manage', 
           'permission.manage'
         ], true)
}

/**
 * Check if user is moderator
 */
export function isModerator(user: User | null): boolean {
  if (!user) return false
  
  return checkRole(user, 'moderator') || 
         checkPermission(user, 'moderator.*') ||
         checkPermission(user, 'user.moderate')
}

/**
 * Check if user has system role
 */
export function hasSystemRole(user: User | null): boolean {
  if (!user || !user.roles) return false
  return user.roles.some(role => role.isSystem === true)
}

/**
 * Filter items based on user permissions
 */
export function filterByPermission<T>(
  items: T[],
  user: User | null,
  getPermission: (item: T) => string
): T[] {
  if (!user) return []
  
  return items.filter(item => {
    const permission = getPermission(item)
    return checkPermission(user, permission)
  })
}

/**
 * Create permission string from resource and action
 */
export function createPermission(resource: string, action: string): string {
  return `${resource}.${action}`
}

/**
 * Parse permission string into resource and action
 */
export function parsePermission(permission: string): { resource: string; action: string } | null {
  const parts = permission.split('.')
  if (parts.length !== 2) return null
  
  return {
    resource: parts[0],
    action: parts[1]
  }
}

/**
 * Check if permission is wildcard
 */
export function isWildcardPermission(permission: string): boolean {
  return permission.includes('*')
}

/**
 * Get all permissions as readable strings
 */
export function getReadablePermissions(user: User | null): string[] {
  if (!user || !user.roles) return []
  
  const allPermissions = user.roles.flatMap(role => role.permissions || [])
  
  return allPermissions.map(p => {
    if (p.description) return p.description
    return `${p.action} ${p.resource}`.replace(/\./g, ' ')
  })
}

/**
 * Validate permission format
 */
export function isValidPermissionFormat(permission: string): boolean {
  // Allow wildcards and resource.action format
  return /^(\*|\w+)\.(\*|\w+)$/.test(permission)
}