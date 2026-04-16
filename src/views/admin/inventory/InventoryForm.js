import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  Stack,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';
import {
  formatDate,
  CHANNEL_LENGTH_OPTIONS as channelLengthOptions,
  HOLE_DISTANCE_OPTIONS as holeDistanceOptions,
  INVENTORY_TYPE_OPTIONS as inventoryTypeOptions,
  READY_CHANNEL_LENGTH_OPTIONS as readyChannelLengthOptions,
  handleDecimalChange,
  handleIntegerInput,
  decimalRules,
  integerRules,
  getPieceLength,
  mapToChannelLengthLabel,
  calculateProductionDetails,
} from 'src/utils/helpers';
import productService from 'src/services/productService';
import toast from 'react-hot-toast';
import { getSuppliersOptions, getFilteredColorsOptions, getFilteredColorCodesOptions } from './helperFunction';

// ── Reusable field wrapper ─────────────────────────────────────
const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '8px' } };

// ── TextField shortcut component ───────────────────────────────
const FormTextField = ({
  control,
  name,
  label,
  rules,
  placeholder,
  id,
  type = 'text',
  inputProps,
  onChangeOverride,
  onInputOverride,
  readOnly,
  bgColor,
}) => (
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
            sx={
              bgColor
                ? { '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: bgColor } }
                : inputSx
            }
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

// ════════════════════════════════════════════════════════════════
// InventoryForm
// ════════════════════════════════════════════════════════════════
const InventoryForm = ({ initialValues, onSubmit, onCancel, isEditing, loading }) => {
  const { palette } = useTheme();

  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const processedInitialValues = useMemo(() => {
    if (!initialValues) return null;
    return {
      ...initialValues,
      channel_length: mapToChannelLengthLabel(initialValues.channel_length),
      length: mapToChannelLengthLabel(initialValues.length),
    };
  }, [initialValues]);

  const { control, handleSubmit, watch, reset, setValue } = useForm({
    shouldUnregister: false,
    defaultValues: processedInitialValues || {
      supplier: '',
      color_name: '',
      color_code: '',
      price: '',
      channel_length: '',
      inventory_type: 'Full Roll',
      size: '',
      quantity: '',
      possible_feet: '',
      hole_distance: '',
      pieces: '',
      length: '',
    },
  });

  const selectedType = watch('inventory_type');
  const watchSize = watch('size');
  const watchQuantity = watch('quantity');
  const watchChannelLength = watch('channel_length');
  const selectedSupplier = watch('supplier');
  const selectedColorName = watch('color_name');

  // ── Fetch products for supplier/color dropdowns ──
  useEffect(() => {
    const fetchProductsData = async () => {
      setProductsLoading(true);
      try {
        const response = await productService.getAllProducts();
        setAllProducts(response.data || []);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch products for dropdowns');
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProductsData();
  }, []);

  // Unique suppliers
  const suppliers = useMemo(() => getSuppliersOptions(allProducts), [allProducts]);

  // Colors for selected supplier
  const filteredColors = useMemo(
    () => getFilteredColorsOptions(allProducts, selectedSupplier),
    [allProducts, selectedSupplier]
  );

  // Color codes for selected supplier
  const filteredColorCodes = useMemo(
    () => getFilteredColorCodesOptions(allProducts, selectedSupplier),
    [allProducts, selectedSupplier]
  );

  // Auto-set color_code when color_name changes
  useEffect(() => {
    if (selectedSupplier && selectedColorName && !isEditing) {
      const match = filteredColors.find((c) => c.value === selectedColorName);
      if (match) {
        setValue('color_code', match.color_code || '');
      }
    }
  }, [selectedColorName, selectedSupplier, filteredColors, setValue, isEditing]);

  // ── Reset with mapped values ──
  useEffect(() => {
    if (processedInitialValues) {
      reset(processedInitialValues);
    }
  }, [processedInitialValues, reset]);


  // ── Submit with nulled irrelevant fields ──
  const handleFormSubmit = (data) => {
    const payload = { ...data, state: data.state || 'available' };
    if (data.inventory_type === 'Full Roll' || data.inventory_type === 'Slitted') {
      payload.hole_distance = null;
      payload.pieces = null;
      payload.length = null;
      payload.channel_length = null;
      // Don't send the formatted possible_feet to backend
      payload.possible_feet = null;
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

          <FormSelectField
            control={control}
            name="supplier"
            id="supplier"
            label="Select Supplier *"
            rules={{ required: 'Supplier is required' }}
            options={
              productsLoading
                ? [{ value: selectedSupplier || '', label: 'Loading suppliers...', disabled: true }]
                : suppliers
            }
            displayEmpty
          />

          <FormSelectField
            control={control}
            name="color_name"
            id="color-name"
            label="Select Color *"
            rules={{ required: 'Color Name is required' }}
            options={
              productsLoading
                ? [{ value: selectedColorName || '', label: 'Loading colors...', disabled: true }]
                : filteredColors
            }
            displayEmpty
          />

          <FormSelectField
            control={control}
            name="color_code"
            id="color-code"
            label="Color Code *"
            rules={{ required: 'Color Code is required' }}
            options={
              productsLoading
                ? [{ value: control._defaultValues.color_code || '', label: 'Loading color codes...', disabled: true }]
                : filteredColorCodes
            }
            displayEmpty
          />

          <FormTextField
            control={control}
            name="price"
            id="price"
            label="Price *"
            rules={decimalRules('Price')}
            type="number"
            placeholder="Enter price"
            inputProps={{ step: '0.01', min: '0' }}
            onChangeOverride={handleDecimalChange}
          />

          <FormSelectField
            control={control}
            name="inventory_type"
            id="inventory-type"
            label="Inventory Type *"
            rules={{ required: 'Inventory Type is required' }}
            options={inventoryTypeOptions}
          />

          {/* ── Section: Full Roll & Slitted (shared) ── */}
          {showRollSlittedFields && (
            <>

              <FormTextField
                control={control}
                name="size"
                id="size"
                label="Size (feet) *"
                rules={decimalRules('Size')}
                type="number"
                placeholder="e.g., 200"
                inputProps={{ step: '0.01', min: '0' }}
                onChangeOverride={handleDecimalChange}
              />

              <FormTextField
                control={control}
                name="quantity"
                id="quantity"
                label="Quantity *"
                rules={integerRules('Quantity')}
                type="number"
                placeholder={
                  selectedType === 'Full Roll' ? 'Number of rolls' : 'Number of slitted pieces'
                }
                inputProps={{ step: '1', min: '1' }}
                onInputOverride={handleIntegerInput}
              />

              <Grid item xs={12} md={4}>
                <CustomFormLabel>Possible Production</CustomFormLabel>
                <Box sx={{ mt: 1 }}>
                  {(() => {
                    const s = parseFloat(watchSize) || 0;
                    const q = parseFloat(watchQuantity) || 0;

                    if (s > 0 && q > 0) {
                      const calculation = calculateProductionDetails(s, q);
                      const lengths = [
                        { label: '4ft', color: 'primary' },
                        { label: '6ft', color: 'success' },
                        { label: '8ft', color: 'warning' }
                      ];

                      return (
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                          {lengths.map((length, index) => {
                            const match = calculation.match(new RegExp(`${length.label}: ([\\d.]+) pcs`));
                            const pieces = match ? match[1] : '0.0';
                            return (
                              <Chip
                                key={index}
                                label={`${length.label}: ${pieces} pcs`}
                                color={length.color}
                                variant="outlined"
                                size="medium"
                                sx={{
                                  fontWeight: 500,
                                  '& .MuiChip-label': {
                                    px: 1
                                  }
                                }}
                              />
                            );
                          })}
                        </Stack>
                      );
                    } else {
                      return (
                        <CustomTextField
                          value=""
                          placeholder="Possible Production"
                          disabled
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              backgroundColor: palette.action.hover
                            }
                          }}
                        />
                      );
                    }
                  })()}
                </Box>
              </Grid>
            </>
          )}

          {/* ── Section: Ready Channel ── */}
          {selectedType === 'Ready Channel' && (
            <>
              <Grid item xs={12} md={4}>
                <Controller
                  name="hole_distance"
                  control={control}
                  rules={{ required: 'Hole distance is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="hole-distance">Hole Distance *</CustomFormLabel>
                      <FormControl component="fieldset" error={!!error}>
                        <RadioGroup row {...field}>
                          <FormControlLabel
                            value="8"
                            control={<Radio />}
                            label='8" center-to-center'
                          />
                        </RadioGroup>
                      </FormControl>
                      {error && <FormHelperText error>{error.message}</FormHelperText>}
                    </Box>
                  )}
                />
              </Grid>

              <FormTextField
                control={control}
                name="pieces"
                id="pieces"
                label="Pieces *"
                rules={integerRules('Pieces')}
                type="number"
                placeholder="Number of finished channel pieces"
                inputProps={{ step: '1', min: '1' }}
                onInputOverride={handleIntegerInput}
              />

              <FormSelectField
                control={control}
                name="length"
                id="length"
                label="Length per Piece *"
                rules={{ required: 'Length per Piece is required' }}
                options={readyChannelLengthOptions}
                displayEmpty
              />
            </>
          )}

          {/* ── Actions ── */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={onCancel}
                disabled={loading}
                sx={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
                disabled={loading}
                sx={{ borderRadius: '8px', minWidth: 180 }}
              >
                {loading
                  ? isEditing
                    ? 'Updating...'
                    : 'Saving...'
                  : isEditing
                    ? 'Update Inventory Item'
                    : 'Save Inventory Item'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default InventoryForm;
