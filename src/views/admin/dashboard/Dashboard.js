import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';

import orderService from '../../../services/orderService';
import { formatDate } from '../../../utils/helpers';

import DashboardStats from './DashboardStats';
import DashboardOrders from './DashboardOrders';

const BCrumb = [
  { to: '/admin/dashboard', title: 'Home' },
  { title: 'Dashboard' },
];

const Dashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders();
      const formatted = res.data.map((o) => ({
        ...o,
        formatted_created_at: formatDate(o.created_at),
        formatted_pickup_date: o.pickup_date ? formatDate(o.pickup_date) : '—',
        final_length: `${o.final_length} ft`,
      }));
      setAllOrders(formatted);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const stats = {
    totalOrders: allOrders.length,
    pendingOrders: allOrders.filter(o => o.order_status === 'Pending').length,
    completedOrders: allOrders.filter(o => o.order_status === 'Completed').length,
    processingOrders: allOrders.filter(o => !['Pending', 'Completed', 'Cancelled'].includes(o.order_status)).length,
    totalCustomers: 892,
    totalRevenue: 45678.50,
    lowStockItems: 12,
    outOfStockItems: 3
  };

  return (
    <PageContainer title="Admin Dashboard" description="Overview of your business metrics">
      <Breadcrumb title="Dashboard" items={BCrumb} />
      
      <DashboardStats stats={stats} />
      
      <DashboardOrders 
        allOrders={allOrders} 
        loading={loading} 
        fetchOrders={fetchOrders} 
      />
      
    </PageContainer>
  );
};

export default Dashboard;
