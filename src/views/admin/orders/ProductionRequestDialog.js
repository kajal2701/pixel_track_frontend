import React, { useMemo, useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
  Box, IconButton, Stack, TextField, MenuItem, Alert, CircularProgress,
} from '@mui/material';
import { Close, PrecisionManufacturing } from '@mui/icons-material';

const DUMMY_ASSIGNEES = [
  { id: 'tech-01', name: 'John Smith' },
  { id: 'tech-02', name: 'Sarah Wilson' },
  { id: 'tech-03', name: 'Mike Johnson' },
];

const ProductionRequestDialog = ({
  open,
  order,
  inventoryResult,
  loading,
  onClose,
  onSubmit,
}) => {
  const [assigneeId, setAssigneeId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open) {
      setAssigneeId('');
      setNotes('');
    }
  }, [open]);

  const productionLines = useMemo(() => {
    if (!inventoryResult) return [];

    const lines = [];
    if ((inventoryResult.slittedUsed || 0) > 0) {
      lines.push({
        source: 'Slitted',
        pieces: inventoryResult.slittedUsed,
        feetRequired: Number((inventoryResult.slittedUsed * (Number(order?.channel_length) || 0)).toFixed(2)),
      });
    }
    if ((inventoryResult.fullRollUsed || 0) > 0) {
      lines.push({
        source: 'Full Roll',
        pieces: inventoryResult.fullRollUsed,
        feetRequired: Number((inventoryResult.fullRollUsed * (Number(order?.channel_length) || 0)).toFixed(2)),
      });
    }
    return lines;
  }, [inventoryResult, order]);

  const selectedAssignee = DUMMY_ASSIGNEES.find((p) => p.id === assigneeId);
  const disableSubmit = loading || !assigneeId || productionLines.length === 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Request Production
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info" icon={<PrecisionManufacturing fontSize="small" />} sx={{ borderRadius: '8px' }}>
            Create production request for order <strong>{order?.order_id}</strong>.
          </Alert>

          <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Planned Production Lines
            </Typography>
            {productionLines.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No production is required for this order.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {productionLines.map((line) => (
                  <Box key={line.source} sx={{ p: 1.25, borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {line.source}: {line.pieces} pcs
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Feet required: ~{line.feetRequired} ft
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          <TextField
            select
            label="Assign Person *"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            fullWidth
          >
            {DUMMY_ASSIGNEES.map((person) => (
              <MenuItem key={person.id} value={person.id}>
                {person.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={3}
            placeholder="Add notes for production team..."
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading} sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSubmit({
              order,
              inventoryResult,
              assignee: selectedAssignee,
              notes,
              productionLines,
            })
          }
          variant="contained"
          disabled={disableSubmit}
          sx={{ borderRadius: '8px', minWidth: 165 }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : 'Request Production'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductionRequestDialog;
