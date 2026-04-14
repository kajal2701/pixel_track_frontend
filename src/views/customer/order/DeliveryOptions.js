import React from 'react';
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
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import ParentCard from '../../../components/shared/ParentCard';
import { addDays } from 'date-fns';

const DeliveryOptions = ({
  control,
  errors,
  register,
  deliveryMethod,
}) => {
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
                    minDate={addDays(new Date(), 1)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.pickupDate}
                        helperText={errors.pickupDate?.message}
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
