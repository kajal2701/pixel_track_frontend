import React, { useState } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Stack, Grid, Card, CardContent } from '@mui/material';
import { Download, Assessment, TrendingUp, TrendingDown, Refresh, FileDownload, BarChart, PieChart, Timeline } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import ChildCard from '../../../components/shared/ChildCard';
import DataTable from '../../../components/shared/DataTable';

const Reports = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('this-month');

  // Sample data for reports
  const reportStats = {
    sales: {
      title: 'Sales Report',
      totalRevenue: 45678.50,
      totalOrders: 234,
      averageOrderValue: 195.20,
      growth: 12.5,
      topProduct: 'White Full Roll',
      topCustomer: 'ABC Construction',
      monthlyData: [
        { month: 'Jan', revenue: 12000, orders: 45 },
        { month: 'Feb', revenue: 15000, orders: 58 },
        { month: 'Mar', revenue: 18678.50, orders: 131 }
      ]
    },
    inventory: {
      title: 'Inventory Report',
      totalItems: 1250,
      lowStockItems: 12,
      outOfStockItems: 3,
      totalValue: 89500.00,
      turnoverRate: 4.2,
      topCategory: 'Full Roll',
      inventoryData: [
        { type: 'Full Roll', quantity: 450, value: 45000 },
        { type: 'Slitted', quantity: 680, value: 34000 },
        { type: 'Ready Channel', quantity: 120, value: 10500 }
      ]
    },
    production: {
      title: 'Production Report',
      activeOrders: 8,
      completedOrders: 156,
      averageCompletionTime: 5.2,
      efficiency: 87.5,
      topProduct: 'White Full Roll',
      totalProduced: 12500,
      productionData: [
        { product: 'White Full Roll', quantity: 4500, status: 'Completed' },
        { product: 'Black Full Roll', quantity: 3200, status: 'Completed' },
        { product: 'Red Full Roll', quantity: 2800, status: 'In Progress' },
        { product: 'Blue Full Roll', quantity: 2000, status: 'Pending' }
      ]
    },
    customers: {
      title: 'Customer Report',
      totalCustomers: 892,
      newCustomers: 45,
      activeCustomers: 756,
      churnRate: 2.3,
      topCustomer: 'ABC Construction',
      averageLifetimeValue: 1250.75,
      customerData: [
        { name: 'ABC Construction', orders: 15, revenue: 12500, status: 'Active' },
        { name: 'XYZ Interiors', orders: 12, revenue: 8900, status: 'Active' },
        { name: 'Home Renovations Ltd', orders: 8, revenue: 6700, status: 'VIP' },
        { name: 'Commercial Spaces Inc', orders: 6, revenue: 4500, status: 'Inactive' }
      ]
    }
  };

  const currentReport = reportStats[reportType];

  const getGrowthColor = (growth) => {
    return growth >= 0 ? palette.success.main : palette.error.main;
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  // DataTable columns for detailed reports
  const getReportColumns = () => {
    switch (reportType) {
      case 'sales':
        return [
          { field: 'month', label: 'Month', bold: true, width: '25%' },
          { field: 'revenue', label: 'Revenue', type: 'text', prefix: '$', bold: true, width: '35%' },
          { field: 'orders', label: 'Orders', width: '20%' },
          { field: 'avgOrder', label: 'Avg Order', type: 'text', prefix: '$', width: '20%' }
        ];
      case 'inventory':
        return [
          { field: 'type', label: 'Inventory Type', bold: true, width: '30%' },
          { field: 'quantity', label: 'Quantity', width: '25%' },
          { field: 'value', label: 'Value', type: 'text', prefix: '$', bold: true, width: '25%' },
          { field: 'status', label: 'Status', type: 'chip', chipColor: () => 'primary', width: '20%' }
        ];
      case 'production':
        return [
          { field: 'product', label: 'Product', bold: true, width: '35%' },
          { field: 'quantity', label: 'Quantity (feet)', width: '25%' },
          { field: 'status', label: 'Status', type: 'chip', chipColor: (status) => {
            switch (status) {
              case 'Completed': return 'success';
              case 'In Progress': return 'warning';
              case 'Pending': return 'info';
              default: return 'default';
            }
          }, width: '20%' },
          { field: 'progress', label: 'Progress', width: '20%' }
        ];
      case 'customers':
        return [
          { field: 'name', label: 'Customer Name', bold: true, width: '35%' },
          { field: 'orders', label: 'Total Orders', width: '20%' },
          { field: 'revenue', label: 'Total Revenue', type: 'text', prefix: '$', bold: true, width: '25%' },
          { field: 'status', label: 'Status', type: 'chip', chipColor: (status) => {
            switch (status) {
              case 'VIP': return 'warning';
              case 'Active': return 'success';
              case 'Inactive': return 'error';
              default: return 'default';
            }
          }, width: '20%' }
        ];
      default:
        return [];
    }
  };

  // Format rows for DataTable
  const getReportRows = () => {
    switch (reportType) {
      case 'sales':
        return currentReport.monthlyData.map(item => ({
          ...item,
          avgOrder: (item.revenue / item.orders).toFixed(2)
        }));
      case 'inventory':
        return currentReport.inventoryData.map(item => ({
          ...item,
          status: item.quantity > 100 ? 'In Stock' : item.quantity > 0 ? 'Low Stock' : 'Out of Stock'
        }));
      case 'production':
        return currentReport.productionData.map(item => ({
          ...item,
          progress: `${Math.floor(Math.random() * 100)}%`
        }));
      case 'customers':
        return currentReport.customerData;
      default:
        return [];
    }
  };

  return (
    <PageContainer title="Reports & Analytics" description="Generate and view business reports">
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>Reports & Analytics</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button variant="outlined" startIcon={<Refresh />} sx={{ borderRadius: '8px' }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<FileDownload />} sx={{ borderRadius: '8px' }}>
            Export Report
          </Button>
        </Stack>
      </Stack>

      {/* Report Controls */}
      <ParentCard title="Report Configuration">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              <MenuItem value="sales">Sales Report</MenuItem>
              <MenuItem value="inventory">Inventory Report</MenuItem>
              <MenuItem value="production">Production Report</MenuItem>
              <MenuItem value="customers">Customer Report</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="Date Range"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="this-week">This Week</MenuItem>
              <MenuItem value="this-month">This Month</MenuItem>
              <MenuItem value="last-month">Last Month</MenuItem>
              <MenuItem value="this-quarter">This Quarter</MenuItem>
              <MenuItem value="this-year">This Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </ParentCard>

      {/* Report Title */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: palette.primary.main }}>
        {currentReport.title}
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Sales Metrics */}
        {reportType === 'sales' && (
          <>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Total Revenue">
                <Typography variant="h4" fontWeight="600" color="primary.main">
                  ${currentReport.totalRevenue.toFixed(2)}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="center" gap={1} mt={1}>
                  {getGrowthIcon(currentReport.growth)}
                  <Typography variant="body2" sx={{ color: getGrowthColor(currentReport.growth) }}>
                    {currentReport.growth}%
                  </Typography>
                </Stack>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Total Orders">
                <Typography variant="h4" fontWeight="600" color="info.main">
                  {currentReport.totalOrders}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Avg Order Value">
                <Typography variant="h4" fontWeight="600" color="success.main">
                  ${currentReport.averageOrderValue.toFixed(2)}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Top Product">
                <Typography variant="h6" fontWeight="600" color="warning.main">
                  {currentReport.topProduct}
                </Typography>
              </ChildCard>
            </Grid>
          </>
        )}

        {/* Inventory Metrics */}
        {reportType === 'inventory' && (
          <>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Total Items">
                <Typography variant="h4" fontWeight="600" color="primary.main">
                  {currentReport.totalItems}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Low Stock">
                <Typography variant="h4" fontWeight="600" color="warning.main">
                  {currentReport.lowStockItems}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Out of Stock">
                <Typography variant="h4" fontWeight="600" color="error.main">
                  {currentReport.outOfStockItems}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Total Value">
                <Typography variant="h4" fontWeight="600" color="success.main">
                  ${currentReport.totalValue.toFixed(0)}
                </Typography>
              </ChildCard>
            </Grid>
          </>
        )}

        {/* Production Metrics */}
        {reportType === 'production' && (
          <>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Active Orders">
                <Typography variant="h4" fontWeight="600" color="info.main">
                  {currentReport.activeOrders}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Completed">
                <Typography variant="h4" fontWeight="600" color="success.main">
                  {currentReport.completedOrders}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Avg Time (days)">
                <Typography variant="h4" fontWeight="600" color="warning.main">
                  {currentReport.averageCompletionTime}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Efficiency">
                <Typography variant="h4" fontWeight="600" color="primary.main">
                  {currentReport.efficiency}%
                </Typography>
              </ChildCard>
            </Grid>
          </>
        )}

        {/* Customer Metrics */}
        {reportType === 'customers' && (
          <>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Total Customers">
                <Typography variant="h4" fontWeight="600" color="primary.main">
                  {currentReport.totalCustomers}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="New Customers">
                <Typography variant="h4" fontWeight="600" color="success.main">
                  {currentReport.newCustomers}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Active Customers">
                <Typography variant="h4" fontWeight="600" color="info.main">
                  {currentReport.activeCustomers}
                </Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ChildCard title="Avg Lifetime Value">
                <Typography variant="h4" fontWeight="600" color="warning.main">
                  ${currentReport.averageLifetimeValue.toFixed(0)}
                </Typography>
              </ChildCard>
            </Grid>
          </>
        )}
      </Grid>

      {/* Detailed Data Table */}
      <ParentCard title={`${currentReport.title} - Detailed Data`}>
        <DataTable 
          rows={getReportRows()} 
          columns={getReportColumns()} 
          defaultRows={10} 
        />
      </ParentCard>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <ParentCard title="Quick Actions">
            <Stack spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                fullWidth
                sx={{ borderRadius: '8px', justifyContent: 'flex-start' }}
              >
                Download PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                fullWidth
                sx={{ borderRadius: '8px', justifyContent: 'flex-start' }}
              >
                Export to Excel
              </Button>
              <Button
                variant="outlined"
                startIcon={<Assessment />}
                fullWidth
                sx={{ borderRadius: '8px', justifyContent: 'flex-start' }}
              >
                Generate Summary
              </Button>
            </Stack>
          </ParentCard>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <ParentCard title="Report Insights">
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" fontWeight={600} color="primary.main">
                  Key Insights
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {reportType === 'sales' && `Sales have grown by ${currentReport.growth}% this period with ${currentReport.topProduct} being the top-selling product.`}
                  {reportType === 'inventory' && `Current inventory value is $${currentReport.totalValue.toFixed(0)} with ${currentReport.lowStockItems} items needing restock.`}
                  {reportType === 'production' && `Production efficiency is at ${currentReport.efficiency}% with an average completion time of ${currentReport.averageCompletionTime} days.`}
                  {reportType === 'customers' && `Customer base has grown by ${currentReport.newCustomers} new customers with an average lifetime value of $${currentReport.averageLifetimeValue.toFixed(0)}.`}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" fontWeight={600} color="primary.main">
                  Recommendations
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {reportType === 'sales' && 'Focus on promoting top-performing products and consider upselling strategies.'}
                  {reportType === 'inventory' && 'Reorder low stock items immediately and consider optimizing inventory levels.'}
                  {reportType === 'production' && 'Maintain current efficiency levels and consider workflow optimizations.'}
                  {reportType === 'customers' && 'Implement retention strategies for active customers and re-engage inactive ones.'}
                </Typography>
              </Box>
            </Stack>
          </ParentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Reports;