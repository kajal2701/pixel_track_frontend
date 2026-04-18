import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, Button, Paper, Grid, MenuItem,
  FormHelperText, RadioGroup, FormControlLabel, Radio,
  FormControl, CircularProgress, Divider, Alert, Chip
} from '@mui/material';
import { Save, Cancel, InfoOutlined, ArrowForward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';
import inventoryService from '../../../services/inventoryService';
import orderService from '../../../services/orderService'; // adjust import as needed
import toast from 'react-hot-toast';
import { READY_CHANNEL_LENGTH_OPTIONS, getPieceLength } from 'src/utils/helpers';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_VALUES = {
  productionType: 'Order',
  orderNumber: '',
  rawMaterial: '',
  targetState: 'Slitted',
  slittedQuantity: '',
  slittedSize: '',
  readyChannelLength: '',
  wasteQuantity: 0,
};

// ─── Output Preview Calculator ─────────────────────────────────────────────────

const OutputPreview = ({ selectedItem, targetState, slittedQuantity, slittedSize, readyChannelLength }) => {
  const preview = useMemo(() => {
    if (!selectedItem) return null;

    const totalLength = parseFloat(selectedItem.length) || parseFloat(selectedItem.size) || 0;
    const availableQty = parseFloat(selectedItem.quantity) || 0;
    const inventoryType = selectedItem.inventory_type || '';

    if (targetState === 'Slitted') {
      const qty = parseInt(slittedQuantity) || 0;
      const sizeStr = slittedSize || '';
      const sizeMatch = sizeStr.match(/[\d.]+/);
      const sizeNum = sizeMatch ? parseFloat(sizeMatch[0]) : 0;

      if (qty > 0 && sizeNum > 0) {
        const totalOutput = qty * sizeNum;

        return {
          inputLabel: inventoryType === 'Full Roll'
            ? `${availableQty} full roll(s) (${totalLength} ft each)`
            : `${availableQty} pieces (${totalLength} ft each)`,
          outputLabel: `${qty} slitted roll(s) × ${sizeNum} ft = ${totalOutput} ft`,

          valid: totalOutput <= totalLength * availableQty,
        };
      }
      return {
        inputLabel: inventoryType === 'Full Roll'
          ? `${availableQty} full roll(s) (${totalLength} ft each)`
          : `${availableQty} pieces (${totalLength} ft each)`,
        outputLabel: 'Enter quantity & size to see output',

        valid: true,
      };
    }

    if (targetState === 'Ready Channel') {
      const chLenFt = getPieceLength(readyChannelLength);
      if (chLenFt > 0 && totalLength > 0) {
        const piecesPerRoll = Math.floor(totalLength / chLenFt);
        const totalPieces = piecesPerRoll * availableQty;

        return {
          inputLabel: `${availableQty} piece(s) (${totalLength} ft each)`,
          outputLabel: `${totalPieces} channel piece(s) × ${chLenFt} ft (${piecesPerRoll}/piece)`,

          valid: true,
        };
      }
      return {
        inputLabel: `${availableQty} piece(s) (${totalLength} ft each)`,
        outputLabel: 'Select channel length to see output',

        valid: true,
      };
    }

    return null;
  }, [selectedItem, targetState, slittedQuantity, slittedSize, readyChannelLength]);

  if (!preview) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexWrap: 'wrap',
        p: 1.5,
        borderRadius: '10px',
        bgcolor: 'primary.lighter',
        border: '1px solid',
        borderColor: preview.valid ? 'primary.light' : 'error.light',
        bgcolor: preview.valid ? 'primary.lighter' : 'error.lighter',
      }}
    >
      <InfoOutlined sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
      <Chip label={preview.inputLabel} size="small" variant="outlined" color="default" />
      <ArrowForward sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
      <Chip
        label={preview.outputLabel}
        size="small"
        color={preview.valid ? 'primary' : 'error'}
        variant="filled"
      />
    </Box>
  );
};

// ─── Order Detail Display (read-only) ─────────────────────────────────────────

const OrderDetail = ({ label, value }) => (
  <Box>
    <CustomFormLabel sx={{ mt: 0, mb: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>
      {label}
    </CustomFormLabel>
    <Box
      sx={{
        px: 1.5, py: 1, borderRadius: '8px',
        border: '1px solid', borderColor: 'divider',
        bgcolor: 'action.hover', minHeight: 40,
        display: 'flex', alignItems: 'center',
      }}
    >
      <Typography variant="body2" fontWeight={500}>{value || '—'}</Typography>
    </Box>
  </Box>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const ProductionForm = ({ production, onSubmit, loading, isEdit = false, onCancel }) => {
  const theme = useTheme();
  const { palette } = theme;

  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  // For Order type: order details fetched from API
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: DEFAULT_VALUES });

  // ── Watchers ──
  const selectedType   = watch('productionType');
  const targetState    = watch('targetState');
  const selectedRawMaterial = watch('rawMaterial');
  const slittedQuantity = watch('slittedQuantity');
  const slittedSize     = watch('slittedSize');
  const readyChannelLength = watch('readyChannelLength');
  const orderNumber    = watch('orderNumber');

  // ── Reset on edit/new ──
  useEffect(() => {
    if (production && isEdit) {
      reset({
        productionType: production.productionType || 'Order',
        orderNumber: production.orderNumber || '',
        rawMaterial: production.rawMaterial || '',
        targetState: production.targetState || 'Slitted',
        slittedQuantity: production.slittedQuantity || '',
        slittedSize: production.slittedSize || '',
        readyChannelLength: production.readyChannelLength || '',
        wasteQuantity: production.wasteQuantity || 0,
      });
    } else if (!isEdit) {
      reset(DEFAULT_VALUES);
      setOrderDetails(null);
    }
  }, [production, isEdit, reset]);

  // ── Fetch inventory (for Inventory type) ──
  useEffect(() => {
    const fetchInventory = async () => {
      setInventoryLoading(true);
      try {
        const response = await inventoryService.getAllInventory();
        setInventoryItems(response.data || []);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch inventory.');
      } finally {
        setInventoryLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // ── Fetch order details when Order type + orderNumber filled ──
  useEffect(() => {
    if (selectedType !== 'Order' || !orderNumber?.trim()) {
      setOrderDetails(null);
      return;
    }
    const timeout = setTimeout(async () => {
      setOrderLoading(true);
      try {
        // Adjust this call to your actual order service method
        const response = await orderService.getProductionDetailsByOrder(orderNumber.trim());
        setOrderDetails(response.data || null);
        if (response.data) {
          // Optionally auto-fill fields from order
          setValue('rawMaterial', response.data.rawMaterialId || '');
          setValue('targetState', response.data.targetState || 'Slitted');
        }
      } catch {
        setOrderDetails(null);
      } finally {
        setOrderLoading(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [orderNumber, selectedType, setValue]);

  // ── Filtered inventory: only Full Roll + Slitted ──
  const filteredInventory = useMemo(
    () => inventoryItems.filter((item) =>
      item.inventory_type === 'Full Roll' || item.inventory_type === 'Slitted'
    ),
    [inventoryItems]
  );

  // ── Selected inventory item helpers ──
  const selectedItem = useMemo(
    () => inventoryItems.find((i) => i.id === selectedRawMaterial) || null,
    [inventoryItems, selectedRawMaterial]
  );
  const availableQty    = selectedItem ? parseFloat(selectedItem.quantity) || 0 : 0;
  const availableLength = selectedItem
    ? parseFloat(selectedItem.length) || parseFloat(selectedItem.size) || 0
    : 0;

  const getInventoryLabel = (item) => {
    const type  = item.inventory_type || '';
    const color = item.color_name ? `${item.color_name} (${item.color_code || ''})` : '';
    const mfr   = item.supplier || '';
    const size  = item.size ? `${item.size} ft` : '';
    const qty   = item.quantity || 0;
    return `${type} — ${color}${mfr ? ` · ${mfr}` : ''} · Qty: ${qty}${size ? ` · ${size}` : ''}`;
  };

  // ── Auto-fill from selected inventory ──
  useEffect(() => {
    if (!selectedItem || isEdit || selectedType !== 'Inventory') return;
    const qty  = parseFloat(selectedItem.quantity) || 0;
    const size = selectedItem.size ? `${selectedItem.size} ft` : '';
    setValue('slittedQuantity', qty);
    setValue('slittedSize', size);
    setValue('readyChannelLength', '');
    trigger(['slittedQuantity', 'slittedSize']);
  }, [selectedItem, isEdit, selectedType, setValue, trigger]);

  // ── Validators ──
  const validateQty = (value) => {
    if (selectedType !== 'Inventory') return true;
    const v = Number(value) || 0;
    if (v > availableQty) return `Exceeds available stock (${availableQty})`;
    return true;
  };

  const validateSize = (value) => {
    if (selectedType !== 'Inventory') return true;
    const match = (value || '').match(/[\d.]+/);
    const num   = match ? parseFloat(match[0]) : 0;
    if (num > availableLength) return `Exceeds available size (${availableLength} ft)`;
    return true;
  };

  // ── Submit ──
  const onFormSubmit = (data) => {
    onSubmit({
      productionType:      data.productionType,
      orderNumber:         data.orderNumber?.trim(),
      rawMaterial:         data.rawMaterial,
      targetState:         data.targetState,
      slittedQuantity:     Number(data.slittedQuantity) || 0,
      slittedSize:         data.slittedSize?.trim(),
      readyChannelLength:  data.readyChannelLength,
      wasteQuantity:       Number(data.wasteQuantity) || 0,
    });
  };

  // ── Section heading helper ──
  const SectionHeading = ({ title, color = 'primary.main' }) => (
    <Grid item xs={12}>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5, color, fontWeight: 700, letterSpacing: 0.3 }}>
        {title}
      </Typography>
      <Divider />
    </Grid>
  );

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <Grid container columnSpacing={3} rowSpacing={0}>

          {/* ── Production Type ────────────────────────────────── */}
          <SectionHeading title="Production Information" />

          <Grid item xs={12}>
            <Controller
              name="productionType"
              control={control}
              rules={{ required: 'Production Type is required' }}
              render={({ field }) => (
                <Box>
                  <CustomFormLabel sx={{ mt: 0 }}>Production For</CustomFormLabel>
                  <FormControl component="fieldset">
                    <RadioGroup row {...field}>
                      <FormControlLabel value="Order"     control={<Radio />} label="Specific Order" />
                      <FormControlLabel value="Inventory" control={<Radio />} label="General Inventory" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>

          {/* ════════════════════════════════════════════════════
              ORDER MODE
          ════════════════════════════════════════════════════ */}
         {selectedType === 'Order' && (
  <>
    {/* Order Number input */}
    <Grid item xs={12} md={6}>   {/* ← was md={4}, now md={6} */}
      <Controller
        name="orderNumber"
        control={control}
        rules={{ required: 'Order Number is required' }}
        render={({ field, fieldState: { error } }) => (
          <Box>
            <CustomFormLabel htmlFor="order-number">Order Number *</CustomFormLabel>
            <CustomTextField
              {...field}
              id="order-number"
              fullWidth
              placeholder="e.g., ORD-1025"
              error={!!error}
              helperText={error?.message}
              InputProps={{
                endAdornment: orderLoading
                  ? <CircularProgress size={16} />
                  : null,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
        )}
      />
    </Grid>

    {/* Spacer — keeps the row balanced on md+ screens */}
    <Grid item xs={false} md={6} sx={{ display: { xs: 'none', md: 'block' } }} />
  </>
)}

          {/* ════════════════════════════════════════════════════
              INVENTORY MODE
          ════════════════════════════════════════════════════ */}
         
            <>
              {/* Raw Material dropdown */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="rawMaterial"
                  control={control}
                  rules={{ required: 'Raw Material is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="raw-material">Select Raw Material *</CustomFormLabel>
                      <CustomSelect
                        {...field}
                        id="raw-material"
                        fullWidth
                        displayEmpty
                        error={!!error}
                        sx={{ borderRadius: '8px' }}
                      >
                        <MenuItem value="" disabled>Select Material</MenuItem>
                        {inventoryLoading
                          ? <MenuItem disabled>Loading...</MenuItem>
                          : filteredInventory.length === 0
                            ? <MenuItem disabled>No inventory available</MenuItem>
                            : filteredInventory.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                  {getInventoryLabel(item)}
                                </MenuItem>
                              ))
                        }
                      </CustomSelect>
                      {error && <FormHelperText error>{error.message}</FormHelperText>}
                    </Box>
                  )}
                />
              </Grid>

              {/* Target State dropdown */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="targetState"
                  control={control}
                  rules={{ required: 'Target State is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="target-state">Change State To *</CustomFormLabel>
                      <CustomSelect
                        {...field}
                        id="target-state"
                        fullWidth
                        error={!!error}
                        sx={{ borderRadius: '8px' }}
                      >
                        <MenuItem value="Slitted">Slitted</MenuItem>
                        <MenuItem value="Ready Channel">Ready Channel</MenuItem>
                      </CustomSelect>
                      {error && <FormHelperText error>{error.message}</FormHelperText>}
                    </Box>
                  )}
                />
              </Grid>

              {/* ── SLITTED fields ── */}
              {targetState === 'Slitted' && (
                <>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="slittedQuantity"
                      control={control}
                      rules={{
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Must be at least 1' },
                        validate: validateQty,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="slitted-quantity">
                            Quantity *{selectedItem ? ` (Available: ${availableQty})` : ''}
                          </CustomFormLabel>
                          <CustomTextField
                            {...field}
                            id="slitted-quantity"
                            fullWidth
                            type="number"
                            placeholder="Number of slitted pieces"
                            error={!!error}
                            helperText={error?.message}
                            onChange={(e) => { field.onChange(e); trigger('slittedQuantity'); }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="slittedSize"
                      control={control}
                      rules={{
                        required: 'Size is required',
                        validate: validateSize,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="slitted-size">
                            Size per Piece *{selectedItem ? ` (Available: ${availableLength} ft)` : ''}
                          </CustomFormLabel>
                          <CustomTextField
                            {...field}
                            id="slitted-size"
                            fullWidth
                            placeholder="e.g., 90 ft"
                            error={!!error}
                            helperText={error?.message}
                            onChange={(e) => { field.onChange(e); trigger('slittedSize'); }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                </>
              )}

              {/* ── READY CHANNEL fields ── */}
              {targetState === 'Ready Channel' && (
                <>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="readyChannelLength"
                      control={control}
                      rules={{ required: 'Channel Length is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="ready-channel-length">Length per Piece *</CustomFormLabel>
                          <CustomSelect
                            {...field}
                            id="ready-channel-length"
                            fullWidth
                            displayEmpty
                            error={!!error}
                            sx={{ borderRadius: '8px' }}
                          >
                            {READY_CHANNEL_LENGTH_OPTIONS.map((opt) => (
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

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="slittedQuantity"
                      control={control}
                      rules={{
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Must be at least 1' },
                        validate: validateQty,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="rc-quantity">
                            Quantity *{selectedItem ? ` (Available: ${availableQty})` : ''}
                          </CustomFormLabel>
                          <CustomTextField
                            {...field}
                            id="rc-quantity"
                            fullWidth
                            type="number"
                            placeholder="Number of pieces"
                            error={!!error}
                            helperText={error?.message}
                            onChange={(e) => { field.onChange(e); trigger('slittedQuantity'); }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="slittedSize"
                      control={control}
                      rules={{
                        required: 'Size is required',
                        validate: validateSize,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="rc-size">
                            Size per Piece *{selectedItem ? ` (Available: ${availableLength} ft)` : ''}
                          </CustomFormLabel>
                          <CustomTextField
                            {...field}
                            id="rc-size"
                            fullWidth
                            placeholder="e.g., 90 ft"
                            error={!!error}
                            helperText={error?.message}
                            onChange={(e) => { field.onChange(e); trigger('slittedSize'); }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                </>
              )}

              {/* ── Output Preview ── */}
              {selectedItem && (
                <Grid item xs={12}>
                  <OutputPreview
                    selectedItem={selectedItem}
                    targetState={targetState}
                    slittedQuantity={slittedQuantity}
                    slittedSize={slittedSize}
                    readyChannelLength={readyChannelLength}
                  />
                </Grid>
              )}

              {/* ── Waste Tracking ── */}
              <SectionHeading title="Waste Tracking" color="error.main" />
              <Grid item xs={12} md={4}>
                <Controller
                  name="wasteQuantity"
                  control={control}
                  rules={{ min: { value: 0, message: 'Cannot be negative' } }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="waste-quantity">Waste Quantity</CustomFormLabel>
                      <CustomTextField
                        {...field}
                        id="waste-quantity"
                        fullWidth
                        type="number"
                        placeholder="Quantity of waste"
                        error={!!error}
                        helperText={error?.message}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Box>
                  )}
                />
              </Grid>
            </>
         

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
                disabled={loading || (selectedType === 'Order' && !orderDetails)}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
                sx={{ borderRadius: '8px', minWidth: 160 }}
              >
                {loading
                  ? isEdit ? 'Updating...' : 'Creating...'
                  : isEdit ? 'Update Production' : 'Confirm Production'}
              </Button>
            </Box>
          </Grid>

        </Grid>
      </form>
    </Paper>
  );
};

export default ProductionForm;