import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Typography, Box, Stack,
  CircularProgress, Alert, Divider, Chip,
} from '@mui/material';
import { SwapHoriz, Inventory2, Lock, CheckCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import toast from 'react-hot-toast';
import inventoryService from 'src/services/inventoryService';
import { LOCATION_OPTIONS } from 'src/utils/helpers';

const TransferStockDialog = ({ open, onClose, variant, onTransferSuccess }) => {
  const { palette } = useTheme();

  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [quantity, setQuantity] = useState('');

  // Fetch stock breakdown when dialog opens
  useEffect(() => {
    if (open && variant?.id) {
      setLoading(true);
      setBreakdown(null);
      setFromLocation('');
      setToLocation('');
      setQuantity('');
      setShowConfirm(false);

      inventoryService.getStockBreakdown(variant.id)
        .then((res) => setBreakdown(res.data))
        .catch((err) => {
          toast.error(err.message || 'Failed to load stock breakdown');
          onClose();
        })
        .finally(() => setLoading(false));
    }
  }, [open, variant?.id]);

  // Get locations that have stock > 0
  const fromLocations = breakdown
    ? Object.entries(breakdown)
        .filter(([, info]) => info.total > 0)
        .map(([loc, info]) => ({ value: loc, ...info }))
    : [];

  // Get the selected from location info
  const selectedFromInfo = fromLocation && breakdown ? breakdown[fromLocation] : null;
  const maxQty = selectedFromInfo ? selectedFromInfo.available : 0;

  // To locations: all master locations except the selected "From"
  const toLocations = LOCATION_OPTIONS.filter((opt) => opt.value !== fromLocation);

  // Get short label for a location
  const getLocationLabel = (locValue) => {
    const opt = LOCATION_OPTIONS.find((o) => o.value === locValue);
    return opt ? opt.label : locValue;
  };

  const handleFromChange = (e) => {
    setFromLocation(e.target.value);
    setToLocation('');
    setQuantity('');
    setShowConfirm(false);
  };

  const handleToChange = (e) => {
    setToLocation(e.target.value);
    setShowConfirm(false);
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setQuantity(val);
    setShowConfirm(false);
  };

  const isValid = fromLocation && toLocation && quantity && parseInt(quantity) > 0 && parseInt(quantity) <= maxQty;

  const handleTransferClick = () => {
    if (!isValid) return;
    setShowConfirm(true);
  };

  const handleConfirmTransfer = async () => {
    setSubmitting(true);
    try {
      const result = await inventoryService.transferStock(variant.id, {
        from_location: fromLocation,
        to_location: toLocation,
        quantity: parseInt(quantity),
      });
      toast.success(result.message || 'Transfer successful');
      onTransferSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Transfer failed');
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
          <SwapHoriz sx={{ color: palette.warning.main }} />
          <Typography variant="h6" fontWeight={700}>Transfer Stock</Typography>
        </Stack>
        {variant && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {variant.length ?? '—'} ft | Hole {variant.hole_distance} | {variant.pieces} total pcs
          </Typography>
        )}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {/* From Location */}
            <TextField
              select
              label="From Location"
              value={fromLocation}
              onChange={handleFromChange}
              fullWidth
              helperText={fromLocations.length === 0 ? 'No locations have stock' : ''}
            >
              {fromLocations.map((loc) => (
                <MenuItem key={loc.value} value={loc.value}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="body2">{getLocationLabel(loc.value)}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {loc.total} total, {loc.dispatched_held} held, <strong>{loc.available} avail</strong>
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>

            {/* Info box when From is selected */}
            {selectedFromInfo && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  backgroundColor: palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
                  <Chip
                    icon={<Inventory2 sx={{ fontSize: 16 }} />}
                    label={`Total: ${selectedFromInfo.total}`}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: '8px' }}
                  />
                  <Chip
                    icon={<Lock sx={{ fontSize: 16 }} />}
                    label={`Dispatched Held: ${selectedFromInfo.dispatched_held}`}
                    size="small"
                    color={selectedFromInfo.dispatched_held > 0 ? 'warning' : 'default'}
                    variant="outlined"
                    sx={{ borderRadius: '8px' }}
                  />
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 16 }} />}
                    label={`Available: ${selectedFromInfo.available}`}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ borderRadius: '8px' }}
                  />
                </Stack>
              </Box>
            )}

            {/* To Location */}
            <TextField
              select
              label="To Location"
              value={toLocation}
              onChange={handleToChange}
              fullWidth
              disabled={!fromLocation}
            >
              {toLocations.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Quantity */}
            <TextField
              label="Quantity (pcs)"
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              fullWidth
              disabled={!fromLocation || !toLocation}
              helperText={maxQty > 0 ? `Max transferable: ${maxQty} pcs` : fromLocation ? 'No available stock to transfer' : ''}
              inputProps={{ inputMode: 'numeric' }}
              error={quantity && (parseInt(quantity) > maxQty || parseInt(quantity) <= 0)}
            />

            {/* Confirmation summary */}
            {showConfirm && isValid && (
              <Alert
                severity="info"
                sx={{ borderRadius: '10px' }}
                icon={<SwapHoriz />}
              >
                <Typography variant="body2" fontWeight={600}>
                  Transfer {quantity} pcs: {getLocationLabel(fromLocation)} → {getLocationLabel(toLocation)}?
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
            disabled={!isValid || loading}
            startIcon={<SwapHoriz />}
            sx={{
              borderRadius: '8px',
              backgroundColor: palette.warning.main,
              '&:hover': { backgroundColor: palette.warning.dark },
            }}
          >
            Transfer
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
            {submitting ? 'Transferring...' : 'Confirm Transfer'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TransferStockDialog;
