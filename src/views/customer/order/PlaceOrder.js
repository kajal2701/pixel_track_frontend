import React from 'react';
import {
  Box, Typography, Button, TextField, Grid, FormControl,
  RadioGroup, FormControlLabel, Radio, Select, MenuItem,
  InputLabel, Stack, CircularProgress,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import orderService from 'src/services/orderService';
import { AVAILABLE_COLORS, calculateTotalPieces, calculateFinalLength } from 'src/utils/helpers';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const customer = JSON.parse(localStorage.getItem('customerData'));

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    defaultValues: {
      channelType:   'Residential',
      color:         'IRON ORE (TKGM670)',
      holeDistance:  1,       // ← default 1
      channelLength: '6 Hole (4 Feet)',
      totalLength:   0,       // ← default 0
    },
  });

  const channelLength = watch('channelLength');
  const totalLength   = watch('totalLength');

  // ── Calculations ──
  const totalPieces = calculateTotalPieces(totalLength, channelLength);
  const finalLength = calculateFinalLength(totalLength, channelLength);

  // ── Submit → POST /api/orders ──
  const onSubmit = async (data) => {
    if (!customer?.id) {
      toast.error('Please login to place an order.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_id:    customer.id,
        channel_type:   data.channelType,
        color:          data.color,
        hole_distance:  Number(data.holeDistance),
        channel_length: data.channelLength,
        total_length:   Number(data.totalLength),
        total_pieces:   totalPieces,
        final_length:   finalLength,
      };
      await orderService.createOrder(payload);
      toast.success('Order placed successfully!');
      navigate('/order/history');
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Place Order" description="Create a new pixel track order">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <ParentCard title="Order Configuration">
            <Grid container spacing={3}>

              {/* Channel Type */}
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Channel Type *
                </Typography>
                <FormControl component="fieldset">
                  <Controller
                    name="channelType"
                    control={control}
                    rules={{ required: 'Channel type is required' }}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="Residential" control={<Radio />} label="Residential" />
                        <FormControlLabel value="Commercial"  control={<Radio />} label="Commercial" />
                      </RadioGroup>
                    )}
                  />
                  {errors.channelType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                      {errors.channelType.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Color */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Select Color *
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={watch('color')}
                    {...register('color', { required: 'Color is required' })}
                    error={!!errors.color}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select color</MenuItem>
                    {AVAILABLE_COLORS.map((color) => (
                      <MenuItem key={color} value={color}>{color}</MenuItem>
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
                  placeholder="0"                     // ← placeholder 0
                  {...register('holeDistance', {
                    required: 'Hole distance is required',
                    min: { value: 1, message: 'Must be at least 1' },
                  })}
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
                  <Controller
                    name="channelLength"
                    control={control}
                    rules={{ required: 'Channel length is required' }}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="6 Hole (4 Feet)"     control={<Radio />} label="6 Hole (4 Feet)" />
                        <FormControlLabel value="10 Hole (6.67 Feet)" control={<Radio />} label="10 Hole (6.67 Feet)" />
                      </RadioGroup>
                    )}
                  />
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
                  placeholder="0"                     // ← placeholder 0
                  inputProps={{ step: '0.01', min: 0 }}
                  {...register('totalLength', {
                    required: 'Total length is required',
                    min: { value: 0.01, message: 'Must be greater than 0' },
                    valueAsNumber: true,
                  })}
                  error={!!errors.totalLength}
                  helperText={errors.totalLength?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>

              {/* Total Pieces — auto calculated */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Total Pieces
                </Typography>
                <TextField
                  fullWidth
                  value={totalPieces}               // ← shows 0 by default
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                />
              </Grid>

              {/* Final Order Length — auto calculated */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Final Order Length (ft)
                </Typography>
                <TextField
                  fullWidth
                  value={finalLength}               // ← shows 0 by default
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                />
              </Grid>

            </Grid>
          </ParentCard>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Cancel />}
              onClick={() => navigate('/order/history')}
              sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
              disabled={loading}
              sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Box>
        </Stack>
      </form>
    </PageContainer>
  );
};

export default PlaceOrder;