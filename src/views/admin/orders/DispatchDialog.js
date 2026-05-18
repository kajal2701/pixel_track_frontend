import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, TextField, MenuItem,
  Stack, Chip, CircularProgress, IconButton,
  LinearProgress,
} from '@mui/material';
import { LocalShipping, Store, LocationOn, Close, Inventory, InfoOutlined } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { LOCATION_OPTIONS } from 'src/utils/helpers';
import orderService from 'src/services/orderService';

const DispatchDialog = ({ open, order, onClose, onConfirm, loading }) => {
  const { palette } = useTheme();
  const [destination, setDestination] = useState('');
  const [sourceLocation, setSourceLocation] = useState('');
  const [inventoryLocations, setInventoryLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  const isPickup = order?.delivery_method === 'pickup';

  // Pre-fill destination from order's existing location
  useEffect(() => {
    if (order) {
      if (isPickup) {
        setDestination(order.pickup_location || '');
      } else {
        setDestination(order.delivery_address || '');
      }
    }
  }, [order, isPickup]);

  // Fetch inventory locations when dialog opens
  useEffect(() => {
    if (open && order?.id) {
      setLocationsLoading(true);
      setSourceLocation('');
      setInventoryLocations([]);
      orderService.getInventoryLocations(order.id)
        .then((res) => {
          const locs = res.data || [];
          setInventoryLocations(locs);
          // Auto-select first location with stock
          const firstWithStock = locs.find((l) => l.pieces > 0);
          if (firstWithStock) setSourceLocation(firstWithStock.location);
        })
        .catch(() => setInventoryLocations([]))
        .finally(() => setLocationsLoading(false));
    }
  }, [open, order?.id]);

  const handleConfirm = () => {
    if (!destination.trim()) return;
    onConfirm(order, destination.trim(), sourceLocation || undefined);
  };

  // ── Stock calculations ──
  const orderQty = parseInt(order?.total_pieces) || 0;
  const selectedStock = inventoryLocations.find((l) => l.location === sourceLocation);
  const locationPieces = selectedStock ? parseInt(selectedStock.pieces) || 0 : 0;
  // System-wide available = total_pieces - held_pieces (across all locations)
  const totalPieces = selectedStock ? parseInt(selectedStock.total_pieces) || 0 : 0;
  const totalHeld = selectedStock ? parseInt(selectedStock.held_pieces) || 0 : 0;
  const systemAvailable = Math.max(0, totalPieces - totalHeld);

  // ── Destination stock calculations ──
  // Check how many pieces already exist at the destination (pickup location)
  const destStock = inventoryLocations.find((l) => l.location === destination);
  const destPhysicalPieces = destStock ? parseInt(destStock.pieces) || 0 : 0;
  // Pieces held by other dispatched orders at the destination
  const destHeldByOthers = destStock ? parseInt(destStock.held_pieces) || 0 : 0;
  // Available at destination = physical - held by others
  const destAvailable = Math.max(0, destPhysicalPieces - destHeldByOthers);
  // How many pieces need to be transferred from source
  const needToTransfer = Math.max(0, orderQty - destAvailable);
  // Remaining at source after transfer
  const sourceRemaining = Math.max(0, locationPieces - needToTransfer);

  // Check if source has enough for the transfer needed
  const sourceInsufficient = sourceLocation && destination && orderQty > 0 && needToTransfer > 0 && locationPieces < needToTransfer;
  // System-wide check
  const systemInsufficient = sourceLocation && orderQty > 0 && systemAvailable < orderQty;
  const insufficientStock = sourceInsufficient || systemInsufficient;

  // Show stock breakdown only when both source and destination are selected (pickup only)
  const showBreakdown = isPickup && sourceLocation && destination && orderQty > 0 && !locationsLoading;
  // No transfer needed if destination already has enough
  const noTransferNeeded = showBreakdown && needToTransfer === 0;

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {isPickup
            ? <Store sx={{ color: palette.info.main, fontSize: 28 }} />
            : <LocalShipping sx={{ color: palette.success.main, fontSize: 28 }} />
          }
          <Typography variant="h5" fontWeight={700}>
            {isPickup ? 'Transfer to Pickup Location' : 'Dispatch for Delivery'}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Order summary */}
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: '10px', mb: 2.5 }}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Order: <strong>{order.order_id}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer: <strong>{order.contact_name}</strong> ({order.company_name || '—'})
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Typography variant="body2" color="text.secondary">
                Color: <strong>{order.color || '—'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pieces: <strong>{order.total_pieces ?? '—'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Final: <strong>{order.final_length ? `${order.final_length}` : '—'}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
              <Chip
                label={order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'}
                color={order.delivery_method === 'pickup' ? 'info' : 'success'}
                size="small"
                icon={order.delivery_method === 'pickup' ? <Store /> : <LocalShipping />}
                sx={{ fontWeight: 600 }}
              />
              {order.pickup_date && (
                <Typography variant="caption" color="text.secondary">
                  {order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'} Date: <strong>{new Date(order.pickup_date).toLocaleDateString()}</strong>
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Pick From Location (source inventory location) */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
            <Inventory sx={{ fontSize: 18, color: palette.primary.main }} />
            <Typography variant="subtitle2" fontWeight={600}>Pick From Location *</Typography>
          </Stack>
          {locationsLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">Loading locations...</Typography>
            </Box>
          ) : inventoryLocations.length > 0 ? (
            <TextField
              select
              fullWidth
              value={sourceLocation}
              onChange={(e) => setSourceLocation(e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              {inventoryLocations.map((loc) => (
                <MenuItem
                  key={loc.location}
                  value={loc.location}
                  disabled={loc.pieces <= 0}
                >
                  {loc.location} &nbsp;({loc.pieces} pcs available)
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              No inventory locations found for this order.
            </Typography>
          )}
        </Box>

        {/* Destination (editable) */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
            <LocationOn sx={{ fontSize: 18, color: isPickup ? palette.info.main : palette.success.main }} />
            <Typography variant="subtitle2" fontWeight={600}>
              {isPickup ? 'Transfer To *' : 'Deliver To *'}
            </Typography>
          </Stack>

          {isPickup ? (
            // Pickup: dropdown of predefined locations
            <TextField
              select
              fullWidth
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              size="small"
              placeholder="Select pickup location"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              {LOCATION_OPTIONS.filter(opt => opt.value !== 'Warehouse').map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          ) : (
            // Delivery: editable text field
            <TextField
              fullWidth
              multiline
              rows={2}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              size="small"
              placeholder="Enter delivery address"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          )}
        </Box>

        {/* ── Stock Availability Breakdown (only for pickup when both selected) ── */}
        {showBreakdown && (
          <Box sx={{
            p: 2, mb: 2, borderRadius: '10px',
            bgcolor: insufficientStock
              ? alpha(palette.error.main, 0.04)
              : noTransferNeeded
                ? alpha(palette.info.main, 0.04)
                : alpha(palette.success.main, 0.04),
            border: '1px solid',
            borderColor: insufficientStock
              ? alpha(palette.error.main, 0.2)
              : noTransferNeeded
                ? alpha(palette.info.main, 0.2)
                : alpha(palette.success.main, 0.2),
          }}>
            <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
              <InfoOutlined sx={{
                fontSize: 18,
                color: insufficientStock ? palette.error.main : noTransferNeeded ? palette.info.main : palette.success.main,
              }} />
              <Typography variant="subtitle2" fontWeight={700}
                color={insufficientStock ? 'error.main' : noTransferNeeded ? 'info.main' : 'success.main'}
              >
                Stock Availability for This Order
              </Typography>
            </Stack>

            {/* Stock details grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {/* Row 1: Order Needs | At Destination (physical) */}
              <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary.main">{orderQty}</Typography>
                <Typography variant="caption" color="text.secondary">Order Needs</Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="text.secondary">{destPhysicalPieces}</Typography>
                <Typography variant="caption" color="text.secondary">At Destination (physical)</Typography>
              </Box>

              {/* Row 2: Held by Others (at dest) | Available at Destination */}
              <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700}
                  color={destHeldByOthers > 0 ? 'warning.main' : 'text.secondary'}
                >{destHeldByOthers}</Typography>
                <Typography variant="caption" color="text.secondary">Held by Others (at dest)</Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700}
                  color={destAvailable >= orderQty ? 'success.main' : destAvailable > 0 ? 'info.main' : 'text.secondary'}
                >{destAvailable}</Typography>
                <Typography variant="caption" color="text.secondary">Available at Destination</Typography>
              </Box>

              {/* Row 3: Will Transfer | Source Remaining */}
              <Box sx={{
                p: 1.5, borderRadius: '8px', textAlign: 'center',
                bgcolor: needToTransfer > 0 ? alpha(palette.info.main, 0.08) : 'background.paper',
                border: needToTransfer > 0 ? `1px solid ${alpha(palette.info.main, 0.2)}` : 'none',
              }}>
                <Typography variant="h5" fontWeight={700}
                  color={needToTransfer > 0 ? 'info.main' : 'success.main'}
                >{needToTransfer}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {needToTransfer > 0 ? 'Will Transfer' : 'No Transfer Needed'}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="text.secondary">{sourceRemaining}</Typography>
                <Typography variant="caption" color="text.secondary">Source After Transfer</Typography>
              </Box>
            </Box>

            {/* Status message */}
            {insufficientStock && (
              <Box sx={{ mt: 1.5, p: 1, bgcolor: alpha(palette.error.main, 0.08), borderRadius: '6px' }}>
                <Typography variant="caption" color="error.main" fontWeight={600}>
                  {sourceInsufficient
                    ? `⚠ Insufficient stock at source! Need to transfer ${needToTransfer} pcs but source only has ${locationPieces} pcs. Short by ${needToTransfer - locationPieces} pcs.`
                    : `⚠ Insufficient available stock! Only ${systemAvailable} pcs available system-wide (${totalHeld} pcs held by other orders).`}
                </Typography>
              </Box>
            )}
            {!insufficientStock && noTransferNeeded && (
              <Box sx={{ mt: 1.5, p: 1, bgcolor: alpha(palette.info.main, 0.08), borderRadius: '6px' }}>
                <Typography variant="caption" color="info.main" fontWeight={600}>
                  ✓ Destination already has {destAvailable} pcs available — sufficient for this order. No stock transfer needed.
                </Typography>
              </Box>
            )}
            {!insufficientStock && !noTransferNeeded && (
              <Box sx={{ mt: 1.5, p: 1, bgcolor: alpha(palette.success.main, 0.08), borderRadius: '6px' }}>
                <Typography variant="caption" color="success.main" fontWeight={600}>
                  ✓ {destAvailable > 0
                    ? `${destAvailable} pcs already at destination. Only ${needToTransfer} pcs will be transferred from ${sourceLocation}.`
                    : `${needToTransfer} pcs will be transferred from ${sourceLocation}.`}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Non-pickup stock warning (delivery orders) */}
        {!isPickup && sourceLocation && orderQty > 0 && insufficientStock && (
          <Typography variant="caption" color="error" fontWeight={500} sx={{ mt: 0.5, mb: 2, display: 'block' }}>
            {locationPieces < orderQty
              ? `⚠ Insufficient stock! This location has ${locationPieces} pcs but order needs ${orderQty} pcs.`
              : `⚠ Insufficient available stock! Only ${systemAvailable} pcs available system-wide (${totalHeld} pcs held by other orders).`}
          </Typography>
        )}

        {/* Warning */}
        <Box sx={{
          p: 1.5, bgcolor: 'warning.lighter', borderRadius: '8px',
          border: '1px solid', borderColor: 'warning.light',
        }}>
          <Typography variant="caption" color="warning.dark" fontWeight={500}>
            {isPickup && needToTransfer > 0
              ? `⚠ Only ${needToTransfer} pcs will be transferred from ${sourceLocation || 'source'}. ${destAvailable > 0 ? `${destAvailable} pcs already available at destination.` : ''} Final deduction happens when order is completed.`
              : isPickup && needToTransfer === 0
                ? '⚠ No inventory transfer needed — destination already has enough stock. Final deduction happens when order is completed.'
                : '⚠ Inventory will be transferred from the selected location when you confirm. Final deduction happens when the order is completed.'}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={isPickup ? 'info' : 'success'}
          disabled={loading || !destination.trim() || insufficientStock}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : (isPickup ? <Store /> : <LocalShipping />)}
          sx={{ borderRadius: '8px', minWidth: 180 }}
        >
          {loading
            ? 'Dispatching...'
            : isPickup
              ? (noTransferNeeded ? 'Dispatch (No Transfer)' : `Transfer ${needToTransfer} pcs & Dispatch`)
              : 'Ship & Dispatch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispatchDialog;
