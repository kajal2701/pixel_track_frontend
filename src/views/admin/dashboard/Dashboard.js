import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  ShoppingCart, 
  People, 
  Inventory, 
  TrendingUp, 
  AttachMoney,
  LocalShipping,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';

const Dashboard = () => {
  const theme = useTheme();
  const { palette } = theme;

  // Sample data for dashboard
  const stats = {
    totalOrders: 1247,
    totalCustomers: 892,
    totalRevenue: 45678.50,
    lowStockItems: 12,
    pendingOrders: 23,
    completedOrders: 1224,
    processingOrders: 45,
    outOfStockItems: 3
  };

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: 1250.00, status: 'completed' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 890.00, status: 'processing' },
    { id: 'ORD-003', customer: 'Bob Johnson', amount: 2100.00, status: 'pending' },
    { id: 'ORD-004', customer: 'Alice Brown', amount: 450.00, status: 'completed' },
  ];

  const topProducts = [
    { name: 'LED Strip Light 5m', sales: 156, stock: 234 },
    { name: 'Smart Bulb RGB', sales: 89, stock: 145 },
    { name: 'Track Connector', sales: 67, stock: 89 },
    { name: 'Power Supply 12V', sales: 45, stock: 12 },
  ];

  const BCrumb = [
    { to: '/admin/dashboard', title: 'Home' },
    { title: 'Dashboard' },
  ];

  return (
    <PageContainer title="Admin Dashboard" description="Overview of your business metrics">
      <Breadcrumb title="Dashboard" items={BCrumb} />
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: palette.primary.main, color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <ShoppingCart sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.totalOrders}
              </Typography>
              <Typography variant="body2">
                Total Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: palette.success.main, color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <People sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.totalCustomers}
              </Typography>
              <Typography variant="body2">
                Total Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: palette.warning.main, color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <AttachMoney sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                ${stats.totalRevenue.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: palette.info.main, color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Inventory sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.lowStockItems + stats.outOfStockItems}
              </Typography>
              <Typography variant="body2">
                Low Stock Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Status Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <ParentCard title="Order Status Overview">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <CheckCircle sx={{ fontSize: 36, color: palette.success.main, mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: palette.success.main }}>
                    {stats.completedOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Orders
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <LocalShipping sx={{ fontSize: 36, color: palette.info.main, mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: palette.info.main }}>
                    {stats.processingOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Processing Orders
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Warning sx={{ fontSize: 36, color: palette.warning.main, mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: palette.warning.main }}>
                    {stats.pendingOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Orders
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </ParentCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <ParentCard title="Quick Actions">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                href="/admin/orders"
                sx={{ borderRadius: '8px', py: 1.5 }}
              >
                View Orders
              </Button>
              <Button
                variant="outlined"
                startIcon={<Inventory />}
                href="/admin/inventory"
                sx={{ borderRadius: '8px', py: 1.5 }}
              >
                Manage Inventory
              </Button>
              <Button
                variant="outlined"
                startIcon={<People />}
                href="/admin/customers"
                sx={{ borderRadius: '8px', py: 1.5 }}
              >
                View Customers
              </Button>
              <Button
                variant="outlined"
                startIcon={<TrendingUp />}
                href="/admin/reports"
                sx={{ borderRadius: '8px', py: 1.5 }}
              >
                View Reports
              </Button>
            </Box>
          </ParentCard>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ParentCard title="Recent Orders">
            <Box>
              {recentOrders.map((order, index) => (
                <Box
                  key={order.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: index < recentOrders.length - 1 ? `1px solid ${palette.divider}` : 'none'
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customer}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ${order.amount.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: order.status === 'completed' ? palette.success.main :
                               order.status === 'processing' ? palette.info.main :
                               palette.warning.main,
                        fontWeight: 500
                      }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </ParentCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <ParentCard title="Top Products">
            <Box>
              {topProducts.map((product, index) => (
                <Box
                  key={product.name}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: index < topProducts.length - 1 ? `1px solid ${palette.divider}` : 'none'
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.stock} in stock
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primary.main }}>
                      {product.sales}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      sold
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;
