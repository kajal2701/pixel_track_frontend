import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Stack, Divider, Button,
} from '@mui/material';

const GenerateInvoiceDialog = ({
  open,
  onClose,
  selectedOrders = [],
  onConfirm,
}) => {
  return (
    <Dialog
      id="generate-invoice-dialog"
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>Generate Invoice</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Customer: <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{selectedOrders[0]?.company_name || 'N/A'}</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You have selected {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} to generate an invoice. A draft invoice will be created for these orders.
        </Typography>
        
        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2, mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1 }}>Selected Orders</Typography>
          <Stack spacing={1}>
            {selectedOrders.map((ord) => (
              <Stack key={ord.id} direction="row" justifyContent="space-between">
                <Typography variant="body2">{ord.order_id} — {ord.color} ({ord.channel_type})</Typography>
                <Typography variant="body2" fontWeight="600">{parseFloat(ord.final_length || 0).toFixed(2)} ft</Typography>
              </Stack>
            ))}
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight="700">Total Orders:</Typography>
            <Typography variant="subtitle2" fontWeight="700" color="primary.main">{selectedOrders.length}</Typography>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button id="btn-cancel-generate" onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button id="btn-confirm-generate" onClick={onConfirm} variant="contained" color="secondary" sx={{ borderRadius: '8px' }} autoFocus>
          Generate Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
};

GenerateInvoiceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.object).isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default GenerateInvoiceDialog;
