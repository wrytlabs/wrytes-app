import React from 'react';
import { useRouter } from 'next/router';
import HomeLayout from './HomeLayout';
import DashboardLayout from './DashboardLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = router.pathname;

  // Check if the path starts with /dashboard
  if (pathname.startsWith('/dashboard')) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // Default to HomeLayout for all other paths
  return <HomeLayout>{children}</HomeLayout>;
} 