import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, IconButton, Stack, Chip,
  CircularProgress,
} from '@mui/material';
import {
  Close, ArrowForward, PlayArrow, CheckCircle,
  Cancel as CancelIcon, HourglassEmpty,
} from '@mui/icons-material';

const STATUS_CONFIG = {
  Pending: { color: 'warning', icon: <HourglassEmpty fontSize="small" /> },
  'In Progress': { color: 'info', icon: <PlayArrow fontSize="small" /> },
  Completed: { color: 'success', icon: <CheckCircle fontSize="small" /> },
  Cancelled: { color: 'error', icon: <CancelIcon fontSize="small" /> },
};

const TRANSITION_CONFIG = {
  'In Progress': {
    label: 'Start Production',
    message: 'This will mark the production as actively in progress.',
    confirmColor: 'info',
  },
  Completed: {
    label: 'Mark as Completed',
    message: 'This will mark the production as completed. Backend will update inventory accordingly.',
    confirmColor: 'success',
  },
  Cancelled: {
    label: 'Cancel Production',
    message: 'This will cancel the production. This action can be reverted by moving back to Pending.',
    confirmColor: 'error',
  },
  Pending: {
    label: 'Move to Pending',
    message: 'This will move the production back to pending status.',
    confirmColor: 'warning',
  },
};

const StatusUpdateDialog = ({ open, production, newStatus, onClose, onConfirm, loading }) => {
  if (!production || !newStatus) return null;

  const currentConfig = STATUS_CONFIG[production.status] || STATUS_CONFIG.Pending;
  const newConfig = STATUS_CONFIG[newStatus] || STATUS_CONFIG.Pending;
  const transition = TRANSITION_CONFIG[newStatus] || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Update Production Status
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 2 }}>
          {/* Production ID */}
          <Typography variant="caption" color="text.secondary">
            Production: <strong>{production.id}</strong>
          </Typography>

          {/* Status Transition Visual */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={currentConfig.icon}
              label={production.status || 'Pending'}
              color={currentConfig.color}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <ArrowForward sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Chip
              icon={newConfig.icon}
              label={newStatus}
              color={newConfig.color}
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          {/* Message */}
          <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 1 }}>
            {transition.message}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(production, newStatus)}
          variant="contained"
          color={transition.confirmColor || 'primary'}
          disabled={loading}
          sx={{ borderRadius: '8px', minWidth: 150 }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : transition.label}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdateDialog;
