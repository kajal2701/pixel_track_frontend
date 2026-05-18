import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Typography, Box, Stack, Divider,
} from '@mui/material';
import { Close, LocationOn, Inventory } from '@mui/icons-material';

const LocationStockDialog = ({ open, onClose, variant }) => {
  if (!variant) return null;

  let stockData = {};
  if (typeof variant.location_stock === 'string') {
    try {
      stockData = JSON.parse(variant.location_stock);
    } catch (e) {
      stockData = {};
    }
  } else if (variant.location_stock) {
    stockData = variant.location_stock;
  } else {
    // Fallback if no JSON is present
    stockData = { [variant.location || 'Warehouse']: variant.pieces };
  }

  const entries = Object.entries(stockData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'grey.100' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Inventory color="primary" />
          <Typography variant="subtitle1" fontWeight={700}>
            Stock — {variant.length} ft ({variant.hole_distance}H)
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          {entries.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
              No location data available.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {entries.map(([loc, pcs], index) => (
                <React.Fragment key={loc}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={500}>
                        {loc}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight={600}>
                      {pcs} pcs
                    </Typography>
                  </Stack>
                  {index < entries.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Stack>
          )}
        </Box>
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              Total Pieces
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              {variant.pieces} pcs
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LocationStockDialog;
