import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, CircularProgress, Box, IconButton,
  Stack, Divider, Alert, TextField, Select, MenuItem, FormControl
} from '@mui/material';
import {
  Check, Delete, CheckCircle, Close, Inventory2, Edit,
} from '@mui/icons-material';
import orderService from 'src/services/orderService';
import OrderDetailsCard from './OrderDetailsCard';
import InventoryBreakdown from './InventoryBreakdown';

// Config per dialog type
const DIALOG_CONFIG = {
  CONFIRM: {
    title: 'Confirm Order',
    icon: <Check sx={{ color: 'success.main', fontSize: 40 }} />,
    message: (order) => `Are you sure you want to confirm order ${order?.order_id}?`,
    sub: 'Customer will be notified.',
    confirmLabel: 'Confirm Order',
    confirmColor: 'success',
  },
  CANCEL: {
    title: 'Cancel Order',
    icon: <Close sx={{ color: 'error.main', fontSize: 40 }} />,
    message: (order) => `Are you sure you want to cancel order ${order?.order_id}?`,
    sub: 'This action will notify the customer.',
    confirmLabel: 'Cancel Order',
    confirmColor: 'error',
  },
  READY: {
    title: 'Mark as Ready',
    icon: <CheckCircle sx={{ color: 'info.main', fontSize: 40 }} />,
    message: (order) => `Mark order ${order?.order_id} as Ready?`,
    sub: 'Product will be stored in warehouse. Inventory holds remain active.',
    confirmLabel: 'Mark Ready',
    confirmColor: 'info',
  },
  DELETE: {
    title: 'Delete Order',
    icon: <Delete sx={{ color: 'error.main', fontSize: 40 }} />,
    message: (order) => `Permanently delete order ${order?.order_id}?`,
    sub: 'This cannot be undone.',
    confirmLabel: 'Delete',
    confirmColor: 'error',
  },
  COMPLETE: {
    title: 'Complete Order',
    icon: <CheckCircle sx={{ color: 'success.main', fontSize: 40 }} />,
    message: (order) => `Mark order ${order?.order_id} as completed?`,
    sub: 'This confirms the customer has received the order. Inventory will be permanently deducted.',
    confirmLabel: 'Complete Order',
    confirmColor: 'success',
  },
};

// ═══════════════════════════════════════════════════════════════════
// StatusDialog
// ═══════════════════════════════════════════════════════════════════
const StatusDialog = ({ open, type, order, onClose, onConfirm, loading }) => {
  const config = DIALOG_CONFIG[type];

  const [inventoryResult, setInventoryResult] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [modificationNotes, setModificationNotes] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');

  // Fetch inventory and run check when CONFIRM dialog opens
  useEffect(() => {
    if (open && type === 'CONFIRM' && order) {
      const fetchAndCheck = async () => {
        setInventoryLoading(true);
        try {
          const res = await orderService.checkInventory(order.id);
          setInventoryResult(res.data || {});
        } catch (err) {
          setInventoryResult({ error: err.message || 'Failed to check inventory availability.' });
        } finally {
          setInventoryLoading(false);
        }
      };
      fetchAndCheck();
      setModificationNotes(order.modification_notes || '');
      setPickupLocation(order.pickup_location || '');

      let dateString = '';
      if (order.pickup_date) {
        try {
          const d = new Date(order.pickup_date);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          dateString = `${yyyy}-${mm}-${dd}`;
        } catch (e) { }
      }
      setPickupDate(dateString);
    } else {
      setInventoryResult(null);
      setModificationNotes('');
      setPickupLocation('');
      setPickupDate('');
    }
  }, [open, type, order]);

  if (!config) return null;

  const isConfirm = type === 'CONFIRM';
  const hasShortage = isConfirm && inventoryResult && !inventoryResult.error && Number(inventoryResult.shortage || 0) > 0;
  const needsProduction = isConfirm && inventoryResult && !inventoryResult.error &&
    (Number(inventoryResult.slittedUsed || 0) > 0 || Number(inventoryResult.fullRollUsed || 0) > 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={isConfirm ? 'sm' : 'xs'} fullWidth>
      <DialogTitle sx={{
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {config.title}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, gap: 1.5 }}>
          {config.icon}
          <Typography variant="body1" textAlign="center" fontWeight={500}>
            {config.message(order)}
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            {config.sub}
          </Typography>
          <OrderDetailsCard order={order} />
        </Box>

        {/* ── Inventory Check Panel (CONFIRM only) ── */}
        {isConfirm && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />

            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Inventory2 sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={700}>
                Inventory Availability Check
              </Typography>
            </Stack>

            {inventoryLoading ? (
              <Box display="flex" flexDirection="column" alignItems="center" py={3} gap={1}>
                <CircularProgress size={28} />
                <Typography variant="caption" color="text.secondary">
                  Checking inventory...
                </Typography>
              </Box>
            ) : inventoryResult ? (
              inventoryResult.error && !inventoryResult.orderQty ? (
                <Alert severity="warning" sx={{ borderRadius: '8px' }}>
                  {inventoryResult.error}
                </Alert>
              ) : (
                <InventoryBreakdown result={inventoryResult} />
              )
            ) : null}
          </Box>
        )}

        {/* ── Modification Request (CONFIRM only) ── */}
        {isConfirm && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <Edit sx={{ color: 'warning.main', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={700}>
                Request Modification              </Typography>
            </Stack>

            <Stack spacing={2}>
              {order.delivery_method === 'pickup' && (
                <FormControl fullWidth size="small">
                  <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 500 }}>Pickup Location</Typography>
                  <Select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="4783 CAWSEY Terrace SW, Edmonton AB T6W 5M7">
                      4783 CAWSEY Terrace SW, Edmonton AB T6W 5M7
                    </MenuItem>
                    <MenuItem value="2322 chokecherry close sw Edmonton, AB T6X2M7">
                      2322 chokecherry close sw Edmonton, AB T6X2M7
                    </MenuItem>
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth size="small">
                <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 500 }}>
                  {order.delivery_method === 'pickup' ? 'Pickup Date' : 'Delivery Date'}
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </FormControl>

              <FormControl fullWidth size="small">
                <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 500 }}>Modification Notes</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="e.g., Admin wants to change pickup location..."
                  value={modificationNotes}
                  onChange={(e) => setModificationNotes(e.target.value)}
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </FormControl>
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexWrap: 'wrap' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        {isConfirm && (
          <Button
            onClick={() => onConfirm(type, order, {
              action: 'request-modification',
              payload: {
                modification_notes: modificationNotes.trim(),
                pickup_location: pickupLocation,
                pickup_date: pickupDate,
              }
            })}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ borderRadius: '8px', minWidth: 180 }}
          >
            {loading
              ? <CircularProgress size={18} color="inherit" />
              : 'Request Modification'}
          </Button>
        )}
        {!hasShortage && !needsProduction && (
          <Button
            onClick={() => onConfirm(type, order, { inventoryResult, action: 'confirm' })}
            variant="contained"
            color={config.confirmColor}
            disabled={loading}
            sx={{ borderRadius: '8px', minWidth: 110 }}
          >
            {loading
              ? <CircularProgress size={18} color="inherit" />
              : config.confirmLabel}
          </Button>
        )}
        {needsProduction && !hasShortage && (
          <Button
            onClick={() => onConfirm(type, order, { inventoryResult, action: 'request-production' })}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ borderRadius: '8px', minWidth: 200 }}
          >
            {loading
              ? <CircularProgress size={18} color="inherit" />
              : 'Confirm & Request for Production'}
          </Button>
        )}
        {hasShortage && (
          <Button
            onClick={() => onConfirm(type, order, { inventoryResult, action: 'awaiting-material' })}
            variant="outlined"
            color="warning"
            disabled={loading}
            sx={{ borderRadius: '8px', minWidth: 150 }}
          >
            {loading
              ? <CircularProgress size={18} color="inherit" />
              : 'Awaiting Inventory'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;