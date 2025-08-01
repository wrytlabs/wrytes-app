import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBars, faTimes, faFolder, faChartBar, faWallet, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { COMPANY } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleOverlayClick = () => {
    closeSidebar();
    closeMobileMenu();
  };

  const handleCTAClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-text-primary">
      {/* Dashboard Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-card border-b border-dark-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-accent-orange rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 text-white" />
              </div>
              <Link href="/" className="text-xl font-bold text-white">
                {COMPANY.name.split(' ')[0]}
                <span className="text-accent-orange">.</span>
              </Link>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleCTAClick}
                  className="inline-flex items-center gap-2 bg-accent-orange text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                >
                  <FontAwesomeIcon icon={faWallet} className="w-3 h-3" />
                  Connect Wallet
                </button>
              ) : (
                <>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Connected as</p>
                    <p className="text-white font-mono text-sm">
                      {user?.walletAddress?.slice(0, 8)}...{user?.walletAddress?.slice(-6)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 bg-red-500/80 text-white ml-3 px-3 py-2 rounded-lg hover:bg-red-500/90 transition-colors text-sm font-medium"
                    title="Disconnect wallet"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-3 h-3" />
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-text-secondary hover:text-accent-orange transition-colors"
            >
              <FontAwesomeIcon 
                icon={isMobileMenuOpen ? faTimes : faBars} 
                className="w-5 h-5" 
              />
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-dark-surface pt-4">
              <nav className="space-y-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-2 text-accent-orange bg-accent-orange/20 rounded-lg shadow-sm"
                  onClick={closeMobileMenu}
                >
                  <FontAwesomeIcon icon={faChartLine} className="w-4 h-4" />
                  Overview
                </Link>
                <Link
                  href="/dashboard/projects"
                  className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-accent-orange hover:bg-accent-orange/20 rounded-lg transition-all duration-200 hover:shadow-sm"
                  onClick={closeMobileMenu}
                >
                  <FontAwesomeIcon icon={faFolder} className="w-4 h-4" />
                  Projects
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-accent-orange hover:bg-accent-orange/20 rounded-lg transition-all duration-200 hover:shadow-sm"
                  onClick={closeMobileMenu}
                >
                  <FontAwesomeIcon icon={faChartBar} className="w-4 h-4" />
                  Analytics
                </Link>
                {!isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleCTAClick();
                      closeMobileMenu();
                    }}
                    className="inline-flex items-center gap-2 bg-accent-orange text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                  >
                    <FontAwesomeIcon icon={faWallet} className="w-3 h-3" />
                    Connect Wallet
                  </button>
                ) : (
                  <>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Connected as</p>
                      <p className="text-white font-mono text-sm">
                        {user?.walletAddress?.slice(0, 8)}...{user?.walletAddress?.slice(-6)}
                      </p>
                                             <button
                         type="button"
                         onClick={() => {
                           handleLogout();
                           closeMobileMenu();
                         }}
                         className="inline-flex items-center gap-2 bg-red-500/80 text-white px-3 py-2 rounded-lg hover:bg-red-500/90 transition-colors text-sm font-medium mt-2"
                         title="Disconnect wallet"
                       >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-3 h-3" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex pt-16">
        {/* Sidebar Overlay */}
        {(isSidebarOpen || isMobileMenuOpen) && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={handleOverlayClick}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`fixed left-0 top-16 mt-2 w-64 h-screen bg-dark-bg border-r border-accent-orange/20 transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-3 px-4 py-2 text-accent-orange bg-accent-orange/20 rounded-lg shadow-sm"
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faChartLine} className="w-4 h-4" />
                  Overview
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/projects" 
                  className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-accent-orange hover:bg-accent-orange/20 rounded-lg transition-all duration-200 hover:shadow-sm"
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faFolder} className="w-4 h-4" />
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/analytics" 
                  className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-accent-orange hover:bg-accent-orange/20 rounded-lg transition-all duration-200 hover:shadow-sm"
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faChartBar} className="w-4 h-4" />
                  Analytics
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:ml-64">
          {children}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
} 