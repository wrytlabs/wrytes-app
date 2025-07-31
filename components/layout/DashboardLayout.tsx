import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBars, faTimes, faArrowUpRightFromSquare, faFolder, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { COMPANY } from '@/lib/constants';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div className="hidden md:flex items-center">
              <button
                type="button"
                onClick={() => alert('Connect Wallet clicked')}
                className="inline-flex items-center gap-2 bg-accent-orange text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                Connect Wallet
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" />
              </button>
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
                <button
                  type="button"
                  onClick={() => {
                    alert('Connect Wallet clicked');
                    closeMobileMenu();
                  }}
                  className="inline-flex items-center gap-2 bg-accent-orange text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                >
                  Connect Wallet
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" />
                </button>
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
        <aside className={`fixed left-0 top-16 mt-1 w-64 h-screen bg-dark-bg border-r border-accent-orange/20 transform transition-transform duration-300 ease-in-out z-50 ${
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
    </div>
  );
} 