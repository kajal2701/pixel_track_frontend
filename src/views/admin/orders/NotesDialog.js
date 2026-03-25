import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextareaAutosize, Typography, CircularProgress,
  IconButton, Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const NotesDialog = ({ open, order, onClose, onSave, loading }) => {
  const { palette } = useTheme();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // When dialog opens, load existing notes
  useEffect(() => {
    if (open && order) {
      setNotes(order.additional_notes || '');
      setError('');
    }
  }, [open, order]);

  const handleSave = () => {
    if (!notes.trim()) {
      setError('Notes are required');
      return;
    }
    setError('');
    onSave(order, notes.trim());
  };

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
        
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Add notes for this order *
        </Typography>
        <TextareaAutosize
          minRows={4}
          maxRows={10}
          placeholder="Enter detailed notes about this order..."
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setError('');
          }}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: error ? `2px solid ${palette.error.main}` : `1px solid ${palette.divider}`,
            fontFamily: 'inherit',
            fontSize: '14px',
            resize: 'vertical',
            boxSizing: 'border-box',
            outline: 'none',
            backgroundColor: error ? 'rgba(211, 47, 47, 0.04)' : 'transparent',
          }}
        />
        {error && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            {error}
          </Typography>
        )}
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