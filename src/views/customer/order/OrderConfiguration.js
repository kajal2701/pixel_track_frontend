import React, { useState, useMemo, useEffect } from 'react';
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
  ListSubheader,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import ParentCard from '../../../components/shared/ParentCard';
import {
  CHANNEL_LENGTH_OPTIONS,
} from 'src/utils/helpers';

const OrderConfiguration = ({
  control,
  errors,
  register,
  productsLoading,
  colorOptions,
  totalPieces,
  finalLength,
  channelPricing,
  channelType,
  setValue,
}) => {
  const [colorSearch, setColorSearch] = useState('');

  // Parse channel_pricing to determine which sizes are enabled for the selected channel type
  const enabledSizes = useMemo(() => {
    if (!channelPricing || !channelType) return null; // null = show all (no filtering)

    const pricing = typeof channelPricing === 'string' ? JSON.parse(channelPricing) : channelPricing;

    // Detect new nested format
    if (pricing.commercial || pricing.residential) {
      const typeKey = channelType.toLowerCase();
      const typePricing = pricing[typeKey];
      if (!typePricing) return null;

      // Map hole key (e.g. "10h") to channel length value (e.g. "10")
      const enabled = {};
      Object.keys(typePricing).forEach((holeKey) => {
        const entry = typePricing[holeKey];
        const isEnabled = typeof entry === 'object' ? entry.enabled !== false : true;
        // Convert "10h" → "10", "9h" → "9", "8h" → "8"
        const value = holeKey.replace('h', '');
        enabled[value] = isEnabled;
      });
      return enabled;
    }

    // Legacy flat format — all sizes enabled
    return null;
  }, [channelPricing, channelType]);

  // Filter CHANNEL_LENGTH_OPTIONS based on enabled sizes
  const filteredChannelOptions = useMemo(() => {
    const options = CHANNEL_LENGTH_OPTIONS.filter((opt) => !opt.disabled);
    if (!enabledSizes) return options; // No filtering, show all
    return options.filter((opt) => enabledSizes[opt.value] !== false);
  }, [enabledSizes]);

  // Reset channelLength if the currently selected value is no longer available
  useEffect(() => {
    if (!enabledSizes || !setValue) return;
    // This runs when channelType changes — check if current channelLength is still valid
  }, [enabledSizes, setValue]);

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
                <RadioGroup row {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    // Reset channel length when switching type (may not be available in new type)
                    if (setValue) setValue('channelLength', '');
                  }}
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
                <Select
                  {...field}
                  displayEmpty
                  disabled={productsLoading}
                  onOpen={() => setColorSearch('')}
                  MenuProps={{
                    autoFocus: false,
                    PaperProps: { sx: { maxHeight: 300 } },
                  }}
                  sx={{ borderRadius: '8px' }}
                >
                  <ListSubheader sx={{ bgcolor: 'background.paper', pt: 1, pb: 1 }}>
                    <TextField
                      size="small"
                      autoFocus
                      placeholder="Search color..."
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      value={colorSearch}
                      onChange={(e) => setColorSearch(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </ListSubheader>
                  <MenuItem value="" disabled>
                    Select color
                  </MenuItem>
                  {colorOptions
                    .filter((opt) => !colorSearch || opt.plainLabel.toLowerCase().includes(colorSearch.toLowerCase()))
                    .map((opt) => (
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

        {/* Channel Length (Hole Count) — filtered by enabled sizes */}
        <Grid item xs={12} md={6}>
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
                  {filteredChannelOptions.map((opt) => (
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

        {/* Customer Name — entered manually per order */}
        <Grid item xs={12} md={6}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
            Customer Name
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter customer name"
            {...register('customerTag')}
            error={!!errors.customerTag}
            helperText={errors.customerTag?.message}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Grid>
      </Grid>
    </ParentCard>
  );
};

export default OrderConfiguration;
