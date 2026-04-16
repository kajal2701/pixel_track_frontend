import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  TextField,
  Box,
} from '@mui/material';
import { Store, LocalShipping } from '@mui/icons-material';
import { Controller, useWatch } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import ParentCard from '../../../components/shared/ParentCard';
import { getEstimatedDeliveryDate, getMinPickupDate, getPieceLength } from 'src/utils/helpers';
import orderService from 'src/services/orderService';

const DeliveryOptions = ({
  control,
  errors,
  register,
  deliveryMethod,
  totalPieces, // Take it directly from parent props
  setValue,
}) => {
  const color = useWatch({ control, name: 'color' });
  const channel_length = useWatch({ control, name: 'channelLength' });
  // totalPieces comes from props now

  const [minPickupDate, setMinPickupDate] = useState(null);

  useEffect(() => {
    if (deliveryMethod !== 'pickup') return;

    if (!color || !channel_length || !totalPieces) {
      setMinPickupDate(getMinPickupDate(false)); // Default safely if incomplete data
      return;
    }

    let isSubscribed = true;

    const checkStock = async () => {
      try {
        const response = await orderService.checkInventoryPreview({
          color,
          channel_length: getPieceLength(channel_length), // Convert to numeric length for backend
          total_pieces: Number(totalPieces), // mapping to snake_case for backend
        });

        const isReadySatisfied = response.data?.isReadySatisfied || false;
        if (isSubscribed) {
          setMinPickupDate(getMinPickupDate(isReadySatisfied));
        }
      } catch (err) {
        console.error('Failed to check inventory for pickup date:', err);
        if (isSubscribed) setMinPickupDate(getMinPickupDate(false));
      }
    };

    checkStock();
    return () => { isSubscribed = false; };
  }, [color, channel_length, totalPieces, deliveryMethod]);

  // Ensure pickupDate value is never earlier than calculated minPickupDate
  useEffect(() => {
    if (deliveryMethod === 'pickup' && minPickupDate) {
      setValue('pickupDate', minPickupDate);
    }
  }, [minPickupDate, deliveryMethod, setValue]);

  return (
    <ParentCard title="Delivery Options">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
            Delivery Method *
          </Typography>
          <FormControl component="fieldset" error={!!errors.deliveryMethod}>
            <Controller
              name="deliveryMethod"
              control={control}
              rules={{ required: 'Please select a delivery method' }}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value="pickup"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Store sx={{ mr: 1 }} /> Pickup
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="delivery"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalShipping sx={{ mr: 1 }} /> Delivery
                      </Box>
                    }
                  />
                </RadioGroup>
              )}
            />
            {errors.deliveryMethod && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                {errors.deliveryMethod.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {deliveryMethod === 'delivery' && (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Estimated Delivery Date
            </Typography>
            <Controller
              name="estimatedDeliveryDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={new Date(getEstimatedDeliveryDate())}
                  readOnly
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      helperText="Delivery within 5 business days"
                      inputProps={{
                        ...params.inputProps,
                        readOnly: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
        )}

        {deliveryMethod === 'pickup' && (
          <>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Pickup Location *
              </Typography>
              <FormControl fullWidth error={!!errors.pickupLocation}>
                <Controller
                  name="pickupLocation"
                  control={control}
                  rules={{
                    required: deliveryMethod === 'pickup' ? 'Pickup location is required' : false,
                  }}
                  render={({ field }) => (
                    <Select {...field} displayEmpty>
                      <MenuItem value="" disabled>
                        Select Location
                      </MenuItem>
                      <MenuItem value="4783 CAWSEY Terrace SW, Edmonton AB T6W 5M7">
                        4783 CAWSEY Terrace SW, Edmonton AB T6W 5M7
                      </MenuItem>
                      <MenuItem value="2322 chokecherry close sw Edmonton, AB T6X2M7">
                        2322 chokecherry close sw Edmonton, AB T6X2M7
                      </MenuItem>
                    </Select>
                  )}
                />
                {errors.pickupLocation && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                    {errors.pickupLocation.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Pickup Date *
              </Typography>
              <Controller
                name="pickupDate"
                control={control}
                rules={{
                  required: deliveryMethod === 'pickup' ? 'Pickup date is required' : false,
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    minDate={minPickupDate}
                    disabled
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.pickupDate}
                        helperText={errors.pickupDate?.message}
                        inputProps={{
                          ...params.inputProps,
                          readOnly: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f5f5f5',
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </>
        )}

        {deliveryMethod === 'delivery' && (
          <>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Delivery Address *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter full delivery address"
                {...register('deliveryAddress', {
                  required: deliveryMethod === 'delivery' ? 'Delivery address is required' : false,
                })}
                error={!!errors.deliveryAddress}
                helperText={errors.deliveryAddress?.message}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
            Notes (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Additional notes for your order"
            {...register('notes')}
          />
        </Grid>
      </Grid>
    </ParentCard>
  );
};

export default DeliveryOptions;
