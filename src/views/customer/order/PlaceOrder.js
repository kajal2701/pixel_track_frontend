import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, FormControl, InputLabel, Select, MenuItem, InputAdornment, Stack, Card, CardContent, IconButton } from '@mui/material';
import { Save, Cancel, ShoppingCart, Add, Remove } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import ChildCard from '../../../components/shared/ChildCard';

const PlaceOrder = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerNumber: '',
    email: '',
    phone: '',
    orderType: 'full-roll', // full-roll, slitted, ready-channel
    color: '',
    colorCode: '',
    quantity: 1,
    lengthInFeet: '',
    pricePerFoot: 2.50,
    holeDistance: '8 inches', // 8 or 9 inches for ready channel
    deliveryAddress: '',
    specialInstructions: '',
    totalAmount: 0
  });

  const [orderItems, setOrderItems] = useState([]);

  // Sample inventory data
  const availableColors = [
    { name: 'White', code: '#FFFFFF', pricePerFoot: 2.50 },
    { name: 'Black', code: '#000000', pricePerFoot: 2.50 },
    { name: 'Red', code: '#FF0000', pricePerFoot: 3.00 },
    { name: 'Blue', code: '#0000FF', pricePerFoot: 2.40 },
    { name: 'Gray', code: '#808080', pricePerFoot: 2.25 }
  ];

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update price per foot when color changes
    if (field === 'color') {
      const selectedColor = availableColors.find(c => c.name === value);
      if (selectedColor) {
        setFormData(prev => ({
          ...prev,
          colorCode: selectedColor.code,
          pricePerFoot: selectedColor.pricePerFoot
        }));
      }
    }

    // Calculate total when quantity or length changes
    if (field === 'quantity' || field === 'lengthInFeet') {
      calculateTotal();
    }
  };

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const length = parseFloat(formData.lengthInFeet) || 0;
    const price = formData.pricePerFoot || 0;
    const total = quantity * length * price;
    setFormData(prev => ({ ...prev, totalAmount: total }));
  };

  const addToOrder = () => {
    if (formData.color && formData.lengthInFeet && formData.quantity) {
      const newItem = {
        id: Date.now(),
        type: formData.orderType,
        color: formData.color,
        colorCode: formData.colorCode,
        quantity: formData.quantity,
        lengthInFeet: formData.lengthInFeet,
        pricePerFoot: formData.pricePerFoot,
        holeDistance: formData.holeDistance,
        total: formData.totalAmount
      };
      
      setOrderItems(prev => [...prev, newItem]);
      resetForm();
    }
  };

  const removeFromOrder = (id) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerNumber: '',
      email: '',
      phone: '',
      orderType: 'full-roll',
      color: '',
      colorCode: '',
      quantity: 1,
      lengthInFeet: '',
      pricePerFoot: 2.50,
      holeDistance: '8 inches',
      deliveryAddress: '',
      specialInstructions: '',
      totalAmount: 0
    });
  };

  const calculateGrandTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Please add at least one item to your order');
      return;
    }
    
    const order = {
      customerInfo: {
        name: formData.customerName,
        number: formData.customerNumber,
        email: formData.email,
        phone: formData.phone
      },
      items: orderItems,
      deliveryAddress: formData.deliveryAddress,
      specialInstructions: formData.specialInstructions,
      grandTotal: calculateGrandTotal(),
      orderDate: new Date().toISOString(),
      status: 'pending'
    };
    
    console.log('New order:', order);
    alert('Order placed successfully!');
    navigate('/order/history');
  };

  return (
    <PageContainer title="Place Order" description="Create a new pixel track order">
      <Stack spacing={3}>
        {/* Customer Information */}
        <ParentCard title="Customer Information">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName}
                onChange={handleInputChange('customerName')}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Number"
                value={formData.customerNumber}
                onChange={handleInputChange('customerNumber')}
                placeholder="e.g., CUST-001"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                placeholder="+1 (555) 123-4567"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Order Configuration */}
        <ParentCard title="Order Configuration">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Order Type</InputLabel>
                <Select
                  value={formData.orderType}
                  onChange={handleInputChange('orderType')}
                  label="Order Type"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                >
                  <MenuItem value="full-roll">Full Roll</MenuItem>
                  <MenuItem value="slitted">Slitted</MenuItem>
                  <MenuItem value="ready-channel">Ready Channel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  value={formData.color}
                  onChange={handleInputChange('color')}
                  label="Color"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                >
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
                        {color.name} (${color.pricePerFoot}/ft)
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price per Foot"
                type="number"
                value={formData.pricePerFoot}
                disabled
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange('quantity')}
                required
                InputProps={{
                  inputProps: { min: 1 }
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Length (feet)"
                type="number"
                value={formData.lengthInFeet}
                onChange={handleInputChange('lengthInFeet')}
                required
                InputProps={{
                  inputProps: { min: 1 }
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {formData.orderType === 'ready-channel' && (
                <FormControl fullWidth>
                  <InputLabel>Hole Distance</InputLabel>
                  <Select
                    value={formData.holeDistance}
                    onChange={handleInputChange('holeDistance')}
                    label="Hole Distance"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="8 inches">8 inches</MenuItem>
                    <MenuItem value="9 inches">9 inches</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Amount"
                value={formData.totalAmount.toFixed(2)}
                disabled
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addToOrder}
              sx={{ borderRadius: '8px' }}
            >
              Add to Order
            </Button>
          </Box>
        </ParentCard>

        {/* Order Summary */}
        <ParentCard title="Order Summary">
          {orderItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="textSecondary">
                No items added to order yet
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {orderItems.map((item) => (
                <Card key={item.id} sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {item.color} {item.type}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.quantity} × {item.lengthInFeet}ft @ ${item.pricePerFoot}/ft
                      </Typography>
                      {item.type === 'ready-channel' && (
                        <Typography variant="body2" color="textSecondary">
                          Hole Distance: {item.holeDistance}
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Typography variant="h6" fontWeight={600}>
                        ${item.total.toFixed(2)}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromOrder(item.id)}
                      >
                        <Remove />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              ))}
              
              <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${palette.divider}` }}>
                <Typography variant="h5" fontWeight={700} textAlign="right">
                  Grand Total: ${calculateGrandTotal().toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          )}
        </ParentCard>

        {/* Delivery Information */}
        <ParentCard title="Delivery Information">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Address"
                multiline
                rows={2}
                value={formData.deliveryAddress}
                onChange={handleInputChange('deliveryAddress')}
                placeholder="Enter complete delivery address..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Instructions"
                multiline
                rows={3}
                value={formData.specialInstructions}
                onChange={handleInputChange('specialInstructions')}
                placeholder="Any special delivery or handling instructions..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
          </Grid>
        </ParentCard>

        {/* Order Statistics */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ChildCard title="Items in Order">
              <Typography variant="h4" fontWeight="600" color="primary.main">
                {orderItems.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total items
              </Typography>
            </ChildCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChildCard title="Total Feet">
              <Typography variant="h4" fontWeight="600" color="info.main">
                {orderItems.reduce((sum, item) => sum + (item.quantity * item.lengthInFeet), 0)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total feet ordered
              </Typography>
            </ChildCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChildCard title="Order Value">
              <Typography variant="h4" fontWeight="600" color="success.main">
                ${calculateGrandTotal().toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total order value
              </Typography>
            </ChildCard>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => navigate('/order/history')}
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleSubmit}
            disabled={orderItems.length === 0}
            sx={{ borderRadius: '8px' }}
          >
            Place Order
          </Button>
        </Box>
      </Stack>
    </PageContainer>
  );
};

export default PlaceOrder;
