import React from 'react';
import {
  Box, Typography, Button, IconButton, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Close, CheckCircle } from '@mui/icons-material';

const ConfirmDialogs = ({
  saveDialog, setSaveDialog,
  handleSave,
  saving,
  confirmPaymentDialog, setConfirmPaymentDialog,
  handleConfirmPayment,
  confirming,
}) => {

  return (
    <>
      {/* ── Save Confirmation Dialog ── */}
      <Dialog open={saveDialog} onClose={() => setSaveDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Save Changes
          <IconButton onClick={() => setSaveDialog(false)} size="small" sx={{ color: 'text.secondary' }}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 1.5 }}>
            <CheckCircle sx={{ color: 'primary.main', fontSize: 44 }} />
            <Typography variant="body1" textAlign="center" fontWeight={500}>
              Save all changes to this invoice?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setSaveDialog(false)} variant="outlined" sx={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={saving}
            sx={{ borderRadius: '8px', minWidth: 120 }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Confirm Payment Dialog ── */}
      <Dialog open={!!confirmPaymentDialog} onClose={() => setConfirmPaymentDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Confirm Payment
          <IconButton onClick={() => setConfirmPaymentDialog(false)} size="small" sx={{ color: 'text.secondary' }}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 1.5 }}>
            <CheckCircle sx={{ color: 'success.main', fontSize: 44 }} />
            <Typography variant="body1" textAlign="center" fontWeight={500}>
              Are you sure you want to confirm this payment?
            </Typography>

          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmPaymentDialog(false)} variant="outlined" sx={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            onClick={() => { setConfirmPaymentDialog(false); handleConfirmPayment(); }}
            variant="contained"
            disabled={confirming}
            sx={{
              borderRadius: '8px', minWidth: 120,
              bgcolor: '#198754', '&:hover': { bgcolor: '#157347' },
            }}
          >
            {confirming ? <CircularProgress size={18} color="inherit" /> : 'Confirm Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDialogs;

