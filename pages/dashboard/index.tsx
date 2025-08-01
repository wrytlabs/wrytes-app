import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartLine, faDollarSign, faRocket, faWallet } from '@fortawesome/free-solid-svg-icons';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { RoleBadge } from '@/components/auth/RequireRole';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { PERMISSIONS } from '@/lib/permissions/constants';

export default function Dashboard() {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - Wrytes</title>
        <meta name="description" content="Dashboard overview" />
      </Head>
      
      <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                {user && <RoleBadge />}
              </div>
              <p className="text-text-secondary">
                Welcome back{user ? `, ${user.address.slice(0, 6)}...${user.address.slice(-4)}` : ''}! Here's what's happening with your projects.
              </p>
            </div>
            
            {/* Auth Status */}
            <div className="flex items-center gap-4">
              {!isAuthenticated && (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faWallet} />
                  Connect Wallet
                </Button>
              )}
              {user && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Connected as</p>
                  <p className="text-white font-mono text-sm">
                    {user.address.slice(0, 8)}...{user.address.slice(-6)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Projects</p>
                  <p className="text-3xl font-bold text-white">24</p>
                </div>
                <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faRocket} className="w-6 h-6 text-accent-orange" />
                </div>
              </div>
            </div>

            <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Active Users</p>
                  <p className="text-3xl font-bold text-white">1,234</p>
                </div>
                <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-accent-orange" />
                </div>
              </div>
            </div>

            <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Revenue</p>
                  <p className="text-3xl font-bold text-white">$45.2K</p>
                </div>
                <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faDollarSign} className="w-6 h-6 text-accent-orange" />
                </div>
              </div>
            </div>

            <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Growth</p>
                  <p className="text-3xl font-bold text-white">+12.5%</p>
                </div>
                <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faChartLine} className="w-6 h-6 text-accent-orange" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-dark-card p-6 rounded-xl border border-dark-surface">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-dark-surface/50 rounded-lg">
                <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">New project "Blockchain Analytics" created</p>
                  <p className="text-text-secondary text-sm">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-dark-surface/50 rounded-lg">
                <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">AI model training completed</p>
                  <p className="text-text-secondary text-sm">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-dark-surface/50 rounded-lg">
                <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">Client meeting scheduled for tomorrow</p>
                  <p className="text-text-secondary text-sm">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </div>
    </ProtectedRoute>
  );
} 