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
} from '@mui/material';
import { Controller } from 'react-hook-form';
import ParentCard from '../../../components/shared/ParentCard';
import {
  CHANNEL_LENGTH_OPTIONS,
  HOLE_DISTANCE_OPTIONS,
} from 'src/utils/helpers';

const OrderConfiguration = ({
  control,
  errors,
  register,
  productsLoading,
  colorOptions,
  totalPieces,
  finalLength,
}) => {
  return (
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
          <FormControl fullWidth variant="outlined" error={!!errors.color}>
            <Controller
              name="color"
              control={control}
              rules={{ required: 'Color is required' }}
              render={({ field }) => (
                <Select {...field} displayEmpty disabled={productsLoading}>
                  <MenuItem value="" disabled>
                    Select color
                  </MenuItem>
                  {colorOptions.map((opt) => (
                    <MenuItem key={opt.key} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
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
            Hole Distance *
          </Typography>
          <FormControl component="fieldset" error={!!errors.holeDistance}>
            <Controller
              name="holeDistance"
              control={control}
              rules={{ required: 'Hole distance is required' }}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  {HOLE_DISTANCE_OPTIONS.filter((opt) => !opt.disabled).map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      value={opt.value}
                      control={<Radio />}
                      label={opt.label}
                    />
                  ))}
                </RadioGroup>
              )}
            />
            {errors.holeDistance && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                {errors.holeDistance.message}
              </Typography>
            )}
          </FormControl>
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
                  {CHANNEL_LENGTH_OPTIONS.filter((opt) => !opt.disabled).map((opt) => (
                    <FormControlLabel
                      key={opt.value}
                      value={opt.value}
                      control={<Radio />}
                      label={opt.label}
                    />
                  ))}
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
            placeholder="0" // ← placeholder 0
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
            value={totalPieces} // ← shows 0 by default
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
            value={finalLength} // ← shows 0 by default
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
  );
};

export default OrderConfiguration;
