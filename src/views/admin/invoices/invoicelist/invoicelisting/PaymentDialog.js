import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Stack, Button, TextField, IconButton, CircularProgress
} from '@mui/material';
import {
  CloudUpload, Close, CheckCircle
} from '@mui/icons-material';

const PaymentDialog = ({
  open,
  onClose,
  amount,
  invoiceNumber,
  onPay,
}) => {
  // E-Transfer state
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setScreenshotUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveScreenshot = (e) => {
    e.stopPropagation();
    setScreenshot(null);
    setScreenshotUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePayNow = async () => {
    if (!screenshot) {
      setError('Please upload a screenshot of the e-transfer.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      if (onPay) {
        await onPay(screenshot);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit payment.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Reset states on close
    setScreenshot(null);
    setScreenshotUrl(null);
    setError('');
    setUploading(false);
    onClose();
  };

  return (
    <Dialog
      id="payment-dialog"
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', overflow: 'hidden' }
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
        Confirm & Pay
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {/* Payable Amount Field */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', fontSize: '0.95rem' }}>
            Payable Amount:
          </Typography>
          <TextField
            fullWidth
            value={amount ? parseFloat(amount).toFixed(2) : '0.00'}
            disabled
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'grey.100',
                fontWeight: 600,
                color: 'text.primary',
                '&.Mui-disabled': {
                  color: 'text.primary',
                  WebkitTextFillColor: '#1e293b',
                }
              }
            }}
          />
        </Box>

        <Box sx={{ minHeight: '160px' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, mb: 1, fontSize: '0.95rem' }}>
              E-Transfer Details (info@pixeltracks.ca)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload the screenshot of the transfer here.
            </Typography>

            {/* Upload Dashed Container */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Box
              onClick={triggerFileSelect}
              sx={{
                border: '1.5px dashed',
                borderColor: 'grey.400',
                borderRadius: '12px',
                bgcolor: 'grey.50',
                py: 4,
                px: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'grey.100',
                  borderColor: 'primary.main',
                }
              }}
            >
              {screenshotUrl ? (
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                  <CheckCircle sx={{ color: 'success.main' }} />
                  <Box sx={{ textAlign: 'left', maxWidth: '200px' }}>
                    <Typography variant="body2" noWrap fontWeight="600">
                      {screenshot.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(screenshot.size / 1024).toFixed(1)} KB
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={handleRemoveScreenshot} sx={{ color: 'error.main' }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Stack>
              ) : (
                <Stack alignItems="center" spacing={1}>
                  <CloudUpload sx={{ color: 'text.secondary', fontSize: '2rem' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Click to upload image
                  </Typography>
                </Stack>
              )}
            </Box>
          </Box>
        </Box>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          id="btn-close-payment"
          onClick={handleClose}
          disabled={uploading}
          sx={{
            color: 'error.main',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.95rem',
            '&:hover': { bgcolor: 'error.lighter' }
          }}
        >
          Close
        </Button>
        <Button
          id="btn-pay-now"
          onClick={handlePayNow}
          variant="contained"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            bgcolor: '#198754',
            color: 'common.white',
            fontWeight: 600,
            px: 3,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.95rem',
            '&:hover': { bgcolor: '#157347' }
          }}
        >
          {uploading ? 'Submitting...' : 'Submit Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PaymentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  invoiceNumber: PropTypes.string,
  onPay: PropTypes.func,
};

export default PaymentDialog;
