import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, CircularProgress, Box, IconButton,
  Stack, Divider, Alert,
} from '@mui/material';
import {
  Check, Refresh, Delete, CheckCircle, Close, Inventory2,
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
  REOPEN: {
    title: 'Reopen Order',
    icon: <Refresh sx={{ color: 'info.main', fontSize: 40 }} />,
    message: (order) => `Reopen order ${order?.order_id}?`,
    sub: 'Order will be set back to Pending.',
    confirmLabel: 'Reopen',
    confirmColor: 'info',
  },
  READY: {
    title: 'Mark as Ready',
    icon: <CheckCircle sx={{ color: 'info.main', fontSize: 40 }} />,
    message: (order) => `Mark order ${order?.order_id} as Ready?`,
    sub: 'Customer will be notified for pickup/delivery.',
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
};

// ═══════════════════════════════════════════════════════════════════
// StatusDialog
// ═══════════════════════════════════════════════════════════════════
const StatusDialog = ({ open, type, order, onClose, onConfirm, loading }) => {
  const config = DIALOG_CONFIG[type];

  const [inventoryResult, setInventoryResult] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);

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
    } else {
      setInventoryResult(null);
    }
  }, [open, type, order]);

  if (!config) return null;

  const isConfirm = type === 'CONFIRM';

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
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(type, order)}
          variant="contained"
          color={config.confirmColor}
          disabled={loading}
          sx={{ borderRadius: '8px', minWidth: 110 }}
        >
          {loading
            ? <CircularProgress size={18} color="inherit" />
            : config.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;