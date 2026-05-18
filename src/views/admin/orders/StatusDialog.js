import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, CircularProgress, Box, IconButton,
  Stack, Divider, Alert, TextField,
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
    } else {
      setInventoryResult(null);
      setModificationNotes('');
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
                Request Modification
              </Typography>
            </Stack>

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="e.g., Customer wants to change pickup location, reduce quantity to 50 pieces..."
              value={modificationNotes}
              onChange={(e) => setModificationNotes(e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
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
            onClick={() => onConfirm(type, order, { action: 'request-modification', modificationNotes: modificationNotes.trim() })}
            variant="contained"
            color="primary"
            disabled={loading || !modificationNotes.trim()}
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