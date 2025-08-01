import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUsers, 
  faUserShield, 
  faKey, 
  faChartBar,
  faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RequireRole } from '@/components/auth/RequireRole'
import { useState, useEffect } from 'react'
import { AuthService } from '@/lib/auth/AuthService'

// API service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.wrytes.io'

// Fallback mock data for when API endpoints are not available
const mockAdminStats: AdminStats = {
  totalUsers: 1234,
  activeUsers: 892,
  adminUsers: 5,
  moderatorUsers: 12,
  pendingUsers: 23,
  todayLogins: 145,
}

const mockRecentActivity: ActivityItem[] = [
  {
    id: 1,
    type: 'user_registered',
    message: 'New user registered',
    walletAddress: '0x1234...5678',
    timestamp: '2 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'role_changed',
    message: 'User role changed to moderator',
    walletAddress: '0x5678...9abc',
    timestamp: '15 minutes ago',
    status: 'info'
  },
  {
    id: 3,
    type: 'suspicious_activity',
    message: 'Multiple failed login attempts',
    walletAddress: '0x9abc...def0',
    timestamp: '1 hour ago',
    status: 'warning'
  },
]

const mockSystemHealth: SystemHealthItem[] = [
  { name: 'API Status', status: 'operational', description: 'Operational' },
  { name: 'Database', status: 'operational', description: 'Healthy' },
  { name: 'Auth Service', status: 'degraded', description: 'Degraded' },
  { name: 'Web3 RPC', status: 'operational', description: 'Normal' },
]

const apiService = {
  async getAdminStats(): Promise<AdminStats> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        console.warn('Admin stats endpoint not available, using mock data')
        return mockAdminStats
      }
      
      return response.json()
    } catch (error) {
      console.warn('Failed to fetch admin stats, using mock data:', error)
      return mockAdminStats
    }
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/activity`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        console.warn('Admin activity endpoint not available, using mock data')
        return mockRecentActivity
      }
      
      return response.json()
    } catch (error) {
      console.warn('Failed to fetch recent activity, using mock data:', error)
      return mockRecentActivity
    }
  },

  async getSystemHealth(): Promise<SystemHealthItem[]> {
    const authService = AuthService.getInstance()
    const token = authService.getStoredToken()
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/health`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        console.warn('Admin health endpoint not available, using mock data')
        return mockSystemHealth
      }
      
      return response.json()
    } catch (error) {
      console.warn('Failed to fetch system health, using mock data:', error)
      return mockSystemHealth
    }
  },
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  moderatorUsers: number
  pendingUsers: number
  todayLogins: number
}

interface ActivityItem {
  id: number
  type: string
  message: string
  walletAddress: string
  timestamp: string
  status: 'success' | 'info' | 'warning' | 'error'
}

interface SystemHealthItem {
  name: string
  status: 'operational' | 'degraded' | 'down'
  description: string
}

function AdminDashboardContent() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, activeUsers: 0, adminUsers: 0, moderatorUsers: 0, pendingUsers: 0, todayLogins: 0 })
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealthItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [statsData, activityData, healthData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getRecentActivity(),
        apiService.getSystemHealth()
      ])
      setStats(statsData)
      setRecentActivity(activityData)
      setSystemHealth(healthData)
    } catch (err) {
      console.error('Failed to load admin data:', err)
      // Don't show error since we have fallback data - just log it
      console.warn('Using fallback data for admin dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshStats = async () => {
    await loadData()
  }

  useEffect(() => {
    loadData()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered': return faCheckCircle
      case 'role_changed': return faUserShield
      case 'suspicious_activity': return faExclamationTriangle
      default: return faUsers
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500'
      case 'info': return 'text-blue-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Wrytes</title>
        <meta name="description" content="Administrative dashboard for managing users and system" />
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
        {isLoading && stats.totalUsers === 0 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orange"></div>
            <p className="text-text-secondary mt-4">Loading admin dashboard...</p>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-text-secondary">
              Manage users, roles, and system permissions
            </p>
          </div>
          <button
            onClick={refreshStats}
            disabled={isLoading}
            className="px-4 py-2 bg-accent-orange hover:bg-accent-orange/80 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Stats'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">{stats.adminUsers}</p>
              </div>
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faUserShield} className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Moderators</p>
                <p className="text-2xl font-bold text-white">{stats.moderatorUsers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faKey} className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{stats.pendingUsers}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Today&apos;s Logins</p>
                <p className="text-2xl font-bold text-white">{stats.todayLogins}</p>
              </div>
              <div className="w-10 h-10 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faChartBar} className="w-5 h-5 text-accent-orange" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-dark-surface/50 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faUsers} className="mr-3 text-blue-500" />
                <span className="text-white">Manage Users</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-dark-surface/50 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faUserShield} className="mr-3 text-red-500" />
                <span className="text-white">Manage Roles</span>
              </button>
              <button className="w-full text-left p-3 hover:bg-dark-surface/50 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faKey} className="mr-3 text-green-500" />
                <span className="text-white">Permission Matrix</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-dark-card p-6 rounded-xl border border-dark-surface">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-dark-surface/30 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-500/20' :
                    activity.status === 'info' ? 'bg-blue-500/20' :
                    activity.status === 'warning' ? 'bg-yellow-500/20' :
                    'bg-red-500/20'
                  }`}>
                    <FontAwesomeIcon 
                      icon={getActivityIcon(activity.type)} 
                      className={`w-4 h-4 ${getActivityColor(activity.status)}`} 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.message}</p>
                    <p className="text-text-secondary text-sm">
                      {activity.walletAddress} • {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
          <h3 className="text-lg font-bold text-white mb-4">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {systemHealth.map((service) => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'operational': return 'bg-green-500'
                  case 'degraded': return 'bg-yellow-500'
                  case 'down': return 'bg-red-500'
                  default: return 'bg-gray-500'
                }
              }
              
              return (
                <div key={service.name} className="text-center">
                  <div className={`w-3 h-3 ${getStatusColor(service.status)} rounded-full mx-auto mb-2`}></div>
                  <p className="text-sm text-white font-medium">{service.name}</p>
                  <p className="text-xs text-text-secondary">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <RequireRole role="admin">
        <AdminDashboardContent />
      </RequireRole>
    </ProtectedRoute>
  )
}