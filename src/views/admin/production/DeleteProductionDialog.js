import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  IconButton,
} from '@mui/material';
import { Close, Delete, Warning } from '@mui/icons-material';

const DeleteProductionDialog = ({ open, production, onClose, onConfirm, loading }) => {
  const hasOrder = production && production.order_id;

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
        Delete Production Record
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, gap: 1.5 }}>
          <Delete sx={{ color: 'error.main', fontSize: 40 }} />
          <Typography variant="body1" textAlign="center" fontWeight={500}>
            Are you sure you want to delete this production record?
          </Typography>

          {production && (
            <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: '8px', width: '100%' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Production ID: <strong>{production.id}</strong>
              </Typography>
              {production.production_type && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Type: <strong>{production.production_type}</strong>
                </Typography>
              )}
              {production.order_id && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Order: <strong>{production.order_id}</strong>
                </Typography>
              )}
              {production.target_state && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Target State: <strong>{production.target_state}</strong>
                </Typography>
              )}
            </Box>
          )}
          {hasOrder && (
            <Box sx={{
              width: '100%',
              p: 1.5,
              bgcolor: 'warning.lighter',
              border: '1px solid',
              borderColor: 'warning.light',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}>
              <Warning sx={{ color: 'warning.dark', fontSize: 20, mt: 0.2 }} />
              <Box>
                <Typography variant="caption" color="warning.dark" fontWeight={700} display="block">
                  This production is linked to Order {production.order_id}
                </Typography>
                <Typography variant="caption" color="warning.dark" display="block">
                  Deleting it will release any inventory holds and may affect the order's fulfillment.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(production)}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{ borderRadius: '8px', minWidth: 100 }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductionDialog;
