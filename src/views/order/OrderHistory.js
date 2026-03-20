// import React, { useState } from 'react';
// import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, TextField, InputAdornment, Card, CardContent } from '@mui/material';
// import { Search, Visibility, Download, Refresh, FilterList } from '@mui/icons-material';
// import { useTheme } from '@mui/material/styles';
// import PageContainer from '../../../components/container/PageContainer';

// const OrderHistory = () => {
//   const theme = useTheme();
//   const { palette } = theme;
//   const [searchTerm, setSearchTerm] = useState('');

//   // Sample data
//   const orders = [
//     { 
//       id: 'ORD-001', 
//       date: '2024-01-15', 
//       status: 'delivered',
//       items: 5,
//       total: 1250.00,
//       paymentMethod: 'Credit Card',
//       trackingNumber: 'TRK123456789',
//       deliveryDate: '2024-01-18'
//     },
//     { 
//       id: 'ORD-002', 
//       date: '2024-01-10', 
//       status: 'processing',
//       items: 3,
//       total: 890.00,
//       paymentMethod: 'Bank Transfer',
//       trackingNumber: 'TRK987654321',
//       deliveryDate: 'Estimated 2024-01-22'
//     },
//     { 
//       id: 'ORD-003', 
//       date: '2024-01-05', 
//       status: 'shipped',
//       items: 8,
//       total: 2100.00,
//       paymentMethod: 'PayPal',
//       trackingNumber: 'TRK456789123',
//       deliveryDate: 'Expected 2024-01-20'
//     },
//     { 
//       id: 'ORD-004', 
//       date: '2023-12-28', 
//       status: 'delivered',
//       items: 2,
//       total: 450.00,
//       paymentMethod: 'Credit Card',
//       trackingNumber: 'TRK789123456',
//       deliveryDate: '2024-01-02'
//     },
//     { 
//       id: 'ORD-005', 
//       date: '2023-12-15', 
//       status: 'cancelled',
//       items: 4,
//       total: 680.00,
//       paymentMethod: 'Credit Card',
//       trackingNumber: 'N/A',
//       deliveryDate: 'N/A'
//     },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'delivered': return 'success';
//       case 'processing': return 'info';
//       case 'shipped': return 'warning';
//       case 'pending': return 'default';
//       case 'cancelled': return 'error';
//       default: return 'default';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'delivered': return '✓';
//       case 'processing': return '⚙';
//       case 'shipped': return '📦';
//       case 'pending': return '⏰';
//       case 'cancelled': return '✗';
//       default: return '';
//     }
//   };

//   const filteredOrders = orders.filter(order =>
//     order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalOrders = filteredOrders.length;
//   const deliveredOrders = filteredOrders.filter(order => order.status === 'delivered').length;
//   const processingOrders = filteredOrders.filter(order => order.status === 'processing').length;
//   const totalSpent = filteredOrders.reduce((sum, order) => sum + order.total, 0);

//   return (
//     <PageContainer title="Order History" description="View your order history and tracking information">
//       <Box>
//         {/* Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
//             Order History
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button
//               variant="outlined"
//               startIcon={<FilterList />}
//               sx={{ borderRadius: '8px' }}
//             >
//               Filter
//             </Button>
//             <Button
//               variant="outlined"
//               startIcon={<Refresh />}
//               sx={{ borderRadius: '8px' }}
//             >
//               Refresh
//             </Button>
//             <Button
//               variant="contained"
//               href="/order/new"
//               sx={{ borderRadius: '8px' }}
//             >
//               New Order
//             </Button>
//           </Box>
//         </Box>

//         {/* Summary Cards */}
//         <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//           <Card sx={{ flex: 1, backgroundColor: palette.primary.light }}>
//             <CardContent sx={{ textAlign: 'center', py: 2 }}>
//               <Typography variant="h6" color="primary.dark">Total Orders</Typography>
//               <Typography variant="h4" sx={{ fontWeight: 700, color: palette.primary.dark }}>
//                 {totalOrders}
//               </Typography>
//             </CardContent>
//           </Card>
//           <Card sx={{ flex: 1, backgroundColor: palette.success.light }}>
//             <CardContent sx={{ textAlign: 'center', py: 2 }}>
//               <Typography variant="h6" color="success.dark">Delivered</Typography>
//               <Typography variant="h4" sx={{ fontWeight: 700, color: palette.success.dark }}>
//                 {deliveredOrders}
//               </Typography>
//             </CardContent>
//           </Card>
//           <Card sx={{ flex: 1, backgroundColor: palette.info.light }}>
//             <CardContent sx={{ textAlign: 'center', py: 2 }}>
//               <Typography variant="h6" color="info.dark">Processing</Typography>
//               <Typography variant="h4" sx={{ fontWeight: 700, color: info.dark }}>
//                 {processingOrders}
//               </Typography>
//             </CardContent>
//           </Card>
//           <Card sx={{ flex: 1, backgroundColor: palette.warning.light }}>
//             <CardContent sx={{ textAlign: 'center', py: 2 }}>
//               <Typography variant="h6" color="warning.dark">Total Spent</Typography>
//               <Typography variant="h4" sx={{ fontWeight: 700, color: palette.warning.dark }}>
//                 ${totalSpent.toFixed(2)}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Box>

//         {/* Search Bar */}
//         <Box sx={{ mb: 3 }}>
//           <TextField
//             fullWidth
//             placeholder="Search orders by order ID or tracking number..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search sx={{ color: palette.text.secondary }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '12px',
//                 backgroundColor: palette.background.paper,
//               }
//             }}
//           />
//         </Box>

//         {/* Orders Table */}
//         <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: palette.grey[50] }}>
//                 <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Order ID</TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Date</TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Items</TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Total</TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Payment</TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Tracking</TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Delivery</TableCell>
//                 <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredOrders.map((order) => (
//                 <TableRow key={order.id} hover>
//                   <TableCell sx={{ fontWeight: 500 }}>{order.id}</TableCell>
//                   <TableCell>{order.date}</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>{order.items}</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>${order.total.toFixed(2)}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={order.paymentMethod}
//                       size="small"
//                       variant="outlined"
//                       sx={{ fontSize: '0.75rem' }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <Typography variant="body2">{getStatusIcon(order.status)}</Typography>
//                       <Chip
//                         label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                         color={getStatusColor(order.status)}
//                         size="small"
//                         sx={{ fontWeight: 500 }}
//                       />
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
//                       {order.trackingNumber}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
//                       {order.deliveryDate}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton size="small" sx={{ color: palette.info.main }}>
//                         <Visibility fontSize="small" />
//                       </IconButton>
//                       <IconButton size="small" sx={{ color: palette.primary.main }}>
//                         <Download fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Empty State */}
//         {filteredOrders.length === 0 && (
//           <Box sx={{ textAlign: 'center', py: 8 }}>
//             <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
//               No orders found
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//               You haven't placed any orders yet, or no orders match your search.
//             </Typography>
//             <Button
//               variant="contained"
//               href="/order/new"
//               sx={{ borderRadius: '8px' }}
//             >
//               Place Your First Order
//             </Button>
//           </Box>
//         )}
//       </Box>
//     </PageContainer>
//   );
// };

// export default OrderHistory;
