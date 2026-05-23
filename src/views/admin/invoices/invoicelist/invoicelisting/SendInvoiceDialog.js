import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Stack, Button,
} from '@mui/material';

const SendInvoiceDialog = ({
  open,
  onClose,
  onConfirm,
  invoiceNumber,
  companyName,
  totalAmount,
}) => {
  return (
    <Dialog
      id="send-invoice-dialog"
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
        Send Invoice
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to send this invoice to the customer?
        </Typography>

        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Invoice #:
              </Typography>
              <Typography variant="body2" fontWeight="700">
                {invoiceNumber || 'N/A'}
              </Typography>
            </Stack>

            {companyName && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Customer:</Typography>
                <Typography variant="body2" fontWeight="600" color="primary.main">
                  {companyName}
                </Typography>
              </Stack>
            )}

            {totalAmount && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                <Typography variant="body2" fontWeight="700" color="secondary.main">
                  {totalAmount}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          id="btn-cancel-send-invoice"
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          id="btn-confirm-send-invoice"
          onClick={onConfirm}
          variant="contained"
          color="primary"
          sx={{ borderRadius: '8px' }}
          autoFocus
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SendInvoiceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  invoiceNumber: PropTypes.string,
  companyName: PropTypes.string,
  totalAmount: PropTypes.string,
};

export default SendInvoiceDialog;
