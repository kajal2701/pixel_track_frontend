import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Typography, Box, Stack,
  CircularProgress, Alert, Divider, Chip,
} from '@mui/material';
import { SwapHoriz, ColorLens, CheckCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import toast from 'react-hot-toast';
import inventoryService from 'src/services/inventoryService';
import productService from 'src/services/productService';

const ConvertColorDialog = ({ open, onClose, inventoryList, onConvertSuccess }) => {
  const { palette } = useTheme();

  const [inventoryType, setInventoryType] = useState('Full Roll');
  const [fromInventoryId, setFromInventoryId] = useState('');
  const [toColorName, setToColorName] = useState('');
  const [quantity, setQuantity] = useState('');

  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch products when dialog opens
  useEffect(() => {
    if (open) {
      setInventoryType('Full Roll');
      setFromInventoryId('');
      setToColorName('');
      setQuantity('');
      setShowConfirm(false);

      setLoadingProducts(true);
      productService.getAllProducts()
        .then((res) => setAllProducts(res.data || []))
        .catch((err) => {
          toast.error(err.message || 'Failed to load products');
        })
        .finally(() => setLoadingProducts(false));
    }
  }, [open]);

  // Filter available source inventory items based on selected type
  const availableInventory = useMemo(() => {
    if (!inventoryList) return [];
    return inventoryList.filter(
      (item) => item.inventory_type === inventoryType && parseInt(item.available_quantity) > 0
    );
  }, [inventoryList, inventoryType]);

  const selectedFromItem = useMemo(() => {
    return availableInventory.find((item) => item.id === fromInventoryId) || null;
  }, [availableInventory, fromInventoryId]);

  // Handle inventory type change
  const handleTypeChange = (e) => {
    setInventoryType(e.target.value);
    setFromInventoryId('');
    setToColorName('');
    setQuantity('');
    setShowConfirm(false);
  };

  // Handle from inventory change
  const handleFromChange = (e) => {
    setFromInventoryId(e.target.value);
    setToColorName('');
    setQuantity('');
    setShowConfirm(false);
  };

  // Available target colors based on the selected supplier (from the chosen inventory)
  const availableColors = useMemo(() => {
    if (!selectedFromItem) return [];
    const supplierProducts = allProducts.filter(
      (p) => String(p.manufacturer).trim().toLowerCase() === String(selectedFromItem.supplier).trim().toLowerCase()
    );
    // Get unique colors from this supplier, excluding the current color
    const colorsMap = new Map();
    supplierProducts.forEach(p => {
      if (
        p.color &&
        p.color_code &&
        String(p.color).toLowerCase() !== String(selectedFromItem.color_name).toLowerCase()
      ) {
        colorsMap.set(p.color, p.color_code);
      }
    });
    return Array.from(colorsMap.entries()).map(([color_name, color_code]) => ({
      color_name,
      color_code,
    })).sort((a, b) => a.color_name.localeCompare(b.color_name));
  }, [selectedFromItem, allProducts]);

  const handleToColorChange = (e) => {
    setToColorName(e.target.value);
    setShowConfirm(false);
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setQuantity(val);
    setShowConfirm(false);
  };

  const maxQty = selectedFromItem ? parseInt(selectedFromItem.available_quantity) : 0;
  const qtyNum = parseInt(quantity);
  const isValid = fromInventoryId && toColorName && quantity && qtyNum > 0 && qtyNum <= maxQty;

  const handleTransferClick = () => {
    if (!isValid) return;
    setShowConfirm(true);
  };

  const handleConfirmTransfer = async () => {
    setSubmitting(true);
    try {
      const selectedColorObj = availableColors.find(c => c.color_name === toColorName);

      const payload = {
        from_id: fromInventoryId,
        to_color_name: selectedColorObj.color_name,
        to_color_code: selectedColorObj.color_code,
        quantity: qtyNum,
      };

      const result = await inventoryService.convertColor(payload);
      toast.success(result.message || 'Color converted successfully');
      onConvertSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Conversion failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setShowConfirm(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px' } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ColorLens sx={{ color: palette.secondary.main }} />
          <Typography variant="h6" fontWeight={700}>Convert Color Roll</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Transfer quantity from one color roll to another color for the same physical roll.
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {loadingProducts ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {/* Inventory Type */}
            <TextField
              select
              label="Select Roll Type"
              value={inventoryType}
              onChange={handleTypeChange}
              fullWidth
            >
              <MenuItem value="Full Roll">Full Roll</MenuItem>
              <MenuItem value="Slitted">Slitted</MenuItem>
            </TextField>

            {/* From Inventory */}
            <TextField
              select
              label="From (Source Color)"
              value={fromInventoryId}
              onChange={handleFromChange}
              fullWidth
              helperText={availableInventory.length === 0 ? `No available ${inventoryType} inventory` : ''}
            >
              {availableInventory.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="body2">
                      {item.supplier} - {item.color_name} ({item.color_code}) {item.size ? `[${item.size} ft]` : ''}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      <strong>{item.available_quantity} avail</strong>
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>

            {/* To Color */}
            <TextField
              select
              label="To (Destination Color)"
              value={toColorName}
              onChange={handleToColorChange}
              fullWidth
              disabled={!fromInventoryId}
              helperText={
                selectedFromItem && availableColors.length === 0
                  ? 'No other colors found for this supplier in the product list'
                  : ''
              }
            >
              {availableColors.map((opt) => (
                <MenuItem key={opt.color_name} value={opt.color_name}>
                  {opt.color_name} ({opt.color_code})
                </MenuItem>
              ))}
            </TextField>

            {/* Quantity */}
            <TextField
              label={inventoryType === 'Full Roll' ? 'Number of Rolls' : 'Number of Slits'}
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              fullWidth
              disabled={!fromInventoryId || !toColorName}
              helperText={maxQty > 0 ? `Max transferable: ${maxQty}` : ''}
              inputProps={{ inputMode: 'numeric' }}
              error={quantity && (qtyNum > maxQty || qtyNum <= 0)}
            />

            {/* Confirmation summary */}
            {showConfirm && isValid && selectedFromItem && (
              <Alert
                severity="info"
                sx={{ borderRadius: '10px' }}
                icon={<SwapHoriz />}
              >
                <Typography variant="body2" fontWeight={600}>
                  Convert {quantity} {inventoryType === 'Full Roll' ? 'Roll(s)' : 'Slit(s)'} of {selectedFromItem.color_name} to {toColorName}?
                </Typography>
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={submitting} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        {!showConfirm ? (
          <Button
            variant="contained"
            onClick={handleTransferClick}
            disabled={!isValid || loadingProducts}
            startIcon={<SwapHoriz />}
            sx={{
              borderRadius: '8px',
              backgroundColor: palette.secondary.main,
              '&:hover': { backgroundColor: palette.secondary.dark },
            }}
          >
            Convert Color
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleConfirmTransfer}
            disabled={submitting}
            color="success"
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
            sx={{ borderRadius: '8px' }}
          >
            {submitting ? 'Converting...' : 'Confirm Conversion'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConvertColorDialog;
