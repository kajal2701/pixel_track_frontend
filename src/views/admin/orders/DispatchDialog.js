import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, TextField, MenuItem,
  Stack, Chip, CircularProgress, IconButton,
} from '@mui/material';
import { LocalShipping, Store, LocationOn, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { LOCATION_OPTIONS } from 'src/utils/helpers';

const DispatchDialog = ({ open, order, onClose, onConfirm, loading }) => {
  const { palette } = useTheme();
  const [destination, setDestination] = useState('');

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

  const handleConfirm = () => {
    if (!destination.trim()) return;
    onConfirm(order, destination.trim());
  };

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
                Final: <strong>{order.final_length ? `${order.final_length} ft` : '—'}</strong>
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

        {/* Current Location (read-only) */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
            <LocationOn sx={{ fontSize: 18, color: palette.text.secondary }} />
            <Typography variant="subtitle2" fontWeight={600}>Current Location</Typography>
          </Stack>
          <TextField
            fullWidth
            value="Warehouse"
            disabled
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: palette.action.hover,
              }
            }}
          />
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

        {/* Warning */}
        <Box sx={{
          p: 1.5, bgcolor: 'warning.lighter', borderRadius: '8px',
          border: '1px solid', borderColor: 'warning.light',
        }}>
          <Typography variant="caption" color="warning.dark" fontWeight={500}>
            ⚠ Inventory will be deducted from warehouse when you confirm.
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
          disabled={loading || !destination.trim()}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : (isPickup ? <Store /> : <LocalShipping />)}
          sx={{ borderRadius: '8px', minWidth: 180 }}
        >
          {loading ? 'Dispatching...' : (isPickup ? 'Transfer & Dispatch' : 'Ship & Dispatch')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispatchDialog;
