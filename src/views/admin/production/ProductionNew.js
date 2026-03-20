// import React, { useState } from 'react';
// import { Box, Typography, Button, TextField, Paper, Grid, Select, MenuItem, FormControl, InputLabel, InputAdornment, DatePicker } from '@mui/material';
// import { Save, Cancel, ArrowBack } from '@mui/icons-material';
// import { useTheme } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import PageContainer from '../../../components/container/PageContainer';

// const ProductionNew = () => {
//   const theme = useTheme();
//   const { palette } = theme;
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     productId: '',
//     productName: '',
//     quantity: '',
//     startDate: null,
//     endDate: null,
//     priority: 'medium',
//     status: 'pending',
//     assignedTo: '',
//     notes: '',
//     materials: '',
//     estimatedHours: '',
//     actualHours: '',
//   });

//   const handleInputChange = (field) => (event) => {
//     setFormData({
//       ...formData,
//       [field]: event.target.value
//     });
//   };

//   const handleDateChange = (field) => (date) => {
//     setFormData({
//       ...formData,
//       [field]: date
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('New production order:', formData);
//     // Handle form submission here
//     navigate('/admin/production');
//   };

//   return (
//     <PageContainer title="Create New Production Order" description="Create a new production order">
//       <Box>
//         {/* Header */}
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//           <Button
//             variant="outlined"
//             startIcon={<ArrowBack />}
//             onClick={() => navigate('/admin/production')}
//             sx={{ mr: 2, borderRadius: '8px' }}
//           >
//             Back to Production
//           </Button>
//           <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
//             New Production Order
//           </Typography>
//         </Box>

//         {/* Form */}
//         <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               {/* Basic Information */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
//                   Production Details
//                 </Typography>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Product</InputLabel>
//                   <Select
//                     value={formData.productId}
//                     onChange={handleInputChange('productId')}
//                     label="Product"
//                     required
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                   >
//                     <MenuItem value="led-strip-5m">LED Strip Light 5m</MenuItem>
//                     <MenuItem value="smart-bulb-rgb">Smart Bulb RGB</MenuItem>
//                     <MenuItem value="track-connector">Track Connector</MenuItem>
//                     <MenuItem value="power-supply-12v">Power Supply 12V</MenuItem>
//                     <MenuItem value="led-panel-60x60">LED Panel 60x60</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Quantity"
//                   type="number"
//                   value={formData.quantity}
//                   onChange={handleInputChange('quantity')}
//                   required
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Priority</InputLabel>
//                   <Select
//                     value={formData.priority}
//                     onChange={handleInputChange('priority')}
//                     label="Priority"
//                     sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                   >
//                     <MenuItem value="low">Low</MenuItem>
//                     <MenuItem value="medium">Medium</MenuItem>
//                     <MenuItem value="high">High</MenuItem>
//                     <MenuItem value="urgent">Urgent</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Assigned To"
//                   value={formData.assignedTo}
//                   onChange={handleInputChange('assignedTo')}
//                   placeholder="e.g., John Smith"
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                 />
//               </Grid>

//               {/* Schedule */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" sx={{ mt: 2, mb: 2, color: palette.primary.main, fontWeight: 600 }}>
//                   Schedule
//                 </Typography>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <DatePicker
//                   label="Start Date"
//                   value={formData.startDate}
//                   onChange={handleDateChange('startDate')}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       fullWidth
//                       required
//                       sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                     />
//                   )}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <DatePicker
//                   label="End Date"
//                   value={formData.endDate}
//                   onChange={handleDateChange('endDate')}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       fullWidth
//                       required
//                       sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                     />
//                   )}
//                 />
//               </Grid>

//               {/* Time & Resources */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" sx={{ mt: 2, mb: 2, color: palette.primary.main, fontWeight: 600 }}>
//                   Time & Resources
//                 </Typography>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Estimated Hours"
//                   type="number"
//                   value={formData.estimatedHours}
//                   onChange={handleInputChange('estimatedHours')}
//                   placeholder="e.g., 40"
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Actual Hours"
//                   type="number"
//                   value={formData.actualHours}
//                   onChange={handleInputChange('actualHours')}
//                   placeholder="e.g., 35"
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                 />
//               </Grid>
              
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Required Materials"
//                   multiline
//                   rows={3}
//                   value={formData.materials}
//                   onChange={handleInputChange('materials')}
//                   placeholder="List required materials and quantities..."
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                 />
//               </Grid>
              
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Notes"
//                   multiline
//                   rows={3}
//                   value={formData.notes}
//                   onChange={handleInputChange('notes')}
//                   placeholder="Additional notes or instructions..."
//                   sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
//                 />
//               </Grid>

//               {/* Actions */}
//               <Grid item xs={12}>
//                 <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<Cancel />}
//                     onClick={() => navigate('/admin/production')}
//                     sx={{ borderRadius: '8px' }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     startIcon={<Save />}
//                     sx={{ borderRadius: '8px' }}
//                   >
//                     Create Production Order
//                   </Button>
//                 </Box>
//               </Grid>
//             </Grid>
//           </form>
//         </Paper>
//       </Box>
//     </PageContainer>
//   );
// };

// export default ProductionNew;
