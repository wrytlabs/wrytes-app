import Head from 'next/head'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUserShield,
  faPlus,
  faEdit,
  faTrash,
  faKey,
  faCheck,
  faSave,
  faUsers,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RequireRole } from '@/components/auth/RequireRole'
import { type Role, type Permission } from '@/lib/auth/types'
import { AuthService } from '@/lib/auth/AuthService'

// API service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.wrytes.io'

const apiService = {
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

  async getAllPermissions(): Promise<Permission[]> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.statusText}`)
    }
    
    return response.json()
  },

  async createRole(roleData: { name: string; description: string }): Promise<Role> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create role: ${response.statusText}`)
    }
    
    return response.json()
  },

  async updateRole(roleId: string, roleData: { name: string; description: string }): Promise<Role> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update role: ${response.statusText}`)
    }
    
    return response.json()
  },

  async deleteRole(roleId: string): Promise<void> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete role: ${response.statusText}`)
    }
  },

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissionId }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to assign permission: ${response.statusText}`)
    }
  },

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}/permissions/${permissionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to remove permission: ${response.statusText}`)
    }
  },
}


interface RoleFormData {
  name: string
  description: string
  permissions: string[]
}

function RoleManagementContent() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: []
  })
  const [error, setError] = useState<string | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [rolesData, permissionsData] = await Promise.all([
        apiService.getAllRoles(),
        apiService.getAllPermissions()
      ])
      setRoles(rolesData)
      setPermissions(permissionsData)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load roles and permissions')
    } finally {
      setIsLoading(false)
    }
  }

  // Group permissions by resource
  const permissionsByResource = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = []
    }
    acc[permission.resource].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const handleCreateRole = () => {
    setShowCreateForm(true)
    setEditingRole(null)
    setFormData({
      name: '',
      description: '',
      permissions: []
    })
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setShowCreateForm(true)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions?.map(p => p.id) || []
    })
  }

  const handleSaveRole = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      let savedRole: Role
      
      if (editingRole) {
        // Update existing role
        savedRole = await apiService.updateRole(editingRole.id, {
          name: formData.name,
          description: formData.description
        })
        
        // Update permissions for the role
        const currentPermissionIds = editingRole.permissions?.map(p => p.id) || []
        const newPermissionIds = formData.permissions
        
        // Remove permissions that are no longer selected
        for (const permissionId of currentPermissionIds) {
          if (!newPermissionIds.includes(permissionId)) {
            await apiService.removePermissionFromRole(editingRole.id, permissionId)
          }
        }
        
        // Add permissions that are newly selected
        for (const permissionId of newPermissionIds) {
          if (!currentPermissionIds.includes(permissionId)) {
            await apiService.assignPermissionToRole(editingRole.id, permissionId)
          }
        }
        
        // Reload data to get updated role with permissions
        await loadData()
      } else {
        // Create new role
        savedRole = await apiService.createRole({
          name: formData.name,
          description: formData.description
        })
        
        // Assign permissions to the new role
        for (const permissionId of formData.permissions) {
          await apiService.assignPermissionToRole(savedRole.id, permissionId)
        }
        
        // Reload data to get the new role with permissions
        await loadData()
      }
      
      setShowCreateForm(false)
      setEditingRole(null)
    } catch (err) {
      console.error('Failed to save role:', err)
      setError('Failed to save role')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (role?.isSystem) {
      alert('Cannot delete system roles')
      return
    }
    
    if (confirm('Are you sure you want to delete this role?')) {
      setIsLoading(true)
      setError(null)
      
      try {
        await apiService.deleteRole(roleId)
        await loadData() // Reload data to reflect changes
      } catch (err) {
        console.error('Failed to delete role:', err)
        setError('Failed to delete role')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePermissionToggle = (permissionId: string) => {
    const currentPermissions = formData.permissions
    if (currentPermissions.includes(permissionId)) {
      setFormData({
        ...formData,
        permissions: currentPermissions.filter(id => id !== permissionId)
      })
    } else {
      setFormData({
        ...formData,
        permissions: [...currentPermissions, permissionId]
      })
    }
  }

  const toggleResourcePermissions = (resource: string) => {
    const resourcePermissions = permissionsByResource[resource].map(p => p.id)
    const allSelected = resourcePermissions.every(id => formData.permissions.includes(id))
    
    if (allSelected) {
      // Remove all permissions for this resource
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(id => !resourcePermissions.includes(id))
      })
    } else {
      // Add all permissions for this resource
      const newPermissions = [...formData.permissions]
      resourcePermissions.forEach(id => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id)
        }
      })
      setFormData({
        ...formData,
        permissions: newPermissions
      })
    }
  }

  const getRoleTypeColor = (isSystem: boolean) => {
    return isSystem ? 'text-blue-400' : 'text-green-400'
  }

  const getUserCount = (roleId: string) => {
    // Mock user count - replace with actual API call
    const counts: Record<string, number> = {
      admin: 5,
      moderator: 12,
      user: 1234
    }
    return counts[roleId] || 0
  }

  return (
    <>
      <Head>
        <title>Role Management - Admin - Wrytes</title>
        <meta name="description" content="Manage user roles and permissions" />
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
        {isLoading && roles.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orange"></div>
            <p className="text-text-secondary mt-4">Loading roles and permissions...</p>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Role Management</h1>
            <p className="text-text-secondary">
              Manage user roles and permission assignments
            </p>
          </div>
          <button
            onClick={handleCreateRole}
            className="px-4 py-2 bg-accent-orange hover:bg-accent-orange/80 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            Create Role
          </button>
        </div>

        {/* Create/Edit Role Form */}
        {showCreateForm && (
          <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-orange"
                    placeholder="Enter role name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-dark-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent-orange"
                    placeholder="Describe this role"
                  />
                </div>
                

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveRole}
                    disabled={isLoading || !formData.name.trim()}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                    {isLoading ? 'Saving...' : 'Save Role'}
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div className="lg:col-span-2">
                <h4 className="text-md font-medium text-white mb-4">Permissions</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(permissionsByResource).map(([resource, resourcePermissions]) => (
                    <div key={resource} className="bg-dark-surface/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-white capitalize">{resource} Permissions</h5>
                        <button
                          onClick={() => toggleResourcePermissions(resource)}
                          className="text-xs px-2 py-1 bg-accent-orange/20 text-accent-orange rounded"
                        >
                          {resourcePermissions.every(p => formData.permissions.includes(p.id))
                            ? 'Deselect All'
                            : 'Select All'
                          }
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {resourcePermissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-center gap-2 p-2 hover:bg-dark-surface/50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="rounded border-gray-600 bg-dark-surface text-accent-orange focus:ring-accent-orange"
                            />
                            <div>
                              <div className="text-sm text-white">{permission.name}</div>
                              <div className="text-xs text-gray-400">{permission.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Roles List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-dark-card p-6 rounded-xl border border-dark-surface">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    role.isSystem ? 'bg-blue-500/20' : 'bg-green-500/20'
                  }`}>
                    <FontAwesomeIcon 
                      icon={faUserShield} 
                      className={`w-5 h-5 ${getRoleTypeColor(role.isSystem || false)}`} 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</h3>
                    <p className="text-sm text-gray-400">{role.isSystem ? 'System Role' : 'Custom Role'}</p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Edit Role"
                  >
                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                  </button>
                  {!role.isSystem && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete Role"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-4 h-12 overflow-hidden">{role.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                  {getUserCount(role.id)} users
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FontAwesomeIcon icon={faKey} className="w-4 h-4" />
                  {role.permissions?.length || 0} permissions
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-white mb-3">Permissions</h4>
                <div className="p-3 bg-dark-surface/30 rounded-lg max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {role.permissions?.map((permission) => (
                      <div key={permission.id} className="flex items-center gap-2 text-xs">
                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400" />
                        <span className="text-white">{permission.name}</span>
                        <span className="text-gray-400">- {permission.description}</span>
                      </div>
                    )) || []}
                    {(!role.permissions || role.permissions.length === 0) && (
                      <div className="text-center text-gray-500 text-xs py-2">
                        No permissions assigned
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {roles.length === 0 && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faUserShield} className="w-12 h-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No roles found</h3>
            <p className="text-text-secondary mb-4">
              Create your first role to get started.
            </p>
            <button
              onClick={handleCreateRole}
              className="px-4 py-2 bg-accent-orange hover:bg-accent-orange/80 text-white rounded-lg transition-colors"
            >
              Create First Role
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default function RoleManagement() {
  return (
    <ProtectedRoute>
      <RequireRole role="admin">
        <RoleManagementContent />
      </RequireRole>
    </ProtectedRoute>
  )
}