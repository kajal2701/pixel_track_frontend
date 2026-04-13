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
import { Close, Delete } from '@mui/icons-material';

const DeleteProductDialog = ({ open, product, onClose, onConfirm, loading }) => {
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
        Delete Product
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, gap: 1.5 }}>
          <Delete sx={{ color: 'error.main', fontSize: 40 }} />
          <Typography variant="body1" textAlign="center" fontWeight={500}>
            Are you sure you want to delete {product?.product_name}?
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            This action cannot be undone.
          </Typography>
          {product && (
            <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: '8px', width: '100%' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Product ID: <strong>{product.id}</strong>
              </Typography>
              {product.manufacturer && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Manufacturer: <strong>{product.manufacturer}</strong>
                </Typography>
              )}
              {(product.color || product.color_code) && (
                <Typography variant="caption" color="text.secondary" display="block">
                  Color: <strong>{[product.color, product.color_code].filter(Boolean).join(' / ')}</strong>
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(product)}
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

export default DeleteProductDialog;
