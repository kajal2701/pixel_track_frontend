import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, FormControl, InputLabel, Select, MenuItem, InputAdornment, Stack, Card, CardContent, IconButton } from '@mui/material';
import { Save, Cancel, ShoppingCart, Add, Remove } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import ChildCard from '../../../components/shared/ChildCard';

const PlaceOrder = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [orderItems, setOrderItems] = useState([]);

  // Sample inventory data
  const availableColors = [
    { name: 'White', code: '#FFFFFF', pricePerFoot: 2.50 },
    { name: 'Black', code: '#000000', pricePerFoot: 2.50 },
    { name: 'Red', code: '#FF0000', pricePerFoot: 3.00 },
    { name: 'Blue', code: '#0000FF', pricePerFoot: 2.40 },
    { name: 'Gray', code: '#808080', pricePerFoot: 2.25 }
  ];

  const onSubmit = (data) => {
    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    
    const order = {
      orderNumber: orderNumber,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      customerName: data.customerName,
      companyName: data.companyName,
      color: data.color,
      finalOrder: data.finalOrder,
      status: 'Pending',
      notes: data.notes,
      email: data.email,
      phone: data.phone
    };
    
    console.log('New order:', order);
    alert('Order placed successfully!');
    navigate('/order/history');
  };

  return (
    <PageContainer title="Place Order" description="Create a new pixel track order">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
        {/* Customer Information */}
        <ParentCard title="Customer Information">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Customer Name
              </Typography>
              <TextField
                fullWidth
                type="text"
                variant="outlined"
                placeholder="Enter customer name"
                {...register('customerName', { required: 'Customer name is required' })}
                error={!!errors.customerName}
                helperText={errors.customerName?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Company Name
              </Typography>
              <TextField
                fullWidth
                type="text"
                variant="outlined"
                placeholder="Enter company name"
                {...register('companyName', { required: 'Company name is required' })}
                error={!!errors.companyName}
                helperText={errors.companyName?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                variant="outlined"
                placeholder="Enter email address"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Must be a valid email format'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Phone Number
              </Typography>
              <TextField
                fullWidth
                type="text"
                variant="outlined"
                placeholder="Enter phone number"
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^\d{3}-\d{3}-\d{4}$/,
                    message: 'Pattern: 000-000-0000 (e.g., 123-456-7890)'
                  }
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message || 'Pattern: 000-000-0000 (e.g., 123-456-7890)'}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Order Configuration */}
        <ParentCard title="Order Configuration">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Color
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select color</InputLabel>
                <Select
                  {...register('color', { required: 'Color is required' })}
                  error={!!errors.color}
                  label="Select color"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                >
                  <MenuItem value="">
                    <em>Select color</em>
                  </MenuItem>
                  {availableColors.map(color => (
                    <MenuItem key={color.name} value={color.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: color.code,
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                          }}
                        />
                        {color.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.color && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                    {errors.color.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Final Order
              </Typography>
              <TextField
                fullWidth
                type="text"
                variant="outlined"
                placeholder="e.g., 216 ft"
                {...register('finalOrder', { required: 'Final order is required' })}
                error={!!errors.finalOrder}
                helperText={errors.finalOrder?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Add any special instructions or notes..."
                {...register('notes', { required: 'Notes are required' })}
                error={!!errors.notes}
                helperText={errors.notes?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Submit Order */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Cancel />}
            onClick={() => navigate('/order/history')}
            sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Save />}
            sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
          >
            Place Order
          </Button>
        </Box>
        </Stack>
      </form>
    </PageContainer>
  );
};

export default PlaceOrder;
