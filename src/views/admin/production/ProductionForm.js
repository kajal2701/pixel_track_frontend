import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, Button, Paper, Grid, MenuItem,
  FormHelperText, RadioGroup, FormControlLabel, Radio,
  FormControl, CircularProgress, Divider, Alert, Chip, Stack
} from '@mui/material';
import { Save, Cancel, InfoOutlined, ArrowForward } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';
import inventoryService from '../../../services/inventoryService';
import productService from '../../../services/productService';
import adminUserService from '../../../services/adminUserService';
import toast from 'react-hot-toast';
import { CHANNEL_LENGTH_OPTIONS, getPieceLength } from 'src/utils/helpers';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_VALUES = {
  productionType: 'General Inventory',
  orderNumber: '',
  rawMaterial: '',
  targetState: 'Ready Channel',
  qty: '',
  size: '',
  channelLength: '',
  wasteQty: 0,
  assignee: '',
  notes: '',
};

// ─── Output Preview ─────────────────────────────────────────────────────────

const OutputPreview = ({ preview }) => {
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

// ─── Main Component ────────────────────────────────────────────────────────────

const ProductionForm = ({ production, onSubmit, loading, isEdit = false, onCancel }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [productionTechUsers, setProductionTechUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

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
  const selectedType = watch('productionType');
  const targetState = watch('targetState');
  const selectedRawMaterial = watch('rawMaterial');
  const qty = watch('qty');
  const size = watch('size');
  const channelLength = watch('channelLength');

  // ── Reset on edit/new ──
  useEffect(() => {

    if (production && isEdit) {
      reset({
        productionType: production.productionType || 'General Inventory',
        orderNumber: production.orderNumber || '',
        rawMaterial: production.rawMaterial || '',
        targetState: production.targetState || 'Ready Channel',
        qty: production.qty || '',
        size: production.size || '',
        channelLength: production.channelLength || '',
        wasteQty: production.wasteQty || 0,
        assignee: production.assignee || '',
        notes: production.notes || '',
      });
    } else if (!isEdit) {
      reset(DEFAULT_VALUES);
    }
  }, [production, isEdit, reset]);

  // ── Fetch inventory ──
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

  // ── Fetch products for supplier config ──
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        setAllProducts(response.data || []);
      } catch (err) { /* silent */ }
    };
    fetchProducts();
  }, []);

  // ── Fetch production tech users for assignee dropdown ──
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminUserService.getProductionTechUsers();
        setProductionTechUsers(response.data || []);
      } catch (err) { /* silent */ }
    };
    fetchUsers();
  }, []);

  // ── Selected inventory item ──
  const selectedItem = useMemo(
    () => inventoryItems.find((i) => i.id === selectedRawMaterial) || null,
    [inventoryItems, selectedRawMaterial]
  );

  // ── Derive supplier config from selected item's supplier ──
  const supplierConfig = useMemo(() => {
    if (!selectedItem?.supplier) return { full_roll_length: 98, slits_per_roll: 6, slitted_roll_length: 98 };
    const match = allProducts.find(
      (p) => p.manufacturer && p.manufacturer.toLowerCase().trim() === selectedItem.supplier.toLowerCase().trim()
    );
    return match
      ? { full_roll_length: match.full_roll_length || 98, slits_per_roll: match.slits_per_roll || 6, slitted_roll_length: match.slitted_roll_length || 98 }
      : { full_roll_length: 98, slits_per_roll: 6, slitted_roll_length: 98 };
  }, [selectedItem, allProducts]);

  // ── Filtered inventory: only Full Roll + Slitted with available stock > 0 (or currently selected) ──
  const filteredInventory = useMemo(
    () => inventoryItems.filter((item) =>
      (item.inventory_type === 'Full Roll' || item.inventory_type === 'Slitted') &&
      ((parseFloat(item.available_quantity) || 0) > 0 || String(item.id) === String(selectedRawMaterial))
    ),
    [inventoryItems, selectedRawMaterial]
  );

  // ── Effective available quantity (adds back currently-held qty when editing same item) ──
  const effectiveAvailable = useMemo(() => {
    if (!selectedItem) return 0;
    const base = parseFloat(selectedItem.available_quantity ?? selectedItem.quantity ?? 0);
    const heldBack = isEdit && String(selectedItem.id) === String(production?.rawMaterial)
      ? Number(production?.qty || 0)
      : 0;
    return base + heldBack;
  }, [selectedItem, isEdit, production]);

  const getInventoryLabel = (item) => {
    const type = item.inventory_type || '';
    const color = item.color_name ? `${item.color_name} (${item.color_code || ''})` : '';
    const mfr = item.supplier || '';
    return `${type} — ${color}${mfr ? ` · ${mfr}` : ''}`;
  };

  // ── Auto-fill size from selected raw material ──
  useEffect(() => {
    if (!selectedItem || isEdit) return;
    const sz = selectedItem.size ? `${selectedItem.size} ft` : '';
    setValue('size', sz);
    trigger('size');
  }, [selectedItem, isEdit, setValue, trigger]);

  // ── Preview & Waste Calculation ──
  const preview = useMemo(() => {
    if (!selectedItem) return null;

    const qtyNum = parseInt(qty) || 0;
    const sizeMatch = (size || '').match(/[\d.]+/);
    const sizeNum = sizeMatch ? parseFloat(sizeMatch[0]) : 0;

    if (qtyNum <= 0 || sizeNum <= 0) {
      return {
        inputLabel: `${selectedItem.inventory_type} — ${selectedItem.color_name || ''}`,
        outputLabel: 'Enter qty & size to see output',
        valid: true,
      };
    }

    const totalRawFeet = qtyNum * sizeNum;

    if (targetState === 'Ready Channel') {
      const chLen = getPieceLength(channelLength);
      if (chLen > 0) {
        // Use supplier config for tracks per slit
        const slitLen = supplierConfig?.slitted_roll_length || sizeNum;
        const tracksPerSlit = Math.floor(slitLen / chLen);
        const outputPieces = qtyNum * tracksPerSlit;
        const wastePerSlit = slitLen - (tracksPerSlit * chLen);
        const totalWaste = (qtyNum * wastePerSlit).toFixed(2);
        return {
          inputLabel: `${qtyNum} slit(s) × ${slitLen} ft`,
          outputLabel: `${outputPieces} ready channel(s) @ ${chLen} ft each, ~${totalWaste} ft waste`,
          valid: outputPieces > 0,
          totalWaste,
        };
      }
      return {
        inputLabel: `${qtyNum} × ${sizeNum} ft = ${totalRawFeet} ft`,
        outputLabel: 'Select channel length to see output',
        valid: true,
      };
    }

    if (targetState === 'Slitted') {
      const slitsPerRoll = supplierConfig?.slits_per_roll || 6;
      const slitLength = supplierConfig?.slitted_roll_length || sizeNum;
      const outputPieces = qtyNum * slitsPerRoll;
      return {
        inputLabel: `${qtyNum} roll(s) × ${sizeNum} ft`,
        outputLabel: `${outputPieces} slitted roll(s), ${slitLength} ft each`,
        valid: true,
      };
    }

    return null;
  }, [selectedItem, targetState, qty, size, channelLength, supplierConfig]);

  // ── Auto-fill wasteQty from preview ──
  useEffect(() => {
    if (isEdit) return;
    if (preview && preview.totalWaste !== undefined) {
      setValue('wasteQty', preview.totalWaste);
      trigger('wasteQty');
    } else {
      setValue('wasteQty', '0');
    }
  }, [preview, isEdit, setValue, trigger]);

  // ── Submit ──
  const onFormSubmit = (data) => {
    onSubmit({
      productionType: data.productionType,
      orderNumber: data.orderNumber?.trim(),
      rawMaterial: data.rawMaterial,
      targetState: data.targetState,
      qty: Number(data.qty) || 0,
      size: data.size?.trim(),
      channelLength: data.channelLength,
      wasteQty: Number(data.wasteQty) || 0,
      assignee: data.assignee || null,
      notes: data.notes?.trim(),
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
                      <FormControlLabel value="General Inventory" control={<Radio />} label="General Inventory" />
                      <FormControlLabel value="Specific Order" control={<Radio />} label="Specific Order" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>

          {/* ── Order Number (only for Specific Order) ── */}
          {selectedType === 'Specific Order' && (
            <Grid item xs={12} md={6}>
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
                      placeholder="e.g., ORD-1776521329-1"
                      error={!!error}
                      helperText={error?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Box>
                )}
              />
            </Grid>
          )}

          {/* ── Raw Material ── */}
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

          {/* ── Target State ── */}
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
                    <MenuItem value="Ready Channel">Ready Channel</MenuItem>
                    <MenuItem value="Slitted">Slitted</MenuItem>
                  </CustomSelect>
                  {error && <FormHelperText error>{error.message}</FormHelperText>}
                </Box>
              )}
            />
          </Grid>

          {/* ── Qty & Size (always shown) ── */}
          <SectionHeading title="Production Details" />

          <Grid item xs={12} md={targetState === 'Ready Channel' ? 3 : 6}>
            <Controller
              name="qty"
              control={control}
              rules={{
                required: 'Quantity is required',
                min: { value: 1, message: 'Must be at least 1' },
                validate: (value) => {
                  if (!selectedItem) return true;
                  return Number(value) <= effectiveAvailable || `Cannot exceed available quantity (${effectiveAvailable})`;
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <CustomFormLabel htmlFor="prod-qty">
                    Quantity *{selectedItem ? ` (Available: ${effectiveAvailable})` : ''}
                  </CustomFormLabel>
                  <CustomTextField
                    {...field}
                    id="prod-qty"
                    fullWidth
                    type="number"
                    placeholder="Number of rolls/pieces"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12} md={targetState === 'Ready Channel' ? 3 : 6}>
            <Controller
              name="size"
              control={control}
              rules={{
                required: 'Size is required',
                validate: (value) => {
                  if (!selectedItem || !selectedItem.size) return true;
                  const availableSize = parseFloat(selectedItem.size);
                  const enteredSize = parseFloat((value || '').toString().match(/[\d.]+/)?.[0] || 0);
                  // For size, we don't strictly need to add back production.size unless it was a partial roll hold, but it's safe to bypass or use the max roll size.
                  // Since size represents the physical roll size, availableSize from the selected item is the max.
                  return enteredSize <= availableSize || `Cannot exceed available size (${availableSize} ft)`;
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <CustomFormLabel htmlFor="prod-size">
                    Size *{selectedItem ? ` (Available: ${selectedItem.size || 0} ft)` : ''}
                  </CustomFormLabel>
                  <CustomTextField
                    {...field}
                    id="prod-size"
                    fullWidth
                    placeholder="e.g., 90 ft"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
              )}
            />
          </Grid>

          {/* ── Channel Length (only for Ready Channel) ── */}
          {targetState === 'Ready Channel' && (
            <>
              <Grid item xs={12} md={3}>
                <Controller
                  name="channelLength"
                  control={control}
                  rules={{ required: 'Channel Length is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="channel-length">Channel Length *</CustomFormLabel>
                      <CustomSelect
                        {...field}
                        id="channel-length"
                        fullWidth
                        displayEmpty
                        error={!!error}
                        sx={{ borderRadius: '8px' }}
                      >
                        {CHANNEL_LENGTH_OPTIONS.map((opt) => (
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

              <Grid item xs={12} md={3}>
                <Controller
                  name="wasteQty"
                  control={control}
                  rules={{ min: { value: 0, message: 'Cannot be negative' } }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="waste-qty">Waste Qty</CustomFormLabel>
                      <CustomTextField
                        {...field}
                        id="waste-qty"
                        fullWidth
                        type="number"
                        placeholder="0"
                        error={!!error}
                        helperText={error?.message}
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
            <Grid item xs={12} sx={{ mt: 2 }}>
              <OutputPreview preview={preview} />
            </Grid>
          )}

          {/* ── Notes ── */}
          <SectionHeading title="Additional Information" />

          <Grid item xs={12} md={6}>
            <Controller
              name="assignee"
              control={control}
              rules={{ required: 'Assign is required' }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <CustomFormLabel htmlFor="assignee">Assign *</CustomFormLabel>
                  <CustomSelect
                    {...field}
                    id="assignee"
                    fullWidth
                    displayEmpty
                    error={!!error}
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="" disabled>Select Assign</MenuItem>
                    {productionTechUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {error && <FormHelperText error>{error.message}</FormHelperText>}
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Box>
                  <CustomFormLabel htmlFor="notes">Notes</CustomFormLabel>
                  <CustomTextField
                    {...field}
                    id="notes"
                    fullWidth
                    placeholder="Any additional notes"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
              )}
            />
          </Grid>

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
                disabled={loading}
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