import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import invoiceService from 'src/services/invoiceService';

const SendInvoiceDialog = ({ open, onClose, invoice, onSuccess, variant = 'resend' }) => {
  const [sending, setSending] = useState(false);

  const isFinal = variant === 'final';
  const title = isFinal ? 'Send Final Invoice' : 'Resend Invoice';
  const description = isFinal
    ? 'Payment has been confirmed. Send the final invoice to the customer?'
    : `Are you sure you want to resend invoice ${invoice?.invoice_number} to the customer?`;
  const buttonLabel = isFinal ? 'Send Final Invoice' : 'Resend Invoice';

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await invoiceService.resend(invoice.id);
      toast.success(res.message || `${title} sent successfully!`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || `Failed to send invoice.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={sending ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {description}
        </Typography>
        <Box sx={{ bgcolor: 'grey.50', borderRadius: '8px', p: 2, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Invoice #:</strong> {invoice?.invoice_number}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Customer:</strong> {invoice?.contact_name || invoice?.company_name || '—'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Email:</strong> {invoice?.email || '—'}
          </Typography>
          {isFinal && (
            <Typography variant="body2" color="text.secondary">
              <strong>Total:</strong> ${parseFloat(invoice?.total_amount || 0).toFixed(2)}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={sending}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={sending}
          startIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          sx={{
            borderRadius: '8px',
            fontWeight: 600,
            textTransform: 'none',
            ...(isFinal && { bgcolor: '#198754', '&:hover': { bgcolor: '#157347' } }),
          }}
        >
          {sending ? 'Sending...' : buttonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SendInvoiceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  invoice: PropTypes.object,
  onSuccess: PropTypes.func,
  variant: PropTypes.oneOf(['resend', 'final']),
};

export default SendInvoiceDialog;
