import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-dark text-text-primary">
      {/* Dashboard Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-card border-b border-dark-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-accent-orange rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-text-secondary hover:text-accent-orange transition-colors">
                <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
              </button>
              <button className="p-2 text-text-secondary hover:text-accent-orange transition-colors">
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 w-64 h-screen bg-dark-card border-r border-dark-surface">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-accent-orange bg-accent-orange/20 rounded-lg shadow-sm">
                  <FontAwesomeIcon icon={faChartLine} className="w-4 h-4" />
                  Overview
                </a>
              </li>
              <li>
                <a href="/dashboard/projects" className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-accent-orange hover:bg-accent-orange/20 rounded-lg transition-all duration-200 hover:shadow-sm">
                  Projects
                </a>
              </li>
              <li>
                <a href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-accent-orange hover:bg-accent-orange/20 rounded-lg transition-all duration-200 hover:shadow-sm">
                  Analytics
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
} 