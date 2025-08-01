import Head from 'next/head'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUserShield,
  faPlus,
  faEdit,
  faTrash,
  faKey,
  faCheck,
  faSave,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RequireRole } from '@/components/auth/RequireRole'
import { type Role, type Permission } from '@/lib/auth/types'

// Mock data - replace with actual API calls - matching seed.ts permissions
const mockPermissions: Permission[] = [
  // User management
  { id: 'users.create', name: 'users.create', description: 'Create new users', resource: 'users', action: 'create' },
  { id: 'users.read', name: 'users.read', description: 'View user information', resource: 'users', action: 'read' },
  { id: 'users.update', name: 'users.update', description: 'Edit user profiles', resource: 'users', action: 'update' },
  { id: 'users.delete', name: 'users.delete', description: 'Delete user accounts', resource: 'users', action: 'delete' },

  // Role management
  { id: 'roles.create', name: 'roles.create', description: 'Create new roles', resource: 'roles', action: 'create' },
  { id: 'roles.read', name: 'roles.read', description: 'View role information', resource: 'roles', action: 'read' },
  { id: 'roles.update', name: 'roles.update', description: 'Edit role details', resource: 'roles', action: 'update' },
  { id: 'roles.delete', name: 'roles.delete', description: 'Delete roles', resource: 'roles', action: 'delete' },
  { id: 'roles.assign', name: 'roles.assign', description: 'Assign roles to users', resource: 'roles', action: 'assign' },

  // Permission management
  { id: 'permissions.create', name: 'permissions.create', description: 'Create new permissions', resource: 'permissions', action: 'create' },
  { id: 'permissions.read', name: 'permissions.read', description: 'View permission information', resource: 'permissions', action: 'read' },
  { id: 'permissions.update', name: 'permissions.update', description: 'Edit permission details', resource: 'permissions', action: 'update' },
  { id: 'permissions.delete', name: 'permissions.delete', description: 'Delete permissions', resource: 'permissions', action: 'delete' },

  // System administration
  { id: 'system.admin', name: 'system.admin', description: 'Full system administration', resource: 'system', action: 'admin' },
  { id: 'system.monitor', name: 'system.monitor', description: 'Monitor system health', resource: 'system', action: 'monitor' },
  { id: 'system.status', name: 'system.status', description: 'Get system status', resource: 'system', action: 'status' },
]

const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'admin',
    description: 'Full system administrator with all permissions',
    isSystem: true,
    permissions: mockPermissions
  },
  {
    id: 'moderator',
    name: 'moderator',
    description: 'Moderator with user management permissions',
    isSystem: true,
    permissions: mockPermissions.filter(p => 
      p.resource === 'users' || 
      (p.resource === 'roles' && (p.action === 'read' || p.action === 'assign')) ||
      (p.resource === 'system' && (p.action === 'monitor' || p.action === 'status'))
    )
  },
  {
    id: 'user',
    name: 'user',
    description: 'Standard user with basic permissions',
    isSystem: true,
    permissions: mockPermissions.filter(p => 
      p.resource === 'system' && p.action === 'status'
    )
  }
]

interface RoleFormData {
  name: string
  description: string
  permissions: string[]
}

function RoleManagementContent() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [permissions] = useState<Permission[]>(mockPermissions)
  const [isLoading, setIsLoading] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: []
  })

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
      permissions: role.permissions.map(p => p.id)
    })
  }

  const handleSaveRole = async () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const selectedPermissions = permissions.filter(p => formData.permissions.includes(p.id))
      
      if (editingRole) {
        // Update existing role
        setRoles(roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...formData, permissions: selectedPermissions }
            : role
        ))
      } else {
        // Create new role
        const newRole: Role = {
          id: formData.name.toLowerCase().replace(/\s+/g, '_'),
          ...formData,
          permissions: selectedPermissions
        }
        setRoles([...roles, newRole])
      }
      
      setShowCreateForm(false)
      setEditingRole(null)
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (role?.isSystem) {
      alert('Cannot delete system roles')
      return
    }
    
    if (confirm('Are you sure you want to delete this role?')) {
      setIsLoading(true)
      
      // Simulate API call
      setTimeout(() => {
        setRoles(roles.filter(role => role.id !== roleId))
        setIsLoading(false)
      }, 1000)
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
                  {role.permissions.length} permissions
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-white mb-3">Permissions</h4>
                <div className="p-3 bg-dark-surface/30 rounded-lg max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {role.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center gap-2 text-xs">
                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400" />
                        <span className="text-white">{permission.name}</span>
                        <span className="text-gray-400">- {permission.description}</span>
                      </div>
                    ))}
                    {role.permissions.length === 0 && (
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