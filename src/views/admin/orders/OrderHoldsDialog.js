import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import inventoryService from '../../../services/inventoryService';

const OrderHoldsDialog = ({ open, onClose, color, channelLength, stageLabel }) => {
  const [loading, setLoading] = useState(false);
  const [holds, setHolds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && color && channelLength) {
      fetchHolds();
    }
  }, [open, color, channelLength]);

  const fetchHolds = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inventoryService.getInventoryHoldsByColor(color, channelLength);
      // Filter holds based on the stage if necessary, but the backend query currently returns all stages
      // We can filter on the frontend if needed, but since this is for a specific matching inventory,
      // it's generally fine to show all holds for that color/length, or we can filter by inventory_type.
      
      // Let's filter by inventory_type based on the stageLabel
      let filteredHolds = res.data || [];
      if (stageLabel === 'Ready Channel') {
        filteredHolds = filteredHolds.filter(h => h.inventory_type === 'Ready Channel');
      } else if (stageLabel === 'Slitted') {
        filteredHolds = filteredHolds.filter(h => h.inventory_type === 'Slitted');
      } else if (stageLabel === 'Full Roll') {
        filteredHolds = filteredHolds.filter(h => h.inventory_type === 'Full Roll');
      }

      setHolds(filteredHolds);
    } catch (err) {
      console.error('Failed to fetch holds', err);
      setError('Failed to load hold details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Inventory Holds: {stageLabel}</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : holds.length === 0 ? (
          <Typography align="center" color="text.secondary">No active holds for this inventory.</Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Table 1: Order Holds */}
            {holds.filter(h => h.order_id).length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Order Holds</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell><strong>Order ID</strong></TableCell>
                        <TableCell><strong>Company</strong></TableCell>
                        <TableCell><strong>Contact Person</strong></TableCell>
                        <TableCell align="center"><strong>Order Qty</strong></TableCell>
                        <TableCell><strong>Order Status</strong></TableCell>
                        <TableCell align="right"><strong>Held Amount</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {holds.filter(h => h.order_id).map((row) => (
                        <TableRow key={row.hold_id}>
                          <TableCell>{row.order_id}</TableCell>
                          <TableCell>{row.company_name || '—'}</TableCell>
                          <TableCell>{row.contact_name || '—'}</TableCell>
                          <TableCell align="center">{row.order_qty || '—'}</TableCell>
                          <TableCell>{row.order_status || '—'}</TableCell>
                          <TableCell align="right">
                            {row.inventory_type === 'Ready Channel' ? `${row.held_pieces} pcs` :
                             row.inventory_type === 'Slitted' ? `${row.held_quantity} rolls (${row.held_feet} ft)` :
                             `${row.held_quantity} rolls (${row.held_feet} ft)`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Table 2: Production Holds (General Inventory, etc.) */}
            {holds.filter(h => !h.order_id).length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Production Holds</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell><strong>Production Type</strong></TableCell>
                        <TableCell align="center"><strong>Production Qty</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell align="right"><strong>Held Amount</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {holds.filter(h => !h.order_id).map((row) => (
                        <TableRow key={row.hold_id}>
                          <TableCell>{row.production_type || 'General Inventory'}</TableCell>
                          <TableCell align="center">{row.production_qty || '—'}</TableCell>
                          <TableCell>{row.production_status || '—'}</TableCell>
                          <TableCell align="right">
                            {row.inventory_type === 'Ready Channel' ? `${row.held_pieces} pcs` :
                             row.inventory_type === 'Slitted' ? `${row.held_quantity} rolls (${row.held_feet} ft)` :
                             `${row.held_quantity} rolls (${row.held_feet} ft)`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderHoldsDialog;
