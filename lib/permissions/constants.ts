// Standard permission actions
export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read', 
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage', // Full control
  MODERATE: 'moderate', // Limited administrative control
  VIEW: 'view', // Read-only access
  EXECUTE: 'execute', // Execute specific operations
} as const

// Standard permission resources
export const PERMISSION_RESOURCES = {
  USER: 'user',
  ROLE: 'role', 
  PERMISSION: 'permission',
  DASHBOARD: 'dashboard',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics',
  LOGS: 'logs',
} as const

// Common permission combinations
export const PERMISSIONS = {
  // User management
  USER_CREATE: `${PERMISSION_RESOURCES.USER}.${PERMISSION_ACTIONS.CREATE}`,
  USER_READ: `${PERMISSION_RESOURCES.USER}.${PERMISSION_ACTIONS.READ}`,
  USER_UPDATE: `${PERMISSION_RESOURCES.USER}.${PERMISSION_ACTIONS.UPDATE}`,
  USER_DELETE: `${PERMISSION_RESOURCES.USER}.${PERMISSION_ACTIONS.DELETE}`,
  USER_MANAGE: `${PERMISSION_RESOURCES.USER}.${PERMISSION_ACTIONS.MANAGE}`,
  USER_MODERATE: `${PERMISSION_RESOURCES.USER}.${PERMISSION_ACTIONS.MODERATE}`,

  // Role management
  ROLE_CREATE: `${PERMISSION_RESOURCES.ROLE}.${PERMISSION_ACTIONS.CREATE}`,
  ROLE_READ: `${PERMISSION_RESOURCES.ROLE}.${PERMISSION_ACTIONS.READ}`,
  ROLE_UPDATE: `${PERMISSION_RESOURCES.ROLE}.${PERMISSION_ACTIONS.UPDATE}`,
  ROLE_DELETE: `${PERMISSION_RESOURCES.ROLE}.${PERMISSION_ACTIONS.DELETE}`,
  ROLE_MANAGE: `${PERMISSION_RESOURCES.ROLE}.${PERMISSION_ACTIONS.MANAGE}`,

  // Permission management
  PERMISSION_CREATE: `${PERMISSION_RESOURCES.PERMISSION}.${PERMISSION_ACTIONS.CREATE}`,
  PERMISSION_READ: `${PERMISSION_RESOURCES.PERMISSION}.${PERMISSION_ACTIONS.READ}`,
  PERMISSION_UPDATE: `${PERMISSION_RESOURCES.PERMISSION}.${PERMISSION_ACTIONS.UPDATE}`,
  PERMISSION_DELETE: `${PERMISSION_RESOURCES.PERMISSION}.${PERMISSION_ACTIONS.DELETE}`,
  PERMISSION_MANAGE: `${PERMISSION_RESOURCES.PERMISSION}.${PERMISSION_ACTIONS.MANAGE}`,

  // Dashboard access
  DASHBOARD_VIEW: `${PERMISSION_RESOURCES.DASHBOARD}.${PERMISSION_ACTIONS.VIEW}`,
  DASHBOARD_MANAGE: `${PERMISSION_RESOURCES.DASHBOARD}.${PERMISSION_ACTIONS.MANAGE}`,

  // Admin access
  ADMIN_ACCESS: `${PERMISSION_RESOURCES.ADMIN}.${PERMISSION_ACTIONS.VIEW}`,
  ADMIN_MANAGE: `${PERMISSION_RESOURCES.ADMIN}.${PERMISSION_ACTIONS.MANAGE}`,

  // Moderator access
  MODERATOR_ACCESS: `${PERMISSION_RESOURCES.MODERATOR}.${PERMISSION_ACTIONS.VIEW}`,
  MODERATOR_MANAGE: `${PERMISSION_RESOURCES.MODERATOR}.${PERMISSION_ACTIONS.MANAGE}`,

  // Profile management
  PROFILE_VIEW: `${PERMISSION_RESOURCES.PROFILE}.${PERMISSION_ACTIONS.VIEW}`,
  PROFILE_UPDATE: `${PERMISSION_RESOURCES.PROFILE}.${PERMISSION_ACTIONS.UPDATE}`,

  // Settings
  SETTINGS_VIEW: `${PERMISSION_RESOURCES.SETTINGS}.${PERMISSION_ACTIONS.VIEW}`,
  SETTINGS_UPDATE: `${PERMISSION_RESOURCES.SETTINGS}.${PERMISSION_ACTIONS.UPDATE}`,
  SETTINGS_MANAGE: `${PERMISSION_RESOURCES.SETTINGS}.${PERMISSION_ACTIONS.MANAGE}`,

  // Analytics
  ANALYTICS_VIEW: `${PERMISSION_RESOURCES.ANALYTICS}.${PERMISSION_ACTIONS.VIEW}`,
  ANALYTICS_MANAGE: `${PERMISSION_RESOURCES.ANALYTICS}.${PERMISSION_ACTIONS.MANAGE}`,

  // Logs
  LOGS_VIEW: `${PERMISSION_RESOURCES.LOGS}.${PERMISSION_ACTIONS.VIEW}`,
  LOGS_MANAGE: `${PERMISSION_RESOURCES.LOGS}.${PERMISSION_ACTIONS.MANAGE}`,

  // Super admin (wildcard)
  SUPER_ADMIN: '*.*',
} as const

// Role definitions with default permissions
export const DEFAULT_ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.SUPER_ADMIN, // Full access
  ],
  moderator: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_MODERATE,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.MODERATOR_ACCESS,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_UPDATE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.LOGS_VIEW,
  ],
  user: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_UPDATE,
  ],
} as const

// Role hierarchy levels
export const ROLE_LEVELS = {
  USER: 1,
  MODERATOR: 2,
  ADMIN: 3,
} as const

// Role configurations
export const ROLE_CONFIG = {
  admin: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access and user management',
    level: ROLE_LEVELS.ADMIN,
    color: 'red',
    permissions: DEFAULT_ROLE_PERMISSIONS.admin,
  },
  moderator: {
    name: 'moderator',
    displayName: 'Moderator',
    description: 'Limited administrative access and user moderation',
    level: ROLE_LEVELS.MODERATOR,
    color: 'blue',
    permissions: DEFAULT_ROLE_PERMISSIONS.moderator,
  },
  user: {
    name: 'user',
    displayName: 'User',
    description: 'Standard user access',
    level: ROLE_LEVELS.USER,
    color: 'green',
    permissions: DEFAULT_ROLE_PERMISSIONS.user,
  },
} as const

// Permission categories for UI organization
export const PERMISSION_CATEGORIES = {
  USER_MANAGEMENT: {
    name: 'User Management',
    permissions: [
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,
      PERMISSIONS.USER_MANAGE,
      PERMISSIONS.USER_MODERATE,
    ],
  },
  ROLE_MANAGEMENT: {
    name: 'Role Management',
    permissions: [
      PERMISSIONS.ROLE_CREATE,
      PERMISSIONS.ROLE_READ,
      PERMISSIONS.ROLE_UPDATE,
      PERMISSIONS.ROLE_DELETE,
      PERMISSIONS.ROLE_MANAGE,
    ],
  },
  SYSTEM_ACCESS: {
    name: 'System Access',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.ADMIN_ACCESS,
      PERMISSIONS.MODERATOR_ACCESS,
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.LOGS_VIEW,
    ],
  },
  CONTENT_MANAGEMENT: {
    name: 'Content Management',
    permissions: [
      PERMISSIONS.DASHBOARD_MANAGE,
      PERMISSIONS.SETTINGS_MANAGE,
      PERMISSIONS.ANALYTICS_MANAGE,
      PERMISSIONS.LOGS_MANAGE,
    ],
  },
} as const

// Navigation menu items with required permissions
export const NAVIGATION_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    requiredPermission: PERMISSIONS.DASHBOARD_VIEW,
    icon: 'faHome',
  },
  {
    label: 'Admin Panel',
    path: '/admin',
    requiredPermission: PERMISSIONS.ADMIN_ACCESS,
    icon: 'faUserShield',
    children: [
      {
        label: 'User Management',
        path: '/admin/users',
        requiredPermission: PERMISSIONS.USER_MANAGE,
        icon: 'faUsers',
      },
      {
        label: 'Role Management',
        path: '/admin/roles',
        requiredPermission: PERMISSIONS.ROLE_MANAGE,
        icon: 'faUserTag',
      },
      {
        label: 'System Settings',
        path: '/admin/settings',
        requiredPermission: PERMISSIONS.SETTINGS_MANAGE,
        icon: 'faCog',
      },
    ],
  },
  {
    label: 'Moderator Panel',
    path: '/moderator',
    requiredPermission: PERMISSIONS.MODERATOR_ACCESS,
    icon: 'faShield',
    children: [
      {
        label: 'User Moderation',
        path: '/moderator/users',
        requiredPermission: PERMISSIONS.USER_MODERATE,
        icon: 'faUserCheck',
      },
    ],
  },
  {
    label: 'Analytics',
    path: '/analytics',
    requiredPermission: PERMISSIONS.ANALYTICS_VIEW,
    icon: 'faChartBar',
  },
  {
    label: 'Profile',
    path: '/profile',
    requiredPermission: PERMISSIONS.PROFILE_VIEW,
    icon: 'faUser',
  },
] as const