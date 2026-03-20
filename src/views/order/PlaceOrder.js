// import React, { useState } from 'react';
// import { Box, Typography, Button, TextField, Paper, Grid, Select, MenuItem, FormControl, InputLabel, InputAdornment, Card, CardContent, IconButton } from '@mui/material';
// import { Search, Add, Remove, ShoppingCart, Delete } from '@mui/icons-material';
// import { useTheme } from '@mui/material/styles';
// import PageContainer from '../../../components/container/PageContainer';

// const PlaceOrder = () => {
//   const theme = useTheme();
//   const { palette } = theme;
  
//   const [customerInfo, setCustomerInfo] = useState({
//     customerNumber: '',
//     accessCode: '',
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//   });

//   const [cartItems, setCartItems] = useState([
//     { id: 1, name: 'LED Strip Light 5m', sku: 'LED-STRIP-001', price: 25.99, quantity: 1, category: 'Lighting' },
//     { id: 2, name: 'Smart Bulb RGB', sku: 'LED-BULB-002', price: 15.99, quantity: 2, category: 'Lighting' },
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');

//   const availableProducts = [
//     { id: 3, name: 'Track Connector', sku: 'TRACK-CONN-003', price: 8.99, category: 'Accessories' },
//     { id: 4, name: 'Power Supply 12V', sku: 'PWR-12V-004', price: 35.99, category: 'Power' },
//     { id: 5, name: 'LED Panel 60x60', sku: 'LED-PANEL-005', price: 89.99, category: 'Lighting' },
//   ];

//   const handleCustomerInputChange = (field) => (event) => {
//     setCustomerInfo({
//       ...customerInfo,
//       [field]: event.target.value
//     });
//   };

//   const updateQuantity = (itemId, change) => {
//     setCartItems(prev => prev.map(item => 
//       item.id === itemId 
//         ? { ...item, quantity: Math.max(1, item.quantity + change) }
//         : item
//     ));
//   };

//   const removeFromCart = (itemId) => {
//     setCartItems(prev => prev.filter(item => item.id !== itemId));
//   };

//   const addToCart = (product) => {
//     const existingItem = cartItems.find(item => item.id === product.id);
//     if (existingItem) {
//       updateQuantity(product.id, 1);
//     } else {
//       setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
//     }
//   };

//   const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const tax = subtotal * 0.08; // 8% tax
//   const total = subtotal + tax;

//   const filteredProducts = availableProducts.filter(product =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.sku.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <PageContainer title="Place Order" description="Create a new customer order">
//       <Box>
//         {/* Header */}
//         <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary, mb: 3 }}>
//           Place New Order
//         </Typography>

//         <Grid container spacing={3}>
//           {/* Customer Information */}
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//               <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
//                 Customer Information
//               </Typography>
              
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Customer Number"
//                     value={customerInfo.customerNumber}
//                     onChange={handleCustomerInputChange('customerNumber')}
//                     required
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Access Code"
//                     type="password"
//                     value={customerInfo.accessCode}
//                     onChange={handleCustomerInputChange('accessCode')}
//                     required
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Customer Name"
//                     value={customerInfo.name}
//                     onChange={handleCustomerInputChange('name')}
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     type="email"
//                     value={customerInfo.email}
//                     onChange={handleCustomerInputChange('email')}
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Phone"
//                     value={customerInfo.phone}
//                     onChange={handleCustomerInputChange('phone')}
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Delivery Address"
//                     multiline
//                     rows={2}
//                     value={customerInfo.address}
//                     onChange={handleCustomerInputChange('address')}
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>
//           </Grid>

//           {/* Product Search and Cart */}
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//               <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
//                 Order Cart
//               </Typography>
              
//               {/* Cart Items */}
//               <Box sx={{ mb: 3, maxHeight: 300, overflowY: 'auto' }}>
//                 {cartItems.map((item) => (
//                   <Card key={item.id} sx={{ mb: 2, backgroundColor: palette.grey[50] }}>
//                     <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Box sx={{ flex: 1 }}>
//                           <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                             {item.name}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             SKU: {item.sku} | {item.category}
//                           </Typography>
//                           <Typography variant="body2" sx={{ fontWeight: 600, color: palette.primary.main }}>
//                             ${item.price.toFixed(2)}
//                           </Typography>
//                         </Box>
                        
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <IconButton
//                             size="small"
//                             onClick={() => updateQuantity(item.id, -1)}
//                             sx={{ color: palette.error.main }}
//                           >
//                             <Remove fontSize="small" />
//                           </IconButton>
//                           <Typography variant="body1" sx={{ minWidth: '30px', textAlign: 'center', fontWeight: 600 }}>
//                             {item.quantity}
//                           </Typography>
//                           <IconButton
//                             size="small"
//                             onClick={() => updateQuantity(item.id, 1)}
//                             sx={{ color: palette.success.main }}
//                           >
//                             <Add fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             onClick={() => removeFromCart(item.id)}
//                             sx={{ color: palette.error.main }}
//                           >
//                             <Delete fontSize="small" />
//                           </IconButton>
//                         </Box>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 ))}
                
//                 {cartItems.length === 0 && (
//                   <Box sx={{ textAlign: 'center', py: 3 }}>
//                     <ShoppingCart sx={{ fontSize: 48, color: palette.text.secondary, mb: 1 }} />
//                     <Typography variant="body2" color="text.secondary">
//                       Your cart is empty
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>

//               {/* Order Summary */}
//               <Box sx={{ borderTop: `1px solid ${palette.divider}`, pt: 2 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Subtotal:</Typography>
//                   <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Tax (8%):</Typography>
//                   <Typography variant="body2">${tax.toFixed(2)}</Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//                   <Typography variant="h6" sx={{ fontWeight: 600 }}>Total:</Typography>
//                   <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primary.main }}>
//                     ${total.toFixed(2)}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Paper>
//           </Grid>

//           {/* Product Catalog */}
//           <Grid item xs={12}>
//             <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//               <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
//                 Available Products
//               </Typography>
              
//               {/* Search Bar */}
//               <TextField
//                 fullWidth
//                 placeholder="Search products by name or SKU..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search sx={{ color: palette.text.secondary }} />
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//               />
              
//               {/* Product Grid */}
//               <Grid container spacing={2}>
//                 {filteredProducts.map((product) => (
//                   <Grid item xs={12} sm={6} md={4} key={product.id}>
//                     <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
//                       <CardContent sx={{ p: 2 }}>
//                         <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
//                           {product.name}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
//                           SKU: {product.sku}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
//                           Category: {product.category}
//                         </Typography>
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                           <Typography variant="h6" sx={{ fontWeight: 600, color: palette.primary.main }}>
//                             ${product.price.toFixed(2)}
//                           </Typography>
//                           <Button
//                             variant="contained"
//                             size="small"
//                             startIcon={<Add />}
//                             onClick={() => addToCart(product)}
//                             sx={{ borderRadius: '6px' }}
//                           >
//                             Add
//                           </Button>
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Paper>
//           </Grid>

//           {/* Submit Order */}
//           <Grid item xs={12}>
//             <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//               <Button
//                 variant="outlined"
//                 size="large"
//                 sx={{ borderRadius: '8px' }}
//               >
//                 Clear Cart
//               </Button>
//               <Button
//                 variant="contained"
//                 size="large"
//                 sx={{ borderRadius: '8px' }}
//               >
//                 Place Order
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </PageContainer>
//   );
// };

// export default PlaceOrder;
