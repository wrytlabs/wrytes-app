import Head from 'next/head'
import { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUsers, 
  faSearch,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faUserShield,
  faCheck,
  faTimes,
  faSort,
  faSortUp,
  faSortDown,
  faExclamationTriangle,
  faCalendar,
  faWallet,
  faEnvelope,
  faUser,
  faKey,
  faSave
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RequireRole } from '@/components/auth/RequireRole'
import { type User, type Role } from '@/lib/auth/types'
import { AuthService } from '@/lib/auth/AuthService'

// API service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.wrytes.io'

const apiService = {
  async getAllUsers(): Promise<User[]> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    // Try to include roles in the query - some APIs use query parameters
    const response = await fetch(`${API_BASE_URL}/users?include=roles&includeInactive=true`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`)
    }
    
    const users = await response.json()
    
    // Process role assignments to extract actual role data
    interface UserWithRoleAssignments {
      id: string
      userRoles?: any[]
      roles?: any[]
      [key: string]: any
    }
    
    interface RoleAssignment {
      role?: {
        id: string
        name: string
        description: string
        rolePermissions?: any[]
        isSystem?: boolean
      }
      id?: string
      name?: string
      description?: string
      permissions?: any[]
      isSystem?: boolean
      roleId?: string
    }
    
    const processedUsers = users.map((user: UserWithRoleAssignments) => {
      let userRoles: Role[] = []
      
      // Check if user has userRoles property (seems to be the actual role assignments)
      const roleAssignments = user.userRoles || user.roles || []
      
      if (roleAssignments && roleAssignments.length > 0) {
        userRoles = roleAssignments.map((roleAssignment: RoleAssignment) => {
          // If it has a nested 'role' property, extract it
          if (roleAssignment.role) {
            return {
              id: roleAssignment.role.id,
              name: roleAssignment.role.name,
              description: roleAssignment.role.description,
              permissions: roleAssignment.role.rolePermissions || [],
              isSystem: roleAssignment.role.isSystem || false
            }
          }
          
          // If it already looks like a role object
          if (roleAssignment.name) {
            return {
              id: roleAssignment.id!,
              name: roleAssignment.name,
              description: roleAssignment.description || '',
              permissions: roleAssignment.permissions || [],
              isSystem: roleAssignment.isSystem || false
            }
          }
          
          // Otherwise, it might be a role assignment without nested data
          return {
            id: roleAssignment.roleId || roleAssignment.id || 'unknown',
            name: 'Unknown',
            description: 'Role data not available',
            permissions: [],
            isSystem: false
          }
        })
      }
      
      return { ...user, roles: userRoles }
    })
    
    return processedUsers
  },

  async getUserRoles(userId: string): Promise<Role[]> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/roles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user roles: ${response.statusText}`)
    }
    
    return response.json()
  },

  async getAllRoles(): Promise<Role[]> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/roles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.statusText}`)
    }
    
    return response.json()
  },

  async updateUserProfile(userId: string, profileData: { username?: string; email?: string; profileData?: Record<string, any> }): Promise<User> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    // Use the new admin-specific endpoint for updating any user's profile
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update user profile: ${response.statusText}`)
    }
    
    return response.json()
  },

  async activateUser(userId: string): Promise<User> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/activate`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to activate user: ${response.statusText}`)
    }
    
    return response.json()
  },

  async deactivateUser(userId: string): Promise<User> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/deactivate`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to deactivate user: ${response.statusText}`)
    }
    
    return response.json()
  },

  async deleteUser(userId: string): Promise<void> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`)
    }
  },

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/roles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        roleId,
        expiresAt: null // Optional expiration date - set to null for permanent
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to assign role: ${response.statusText}`)
    }
  },

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/roles/${roleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to remove role: ${response.statusText}`)
    }
  },

  async bulkUpdateUsers(userIds: string[], action: 'activate' | 'deactivate' | 'delete'): Promise<void> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/users/bulk`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIds, action }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to bulk update users: ${response.statusText}`)
    }
  },
}

type SortField = 'username' | 'walletAddress' | 'createdAt' | 'lastLogin' | 'role'
type SortDirection = 'asc' | 'desc'

interface UserFilters {
  search: string
  role: string
  status: 'all' | 'active' | 'inactive'
}

function UserManagementContent() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [usersData, rolesData] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getAllRoles()
      ])
      
      
      setUsers(usersData)
      setRoles(rolesData)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load users and roles')
    } finally {
      setIsLoading(false)
    }
  }
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all'
  })
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          user.username?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.walletAddress.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Role filter
      if (filters.role !== 'all') {
        const hasRole = user.roles?.some(role => role.id === filters.role) || false
        if (!hasRole) return false
      }

      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'active' && !user.isActive) return false
        if (filters.status === 'inactive' && user.isActive) return false
      }

      return true
    })

    // Sort users
    filtered.sort((a, b) => {
      let aValue: string | Date, bValue: string | Date

      switch (sortField) {
        case 'username':
          aValue = a.username || ''
          bValue = b.username || ''
          break
        case 'walletAddress':
          aValue = a.walletAddress
          bValue = b.walletAddress
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'lastLogin':
          aValue = a.lastLogin ? new Date(a.lastLogin) : new Date(0)
          bValue = b.lastLogin ? new Date(b.lastLogin) : new Date(0)
          break
        case 'role':
          aValue = a.roles?.[0]?.name || ''
          bValue = b.roles?.[0]?.name || ''
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [users, filters, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return faSort
    return sortDirection === 'asc' ? faSortUp : faSortDown
  }

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
    setShowBulkActions(newSelected.size > 0)
  }

  const toggleAllUsers = () => {
    if (selectedUsers.size === filteredAndSortedUsers.length) {
      setSelectedUsers(new Set())
      setShowBulkActions(false)
    } else {
      setSelectedUsers(new Set(filteredAndSortedUsers.map(user => user.id)))
      setShowBulkActions(true)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getRoleBadgeColor = (roleName: string | undefined) => {
    if (!roleName) return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    
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

  const handleUserAction = async (action: string, userId: string) => {
    const user = users.find(u => u.id === userId)
    
    try {
      switch (action) {
        case 'view':
          if (user) {
            setViewingUser(user)
          }
          break
        case 'edit':
          if (user) {
            setEditingUser(user)
          }
          break
        case 'delete':
          if (confirm('Are you sure you want to delete this user?')) {
            setIsLoading(true)
            setError(null)
            await apiService.deleteUser(userId)
            await loadData() // Reload data
          }
          break
        case 'activate':
          setIsLoading(true)
          setError(null)
          await apiService.activateUser(userId)
          await loadData()
          break
        case 'deactivate':
          setIsLoading(true)
          setError(null)
          await apiService.deactivateUser(userId)
          await loadData()
          break
      }
    } catch (err) {
      console.error(`Failed to ${action} user:`, err)
      setError(`Failed to ${action} user`)
    } finally {
      if (action !== 'view' && action !== 'edit') {
        setIsLoading(false)
      }
    }
  }

  const handleBulkAction = async (action: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const userIds = Array.from(selectedUsers)
      await apiService.bulkUpdateUsers(userIds, action as 'activate' | 'deactivate' | 'delete')
      await loadData() // Reload data
      setSelectedUsers(new Set())
      setShowBulkActions(false)
    } catch (err) {
      console.error(`Failed to ${action} users:`, err)
      setError(`Failed to ${action} users`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>User Management - Admin - Wrytes</title>
        <meta name="description" content="Manage user accounts, roles, and permissions" />
      </Head>
      
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
            <div className="flex items-center text-red-400">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && users.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orange"></div>
            <p className="text-text-secondary mt-4">Loading users and roles...</p>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-text-secondary">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <button
            className="px-4 py-2 bg-accent-orange hover:bg-accent-orange/80 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
              />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-orange"
              />
            </div>

            {/* Role Filter */}
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="px-4 py-2 bg-dark-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-orange"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as 'all' | 'active' | 'inactive' })}
              className="px-4 py-2 bg-dark-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-orange"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-text-secondary">
              <FontAwesomeIcon icon={faUsers} className="mr-2 w-4 h-4" />
              {filteredAndSortedUsers.length} users found
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-orange-400">
                {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  disabled={isLoading}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors disabled:opacity-50"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  disabled={isLoading}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm transition-colors disabled:opacity-50"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={isLoading}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-dark-card rounded-xl border border-dark-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-surface/50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                      onChange={toggleAllUsers}
                      className="rounded border-gray-600 bg-dark-surface text-accent-orange focus:ring-accent-orange"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('username')}
                  >
                    <div className="flex items-center gap-2">
                      User
                      <FontAwesomeIcon icon={getSortIcon('username')} className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('walletAddress')}
                  >
                    <div className="flex items-center gap-2">
                      Wallet Address
                      <FontAwesomeIcon icon={getSortIcon('walletAddress')} className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      <FontAwesomeIcon icon={getSortIcon('role')} className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Status
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <div className="flex items-center gap-2">
                      Last Login
                      <FontAwesomeIcon icon={getSortIcon('lastLogin')} className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-surface">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-surface/30">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-600 bg-dark-surface text-accent-orange focus:ring-accent-orange"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">
                          {user.username || 'Anonymous'}
                        </div>
                        {user.email && (
                          <div className="text-text-secondary text-sm">{user.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-gray-300 bg-dark-surface px-2 py-1 rounded">
                        {formatAddress(user.walletAddress)}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {user.roles?.map((role, index) => {
                          // Handle both string roles and role objects
                          const roleName = typeof role === 'string' ? role : role?.name || 'Unknown'
                          const roleId = typeof role === 'string' ? role : role?.id || index.toString()
                          const roleDesc = typeof role === 'string' ? '' : role?.description || 'No description'
                          const isSystem = typeof role === 'string' ? false : role?.isSystem || false
                          
                          return (
                            <span
                              key={roleId}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRoleBadgeColor(roleName)} ${
                                user.roles!.length > 2 ? 'mb-1' : ''
                              }`}
                              title={`${roleName}: ${roleDesc}`}
                            >
                              {roleName.charAt(0).toUpperCase() + roleName.slice(1)}
                              {isSystem && (
                                <span className="ml-1 text-xs opacity-60">⚡</span>
                              )}
                            </span>
                          )
                        }) || []}
                        {(!user.roles || user.roles.length === 0) && (
                          <span className="text-gray-500 text-xs italic">No roles assigned</span>
                        )}
                        {user.roles && user.roles.length > 3 && (
                          <span className="text-xs text-gray-400 px-2 py-1">
                            +{user.roles.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        user.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        <FontAwesomeIcon 
                          icon={user.isActive ? faCheck : faTimes} 
                          className="mr-1 w-3 h-3" 
                        />
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUserAction('view', user.id)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction('edit', user.id)}
                          className="p-2 text-green-400 hover:text-green-300 transition-colors"
                          title="Edit User"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleUserAction('delete', user.id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete User"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faUsers} className="w-12 h-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
              <p className="text-text-secondary">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {viewingUser && (
          <UserDetailModal 
            user={viewingUser} 
            onClose={() => setViewingUser(null)} 
          />
        )}

        {/* User Edit Modal */}
        {editingUser && (
          <UserEditModal 
            user={editingUser}
            roles={roles}
            onClose={() => setEditingUser(null)}
            onSave={loadData}
          />
        )}
      </div>
    </>
  )
}

// User Detail Modal Component
interface UserDetailModalProps {
  user: User
  onClose: () => void
}

function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const getRoleBadgeColor = (roleName: string | undefined) => {
    if (!roleName) return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-card rounded-xl border border-dark-surface p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faWallet} className="mr-2" />
                  Wallet Address
                </label>
                <code className="block w-full p-3 bg-dark-surface rounded-lg text-gray-300 font-mono text-sm break-all">
                  {user.walletAddress}
                </code>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Username
                </label>
                <div className="w-full p-3 bg-dark-surface rounded-lg text-white">
                  {user.username || 'Not set'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Email
                </label>
                <div className="w-full p-3 bg-dark-surface rounded-lg text-white">
                  {user.email || 'Not set'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                  user.isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <FontAwesomeIcon 
                    icon={user.isActive ? faCheck : faTimes} 
                    className="mr-2 w-4 h-4" 
                  />
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Created At
                </label>
                <div className="w-full p-3 bg-dark-surface rounded-lg text-white">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Last Login
                </label>
                <div className="w-full p-3 bg-dark-surface rounded-lg text-white">
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Never'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Roles Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              <FontAwesomeIcon icon={faUserShield} className="mr-2" />
              Assigned Roles ({user.roles?.length || 0})
            </label>
            <div className="bg-dark-surface rounded-lg p-4">
              {user.roles && user.roles.length > 0 ? (
                <div className="space-y-3">
                  {user.roles.map((role) => (
                    <div key={role.id} className="flex items-start justify-between bg-dark-card p-4 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRoleBadgeColor(role.name)}`}>
                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                            {role.isSystem && (
                              <span className="ml-1 text-xs opacity-60">⚡</span>
                            )}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{role.description}</p>
                        <div className="mt-2">
                          <span className="text-xs text-gray-400">
                            <FontAwesomeIcon icon={faKey} className="mr-1" />
                            {role.permissions?.length || 0} permissions
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FontAwesomeIcon icon={faUserShield} className="w-12 h-12 mb-4 opacity-50" />
                  <p>No roles assigned to this user</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// User Edit Modal Component
interface UserEditModalProps {
  user: User
  roles: Role[]
  onClose: () => void
  onSave: () => void
}

interface EditFormData {
  username: string
  email: string
  isActive: boolean
  assignedRoleIds: string[]
}

function UserEditModal({ user, roles, onClose, onSave }: UserEditModalProps) {
  const [formData, setFormData] = useState<EditFormData>({
    username: user.username || '',
    email: user.email || '',
    isActive: user.isActive,
    assignedRoleIds: user.roles?.map(r => r.id) || []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getRoleBadgeColor = (roleName: string | undefined) => {
    if (!roleName) return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    
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

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedRoleIds: prev.assignedRoleIds.includes(roleId)
        ? prev.assignedRoleIds.filter(id => id !== roleId)
        : [...prev.assignedRoleIds, roleId]
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let statusUpdated = false
      let profileUpdated = false
      let rolesUpdated = false

      // Handle account status changes (activate/deactivate)
      if (formData.isActive !== user.isActive) {
        try {
          if (formData.isActive) {
            await apiService.activateUser(user.id)
            console.log('User activated successfully')
          } else {
            await apiService.deactivateUser(user.id)
            console.log('User deactivated successfully')
          }
          statusUpdated = true
        } catch (statusError) {
          console.warn('Status update failed:', statusError)
          // Continue with other updates
        }
      }

      // Handle profile updates (username, email)
      // Note: The API endpoint updates the current user's profile, not admin updating other users
      // This might need a different approach or admin-specific endpoint
      if (formData.username !== (user.username || '') || formData.email !== (user.email || '')) {
        try {
          await apiService.updateUserProfile(user.id, {
            username: formData.username || undefined,
            email: formData.email || undefined
          })
          profileUpdated = true
          console.log('User profile updated successfully')
        } catch (profileError) {
          console.warn('Profile update failed (may require different admin endpoint):', profileError)
          // Continue with role updates - this is expected limitation
        }
      }

      // Handle role changes
      const currentRoleIds = user.roles?.map(r => r.id) || []
      const newRoleIds = formData.assignedRoleIds

      if (JSON.stringify(currentRoleIds.sort()) !== JSON.stringify(newRoleIds.sort())) {
        try {
          // Remove roles that are no longer assigned
          for (const roleId of currentRoleIds) {
            if (!newRoleIds.includes(roleId)) {
              await apiService.removeRoleFromUser(user.id, roleId)
              console.log(`Removed role ${roleId} from user`)
            }
          }

          // Add newly assigned roles
          for (const roleId of newRoleIds) {
            if (!currentRoleIds.includes(roleId)) {
              await apiService.assignRoleToUser(user.id, roleId)
              console.log(`Added role ${roleId} to user`)
            }
          }
          rolesUpdated = true
          console.log('User roles updated successfully')
        } catch (roleUpdateError) {
          console.error('Role update failed:', roleUpdateError)
          throw roleUpdateError // This should work, so we throw if it fails
        }
      }

      // Show success feedback
      const updates = []
      if (statusUpdated) updates.push('account status')
      if (profileUpdated) updates.push('profile information') 
      if (rolesUpdated) updates.push('role assignments')
      
      if (updates.length > 0) {
        console.log(`Successfully updated: ${updates.join(', ')}`)
      } else {
        console.log('No changes detected')
      }

      onSave() // Refresh the user list
      onClose() // Close modal
    } catch (err) {
      console.error('Failed to update user:', err)
      setError('Failed to update user. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = () => {
    const currentRoleIds = user.roles?.map(r => r.id).sort() || []
    const newRoleIds = [...formData.assignedRoleIds].sort()
    
    return (
      formData.username !== (user.username || '') ||
      formData.email !== (user.email || '') ||
      formData.isActive !== user.isActive ||
      JSON.stringify(currentRoleIds) !== JSON.stringify(newRoleIds)
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-card rounded-xl border border-dark-surface p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-6">
            <div className="flex items-center text-red-400">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-dark-surface pb-2">
              User Information
            </h3>

            {/* Wallet Address (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FontAwesomeIcon icon={faWallet} className="mr-2" />
                Wallet Address
              </label>
              <code className="block w-full p-3 bg-dark-surface rounded-lg text-gray-300 font-mono text-sm break-all">
                {user.walletAddress}
              </code>
              <p className="text-xs text-gray-500 mt-1">Wallet address cannot be changed</p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 bg-dark-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-orange"
                placeholder="Enter username (optional)"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 bg-dark-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-orange"
                placeholder="Enter email (optional)"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Status
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.isActive}
                    onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                    className="mr-2 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-green-400">Active</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={!formData.isActive}
                    onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
                    className="mr-2 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-red-400">Inactive</span>
                </label>
              </div>
            </div>

            {/* User Stats */}
            <div className="bg-dark-surface/30 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Account Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Login:</span>
                  <span className="text-white">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Roles:</span>
                  <span className="text-white">{user.roles?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Management */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-dark-surface pb-2">
              <FontAwesomeIcon icon={faUserShield} className="mr-2" />
              Role Management
            </h3>

            <div className="bg-dark-surface/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-white">Available Roles</h4>
                <span className="text-xs text-gray-400">
                  {formData.assignedRoleIds.length} of {roles.length} assigned
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {roles.map((role) => {
                  const isAssigned = formData.assignedRoleIds.includes(role.id)
                  return (
                    <label
                      key={role.id}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isAssigned 
                          ? 'bg-accent-orange/10 border border-accent-orange/30' 
                          : 'bg-dark-surface/50 hover:bg-dark-surface/70 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => handleRoleToggle(role.id)}
                        className="mt-1 rounded border-gray-600 bg-dark-surface text-accent-orange focus:ring-accent-orange"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRoleBadgeColor(role.name)}`}>
                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                            {role.isSystem && (
                              <span className="ml-1 text-xs opacity-60">⚡</span>
                            )}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">{role.description}</p>
                        <p className="text-xs text-gray-400">
                          <FontAwesomeIcon icon={faKey} className="mr-1" />
                          {role.permissions?.length || 0} permissions
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Currently Assigned Roles Summary */}
            {formData.assignedRoleIds.length > 0 && (
              <div className="bg-dark-surface/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-3">Selected Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.assignedRoleIds.map(roleId => {
                    const role = roles.find(r => r.id === roleId)
                    if (!role) return null
                    return (
                      <span
                        key={roleId}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRoleBadgeColor(role.name)}`}
                      >
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                        {role.isSystem && (
                          <span className="ml-1 text-xs opacity-60">⚡</span>
                        )}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-dark-surface">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            {hasChanges() && (
              <span className="text-sm text-yellow-400">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isLoading || !hasChanges()}
              className="px-6 py-2 bg-accent-orange hover:bg-accent-orange/80 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UserManagement() {
  return (
    <ProtectedRoute>
      <RequireRole role="admin">
        <UserManagementContent />
      </RequireRole>
    </ProtectedRoute>
  )
}