import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import { RoleBadge } from '@/components/auth/RequireRole';
import { PageHeader } from '@/components/ui/Layout';
import { DashboardStats, RecentActivity } from '@/components/features/Dashboard';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Dashboard - Wrytes</title>
        <meta name="description" content="Dashboard overview" />
      </Head>
      
      <div className="space-y-6">
        <PageHeader
          title="Dashboard Overview"
          description={`Welcome back${user && user.walletAddress ? `, ${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : ''}! Here's what's happening with your projects.`}
          userInfo={user && <RoleBadge />}
        />
        
        <DashboardStats />
        
        <RecentActivity />
      </div>
    </>
  );
} 