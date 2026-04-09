import React, { useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, MenuItem, FormHelperText, CircularProgress } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';
import { channelLengthOptions, holeDistanceOptions, inventoryTypeOptions } from './helperFunction';

// ── Reusable field wrapper ─────────────────────────────────────
const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '8px' } };

// Limits decimal input to 2 places at the onChange level
const handleDecimalChange = (onChange) => (e) => {
  const val = e.target.value;
  if (!val || /^\d+(\.\d{0,2})?$/.test(val)) {
    onChange(e);
  } else {
    const match = val.match(/^\d*(?:\.\d{0,2})?/);
    if (match) {
      e.target.value = match[0];
      onChange(e);
    }
  }
};

// Blocks non-digit input for integer-only fields
const handleIntegerInput = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
};

// ── TextField shortcut component ───────────────────────────────
const FormTextField = ({ control, name, label, rules, placeholder, id, type = 'text', inputProps, onChangeOverride, onInputOverride, readOnly, bgColor }) => (
  <Grid item xs={12} md={4}>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, ...fieldProps }, fieldState: { error } }) => (
        <Box>
          <CustomFormLabel htmlFor={id}>{label}</CustomFormLabel>
          <CustomTextField
            {...fieldProps}
            id={id}
            fullWidth
            type={type}
            placeholder={placeholder}
            inputProps={inputProps}
            onChange={onChangeOverride ? onChangeOverride(onChange) : onChange}
            onInput={onInputOverride}
            InputProps={readOnly ? { readOnly: true } : undefined}
            error={!!error}
            helperText={error?.message}
            sx={bgColor ? { '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: bgColor } } : inputSx}
          />
        </Box>
      )}
    />
  </Grid>
);

// ── Select shortcut component ──────────────────────────────────
const FormSelectField = ({ control, name, label, rules, id, options, displayEmpty }) => (
  <Grid item xs={12} md={4}>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <CustomFormLabel htmlFor={id}>{label}</CustomFormLabel>
          <CustomSelect
            {...field}
            id={id}
            fullWidth
            displayEmpty={displayEmpty}
            error={!!error}
            sx={{ borderRadius: '8px' }}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </MenuItem>
            ))}
          </CustomSelect>
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  </Grid>
);


// ── Validation rules ───────────────────────────────────────────
const decimalRules = (label) => ({
  required: `${label} is required`,
  min: { value: 0.01, message: `${label} must be greater than 0` },
  pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Maximum 2 decimal places allowed' },
});

const integerRules = (label) => ({
  required: `${label} is required`,
  min: { value: 1, message: `${label} must be greater than 0` },
  pattern: { value: /^\d+$/, message: 'Only whole numbers allowed' },
});

// ════════════════════════════════════════════════════════════════
// InventoryForm
// ════════════════════════════════════════════════════════════════
const InventoryForm = ({ initialValues, onSubmit, onCancel, isEditing, loading }) => {
  const { palette } = useTheme();

  const { control, handleSubmit, watch, reset, setValue } = useForm({
    shouldUnregister: false,
    defaultValues: initialValues || {
      supplier: '', color_name: '', color_code: '', price: '',
      channel_length: '', inventory_type: 'Full Roll',
      size: '', quantity: '', possible_feet: '',
      hole_distance: '', pieces: '', length: '',
    },
  });

  const selectedType = watch('inventory_type');
  const watchSize = watch('size');
  const watchQuantity = watch('quantity');
  const watchChannelLength = watch('channel_length');

  // ── Reset with channel_length mapping ──
  useEffect(() => {
    if (initialValues) {
      let cl = initialValues.channel_length;
      if (cl) {
        const val = parseFloat(cl);
        if (val === 4) cl = "4 Feet/48''";
        else if (val === 6) cl = "6 Feet/72''";
        else if (val === 8) cl = '8 Feet/80"';
      }
      reset({ ...initialValues, channel_length: cl });
    }
  }, [initialValues, reset]);

  // ── Auto-calculate possible_feet ──
  useEffect(() => {
    if (selectedType === 'Full Roll' || selectedType === 'Slitted') {
      const s = parseFloat(watchSize) || 0;
      const q = parseFloat(watchQuantity) || 0;
      const clMatch = watchChannelLength?.match(/^(\d+)/);
      const cl = clMatch ? parseFloat(clMatch[1]) : 0;

      if (s > 0 && q > 0 && cl > 0) {
        setValue('possible_feet', parseFloat(((s * q) / cl).toFixed(2)));
      } else {
        setValue('possible_feet', '');
      }
    }
  }, [watchSize, watchQuantity, watchChannelLength, selectedType, setValue]);

  // ── Submit with nulled irrelevant fields ──
  const handleFormSubmit = (data) => {
    const payload = { ...data, state: data.state || 'available' };
    if (data.inventory_type === 'Full Roll' || data.inventory_type === 'Slitted') {
      payload.hole_distance = null;
      payload.pieces = null;
      payload.length = null;
    } else if (data.inventory_type === 'Ready Channel') {
      payload.channel_length = null;
      payload.size = null;
      payload.quantity = null;
      payload.possible_feet = null;
    }
    onSubmit(payload);
  };

  // ── Shared fields for Full Roll & Slitted ──
  const showRollSlittedFields = selectedType === 'Full Roll' || selectedType === 'Slitted';

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Grid container columnSpacing={3}>

          {/* ── Section: Basic Information ── */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
              Inventory Information
            </Typography>
          </Grid>

          <FormTextField control={control} name="supplier" id="supplier" label="Supplier *"
            rules={{ required: 'Supplier is required' }} placeholder="Enter supplier name" />

          <FormTextField control={control} name="color_name" id="color-name" label="Color Name *"
            rules={{ required: 'Color Name is required' }} placeholder="e.g., White, Black, Red" />

          <FormTextField control={control} name="color_code" id="color-code" label="Color Code *"
            rules={{ required: 'Color Code is required' }} placeholder="e.g., WH-001, BK-002" />

          <FormTextField control={control} name="price" id="price" label="Price *"
            rules={decimalRules('Price')} type="number" placeholder="Enter price"
            inputProps={{ step: '0.01', min: '0' }} onChangeOverride={handleDecimalChange} />

          <FormSelectField control={control} name="inventory_type" id="inventory-type" label="Inventory Type *"
            rules={{ required: 'Inventory Type is required' }} options={inventoryTypeOptions} />

          {/* ── Section: Full Roll & Slitted (shared) ── */}
          {showRollSlittedFields && (
            <>
              <FormSelectField control={control} name="channel_length" id="channel-length" label="Channel Length *"
                rules={{ required: 'Channel Length is required' }} options={channelLengthOptions} displayEmpty />

              <FormTextField control={control} name="size" id="size" label="Size (feet) *"
                rules={decimalRules('Size')} type="number" placeholder="e.g., 200"
                inputProps={{ step: '0.01', min: '0' }} onChangeOverride={handleDecimalChange} />

              <FormTextField control={control} name="quantity" id="quantity" label="Quantity *"
                rules={integerRules('Quantity')} type="number"
                placeholder={selectedType === 'Full Roll' ? 'Number of rolls' : 'Number of slitted pieces'}
                inputProps={{ step: '1', min: '1' }} onInputOverride={handleIntegerInput} />

              <FormTextField control={control} name="possible_feet" id="possible-feet"
                label="Possible Feet in Production" type="number"
                placeholder="Possible Feet in Production" readOnly bgColor={palette.action.hover} />
            </>
          )}

          {/* ── Section: Ready Channel ── */}
          {selectedType === 'Ready Channel' && (
            <>
              <FormSelectField control={control} name="hole_distance" id="hole-distance" label="Hole Distance *"
                rules={{ required: 'Hole Distance is required' }} options={holeDistanceOptions} displayEmpty />

              <FormTextField control={control} name="pieces" id="pieces" label="Pieces *"
                rules={integerRules('Pieces')} type="number"
                placeholder="Number of finished channel pieces"
                inputProps={{ step: '1', min: '1' }} onInputOverride={handleIntegerInput} />

              <FormTextField control={control} name="length" id="length" label="Length per Piece *"
                rules={decimalRules('Length')} type="number" placeholder="Length of each piece in feet"
                inputProps={{ step: '0.01', min: '0' }} onChangeOverride={handleDecimalChange} />
            </>
          )}

          {/* ── Actions ── */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button variant="outlined" startIcon={<Cancel />} onClick={onCancel}
                disabled={loading} sx={{ borderRadius: '8px' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained"
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
                disabled={loading} sx={{ borderRadius: '8px', minWidth: 180 }}>
                {loading
                  ? (isEditing ? 'Updating...' : 'Saving...')
                  : (isEditing ? 'Update Inventory Item' : 'Save Inventory Item')
                }
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default InventoryForm;
