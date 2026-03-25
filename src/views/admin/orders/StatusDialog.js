import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, CircularProgress, Box, IconButton,
} from '@mui/material';
import {
  Check, Refresh, Delete, CheckCircle,
} from '@mui/icons-material';
import { Close } from '@mui/icons-material';

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

const StatusDialog = ({ open, type, order, onClose, onConfirm, loading }) => {
  const config = DIALOG_CONFIG[type];
  if (!config) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
          {order && (
            <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: '8px', width: '100%' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Customer: <strong>{order.contact_name}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Company: <strong>{order.company_name}</strong>
              </Typography>
            </Box>
          )}
        </Box>
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