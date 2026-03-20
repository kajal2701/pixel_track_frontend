// import React, { useState } from 'react';
// import { Box, Typography, Button, Paper, Grid, Select, MenuItem, FormControl, InputLabel, DatePicker } from '@mui/material';
// import { Search, Download, FileDownload, Assessment, TrendingUp, TrendingDown, Refresh } from '@mui/icons-material';
// import { useTheme } from '@mui/material/styles';
// import PageContainer from '../../../components/container/PageContainer';

// const Reports = () => {
//   const theme = useTheme();
//   const { palette } = theme;
  
//   const [reportType, setReportType] = useState('sales');
//   const [dateRange, setDateRange] = useState('this-month');

//   // Sample data for reports
//   const reportStats = {
//     sales: {
//       title: 'Sales Report',
//       totalRevenue: 45678.50,
//       totalOrders: 234,
//       averageOrderValue: 195.20,
//       growth: 12.5,
//       topProduct: 'LED Strip Light 5m',
//       topCustomer: 'Bob Johnson'
//     },
//     inventory: {
//       title: 'Inventory Report',
//       totalItems: 1250,
//       lowStockItems: 12,
//       outOfStockItems: 3,
//       totalValue: 89500.00,
//       turnoverRate: 4.2,
//       topCategory: 'Lighting'
//     },
//     production: {
//       title: 'Production Report',
//       activeOrders: 8,
//       completedOrders: 156,
//       averageCompletionTime: 5.2,
//       efficiency: 87.5,
//       topProduct: 'Smart Bulb RGB',
//       totalProduced: 12500
//     },
//     customers: {
//       title: 'Customer Report',
//       totalCustomers: 892,
//       newCustomers: 45,
//       activeCustomers: 756,
//       churnRate: 2.3,
//       topCustomer: 'Bob Johnson',
//       averageLifetimeValue: 1250.75
//     }
//   };

//   const currentReport = reportStats[reportType];

//   const getGrowthColor = (growth) => {
//     return growth >= 0 ? palette.success.main : palette.error.main;
//   };

//   const getGrowthIcon = (growth) => {
//     return growth >= 0 ? <TrendingUp /> : <TrendingDown />;
//   };

//   return (
//     <PageContainer title="Reports & Analytics" description="Generate and view business reports">
//       <Box>
//         {/* Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
//             Reports
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button
//               variant="outlined"
//               startIcon={<Refresh />}
//               sx={{ borderRadius: '8px' }}
//             >
//               Refresh
//             </Button>
//             <Button
//               variant="contained"
//               startIcon={<FileDownload />}
//               sx={{ borderRadius: '8px' }}
//             >
//               Export Report
//             </Button>
//           </Box>
//         </Box>

//         {/* Report Controls */}
//         <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
//           <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} md={4}>
//               <FormControl fullWidth>
//                 <InputLabel>Report Type</InputLabel>
//                 <Select
//                   value={reportType}
//                   onChange={(e) => setReportType(e.target.value)}
//                   label="Report Type"
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                 >
//                   <MenuItem value="sales">Sales Report</MenuItem>
//                   <MenuItem value="inventory">Inventory Report</MenuItem>
//                   <MenuItem value="production">Production Report</MenuItem>
//                   <MenuItem value="customers">Customer Report</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
            
//             <Grid item xs={12} md={4}>
//               <FormControl fullWidth>
//                 <InputLabel>Date Range</InputLabel>
//                 <Select
//                   value={dateRange}
//                   onChange={(e) => setDateRange(e.target.value)}
//                   label="Date Range"
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                 >
//                   <MenuItem value="today">Today</MenuItem>
//                   <MenuItem value="this-week">This Week</MenuItem>
//                   <MenuItem value="this-month">This Month</MenuItem>
//                   <MenuItem value="last-month">Last Month</MenuItem>
//                   <MenuItem value="this-quarter">This Quarter</MenuItem>
//                   <MenuItem value="this-year">This Year</MenuItem>
//                   <MenuItem value="custom">Custom Range</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
            
//             <Grid item xs={12} md={4}>
//               <DatePicker
//                 label="Custom Date Range"
//                 value={null}
//                 onChange={() => {}}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     fullWidth
//                     disabled={dateRange !== 'custom'}
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                   />
//                 )}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Report Title */}
//         <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: palette.primary.main }}>
//           {currentReport.title}
//         </Typography>

//         {/* Key Metrics */}
//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           {/* Dynamic metrics based on report type */}
//           {reportType === 'sales' && (
//             <>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.primary.main }}>
//                     ${currentReport.totalRevenue.toFixed(2)}
//                   </Typography>
//                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
//                     {getGrowthIcon(currentReport.growth)}
//                     <Typography variant="body2" sx={{ color: getGrowthColor(currentReport.growth) }}>
//                       {currentReport.growth}%
//                     </Typography>
//                   </Box>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Total Orders</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.info.main }}>
//                     {currentReport.totalOrders}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Avg Order Value</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.success.main }}>
//                     ${currentReport.averageOrderValue.toFixed(2)}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Top Product</Typography>
//                   <Typography variant="h6" sx={{ fontWeight: 600, color: palette.warning.main }}>
//                     {currentReport.topProduct}
//                   </Typography>
//                 </Paper>
//               </Grid>
//             </>
//           )}

//           {reportType === 'inventory' && (
//             <>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Total Items</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.primary.main }}>
//                     {currentReport.totalItems}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Low Stock</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.warning.main }}>
//                     {currentReport.lowStockItems}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Out of Stock</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.error.main }}>
//                     {currentReport.outOfStockItems}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Total Value</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.success.main }}>
//                     ${currentReport.totalValue.toFixed(0)}
//                   </Typography>
//                 </Paper>
//               </Grid>
//             </>
//           )}

//           {reportType === 'production' && (
//             <>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Active Orders</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.info.main }}>
//                     {currentReport.activeOrders}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Completed</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.success.main }}>
//                     {currentReport.completedOrders}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Avg Time (days)</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.warning.main }}>
//                     {currentReport.averageCompletionTime}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Efficiency</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.primary.main }}>
//                     {currentReport.efficiency}%
//                   </Typography>
//                 </Paper>
//               </Grid>
//             </>
//           )}

//           {reportType === 'customers' && (
//             <>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Total Customers</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.primary.main }}>
//                     {currentReport.totalCustomers}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">New Customers</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.success.main }}>
//                     {currentReport.newCustomers}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Active Customers</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.info.main }}>
//                     {currentReport.activeCustomers}
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Paper sx={{ p: 2, borderRadius: '12px', textAlign: 'center' }}>
//                   <Typography variant="h6" color="text.secondary">Avg Lifetime Value</Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: palette.warning.main }}>
//                     ${currentReport.averageLifetimeValue.toFixed(0)}
//                   </Typography>
//                 </Paper>
//               </Grid>
//             </>
//           )}
//         </Grid>

//         {/* Charts Section */}
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={8}>
//             <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//               <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
//                 {currentReport.title} Chart
//               </Typography>
//               <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: palette.grey[50], borderRadius: '8px' }}>
//                 <Typography variant="body1" color="text.secondary">
//                   Chart visualization would appear here
//                 </Typography>
//               </Box>
//             </Paper>
//           </Grid>
          
//           <Grid item xs={12} md={4}>
//             <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//               <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
//                 Quick Actions
//               </Typography>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                 <Button
//                   variant="outlined"
//                   startIcon={<Download />}
//                   fullWidth
//                   sx={{ borderRadius: '8px', justifyContent: 'flex-start' }}
//                 >
//                   Download PDF
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   startIcon={<FileDownload />}
//                   fullWidth
//                   sx={{ borderRadius: '8px', justifyContent: 'flex-start' }}
//                 >
//                   Export to Excel
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   startIcon={<Assessment />}
//                   fullWidth
//                   sx={{ borderRadius: '8px', justifyContent: 'flex-start' }}
//                 >
//                   Generate Summary
//                 </Button>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     </PageContainer>
//   );
// };

// export default Reports;
