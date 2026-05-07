import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextareaAutosize, Typography, CircularProgress,
  IconButton, Box, Stack, Chip,
} from '@mui/material';
import { Close, Person, AdminPanelSettings } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const NotesDialog = ({ open, order, onClose, onSave, loading }) => {
  const { palette } = useTheme();
  const [adminNotes, setAdminNotes] = useState('');

  // When dialog opens, load existing admin notes
  useEffect(() => {
    if (open && order) {
      setAdminNotes(order.additional_notes || '');
    }
  }, [open, order]);

  const handleSave = () => {
    onSave(order, adminNotes.trim());
  };

  const hasCustomerNotes = order?.customer_notes && order.customer_notes.trim() !== '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Order Notes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {order?.order_id}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: palette.text.secondary }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: '8px' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Customer:</strong> {order?.contact_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Company:</strong> {order?.company_name}
          </Typography>
        </Box>

        {/* ── Customer Notes (read-only) ── */}
        <Box sx={{ mb: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Chip
              icon={<Person sx={{ fontSize: 14 }} />}
              label="Customer Notes"
              size="small"
              color="info"
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: '6px' }}
            />
          </Stack>
          <Box sx={{
            p: 1.5,
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: palette.action.hover,
            minHeight: 40,
          }}>
            <Typography variant="body2" color={hasCustomerNotes ? 'text.primary' : 'text.disabled'}>
              {hasCustomerNotes ? order.customer_notes : 'No customer notes provided.'}
            </Typography>
          </Box>
        </Box>

        {/* ── Admin Notes (editable) ── */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Chip
              icon={<AdminPanelSettings sx={{ fontSize: 14 }} />}
              label="Admin Notes"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: '6px' }}
            />
          </Stack>
          <TextareaAutosize
            minRows={4}
            maxRows={10}
            placeholder="Add internal admin notes for this order..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${palette.divider}`,
              fontFamily: 'inherit',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{ borderRadius: '8px', minWidth: 100 }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesDialog;