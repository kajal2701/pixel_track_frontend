import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, CircularProgress,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const BulkCompleteDialog = ({ open, count, onClose, onConfirm, loading }) => {
  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}
    >
      <DialogTitle variant="h4" fontWeight={600}>
        Complete {count} Order(s)?
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">
          Are you sure you want to mark {count} selected order(s) as Completed?
          This will permanently deduct inventory stock and send completion emails.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
          sx={{ borderRadius: '8px' }}
        >
          {loading ? 'Completing...' : 'Mark as Completed'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkCompleteDialog;
