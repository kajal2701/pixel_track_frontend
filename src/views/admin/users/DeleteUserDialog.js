import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, CircularProgress, IconButton
} from '@mui/material';
import { Warning, Close } from '@mui/icons-material';

const DeleteUserDialog = ({ open, user, onClose, onConfirm, loading }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Warning color="error" />
          <Typography variant="h6" fontWeight={600}>
            Delete User
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Are you sure you want to delete this user? They will no longer have access to the system.
        </Typography>
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: '8px' }}>
          <Typography variant="body2" fontWeight={600}>
            {user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Role: {user.role}
          </Typography>
        </Box>

      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onConfirm(user)}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ borderRadius: '8px' }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;
