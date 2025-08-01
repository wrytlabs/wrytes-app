import Head from 'next/head'
import { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUsers, 
  faSearch,
  faFilter,
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
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RequireRole } from '@/components/auth/RequireRole'
import { type User, type Role } from '@/lib/auth/types'

// Mock data - replace with actual API calls
const mockUsers: User[] = [
  {
    id: '1',
    walletAddress: '0x1234567890123456789012345678901234567890',
    username: 'admin_user',
    email: 'admin@wrytes.io',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T15:30:00Z',
    lastLogin: '2024-01-16T14:00:00Z',
    roles: [{
      id: 'admin',
      name: 'admin',
      description: 'Full system administrator with all permissions',
      isSystem: true,
      permissions: []
    }],
    profileData: { verified: true }
  },
  {
    id: '2',
    walletAddress: '0x2345678901234567890123456789012345678901',
    username: 'moderator_1',
    email: 'mod1@wrytes.io',
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    lastLogin: '2024-01-15T11:30:00Z',
    roles: [{
      id: 'moderator',
      name: 'moderator',
      description: 'Moderator with user management permissions',
      isSystem: true,
      permissions: []
    }]
  },
  {
    id: '3',
    walletAddress: '0x3456789012345678901234567890123456789012',
    username: undefined,
    email: undefined,
    isActive: false,
    createdAt: '2024-01-05T16:00:00Z',
    updatedAt: '2024-01-05T16:00:00Z',
    lastLogin: undefined,
    roles: [{
      id: 'user',
      name: 'user',
      description: 'Standard user with basic permissions',
      isSystem: true,
      permissions: []
    }]
  }
]

const mockRoles: Role[] = [
  { id: 'admin', name: 'admin', description: 'Full system administrator with all permissions', isSystem: true, permissions: [] },
  { id: 'moderator', name: 'moderator', description: 'Moderator with user management permissions', isSystem: true, permissions: [] },
  { id: 'user', name: 'user', description: 'Standard user with basic permissions', isSystem: true, permissions: [] }
]

type SortField = 'username' | 'walletAddress' | 'createdAt' | 'lastLogin' | 'role'
type SortDirection = 'asc' | 'desc'

interface UserFilters {
  search: string
  role: string
  status: 'all' | 'active' | 'inactive'
}

function UserManagementContent() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [roles] = useState<Role[]>(mockRoles)
  const [isLoading, setIsLoading] = useState(false)
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
    let filtered = users.filter(user => {
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
        const hasRole = user.roles.some(role => role.id === filters.role)
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
      let aValue: any, bValue: any

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
          aValue = a.roles[0]?.name || ''
          bValue = b.roles[0]?.name || ''
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

  const getRoleBadgeColor = (roleName: string) => {
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

  // Mock functions - replace with actual API calls
  const handleUserAction = async (action: string, userId: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log(`${action} user ${userId}`)
      setIsLoading(false)
    }, 1000)
  }

  const handleBulkAction = async (action: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log(`${action} users:`, Array.from(selectedUsers))
      setSelectedUsers(new Set())
      setShowBulkActions(false)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <>
      <Head>
        <title>User Management - Admin - Wrytes</title>
        <meta name="description" content="Manage user accounts, roles, and permissions" />
      </Head>
      
      <div className="space-y-6">
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
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
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
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(role => (
                          <span
                            key={role.id}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRoleBadgeColor(role.name)}`}
                          >
                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                          </span>
                        ))}
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
      </div>
    </>
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