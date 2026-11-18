import React, { useState } from 'react';

import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';

import DashboardStats from './DashboardStats';
import DashboardOrders from './DashboardOrders';

const BCrumb = [
  { to: '/admin/dashboard', title: 'Home' },
  { title: 'Dashboard' },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    processingOrders: 0,
    totalCustomers: 892,
    totalRevenue: 45678.50,
    lowStockItems: 12,
    outOfStockItems: 3,
  });

  return (
    <PageContainer title="Admin Dashboard" description="Overview of your business metrics">
      <Breadcrumb title="Dashboard" items={BCrumb} />

      <DashboardStats stats={stats} />

      <DashboardOrders onStatsUpdate={setStats} />
    </PageContainer>
  );
};

export default Dashboard;
