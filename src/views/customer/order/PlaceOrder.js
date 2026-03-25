import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid, FormControl, RadioGroup, FormControlLabel, Radio, Select, MenuItem, InputLabel, Stack } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';

const PlaceOrder = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      channelType: 'Residential',
      color: 'IRON ORE (TKGM670)',
      holeDistance: 8,
      channelLength: '6 Hole (4 Feet)',
      totalLength: 10.36
    }
  });

  // Available colors
  const availableColors = [
    'IRON ORE (TKGM670)',
    'WHITE',
    'BLACK',
    'RED',
    'BLUE',
    'GRAY'
  ];

  // Watch form values for calculations
  const channelType = watch('channelType');
  const selectedColor = watch('color');
  const holeDistance = watch('holeDistance');
  const channelLength = watch('channelLength');
  const totalLength = watch('totalLength');

  // Calculate total pieces and final order length
  const calculateTotalPieces = () => {
    const length = parseFloat(totalLength) || 10.36;
    const pieceLength = channelLength === '6 Hole (4 Feet)' ? 4 : 6.67;
    return Math.ceil(length / pieceLength);
  };

  const calculateFinalOrderLength = () => {
    const pieces = calculateTotalPieces();
    const pieceLength = channelLength === '6 Hole (4 Feet)' ? 4 : 6.67;
    return pieces * pieceLength;
  };

  const totalPieces = calculateTotalPieces();
  const finalOrderLength = calculateFinalOrderLength();

  const onSubmit = (data) => {
    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    
    const order = {
      orderNumber: orderNumber,
      date: new Date().toISOString().split('T')[0],
      channelType: data.channelType,
      color: data.color,
      holeDistance: data.holeDistance,
      channelLength: data.channelLength,
      totalLength: data.totalLength,
      totalPieces: totalPieces,
      finalOrderLength: finalOrderLength,
      status: 'Pending'
    };
    
    console.log('New order:', order);
    alert('Order placed successfully!');
    navigate('/order/history');
  };

  return (
    <PageContainer title="Place Order" description="Create a new pixel track order">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Order Configuration */}
          <ParentCard title="Order Configuration">
            <Grid container spacing={3}>
              {/* Channel Type */}
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Channel Type *
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    {...register('channelType', { required: 'Channel type is required' })}
                  >
                    <FormControlLabel 
                      value="Residential" 
                      control={<Radio />} 
                      label="Residential" 
                    />
                    <FormControlLabel 
                      value="Commercial" 
                      control={<Radio />} 
                      label="Commercial" 
                    />
                  </RadioGroup>
                  {errors.channelType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                      {errors.channelType.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Select Color */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Select Color *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Select color</InputLabel>
                  <Select
                    {...register('color', { required: 'Color is required' })}
                    error={!!errors.color}
                    label="Select color"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    {availableColors.map(color => (
                      <MenuItem key={color} value={color}>
                        {color}
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

              {/* Hole Distance */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Hole Distance (center to center)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  placeholder="Enter hole distance"
                  {...register('holeDistance', { required: 'Hole distance is required' })}
                  error={!!errors.holeDistance}
                  helperText={errors.holeDistance?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>

              {/* Channel Length */}
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Channel Length *
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    {...register('channelLength', { required: 'Channel length is required' })}
                  >
                    <FormControlLabel 
                      value="6 Hole (4 Feet)" 
                      control={<Radio />} 
                      label="6 Hole (4 Feet)" 
                    />
                    <FormControlLabel 
                      value="10 Hole (6.67 Feet)" 
                      control={<Radio />} 
                      label="10 Hole (6.67 Feet)" 
                    />
                  </RadioGroup>
                  {errors.channelLength && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                      {errors.channelLength.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Total Length */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Total Length (ft) *
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  placeholder="Enter total length"
                  step="0.01"
                  {...register('totalLength', { 
                    required: 'Total length is required',
                    valueAsNumber: true
                  })}
                  error={!!errors.totalLength}
                  helperText={errors.totalLength?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>

              {/* Total Pieces - Display Only */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Total Pieces
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={totalPieces}
                  disabled
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5'
                    } 
                  }}
                />
              </Grid>

              {/* Final Order Length - Display Only */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Final Order Length (ft)
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={finalOrderLength}
                  disabled
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5'
                    } 
                  }}
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