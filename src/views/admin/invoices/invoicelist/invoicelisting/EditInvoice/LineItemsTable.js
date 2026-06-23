import React from 'react';
import {
  Box, Typography, Button, TextField, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody,
  Stack,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const cell = { fontSize: '0.9rem', py: 1.3 };
const headerCell = { fontSize: '0.9rem', fontWeight: 700, py: 1.3, bgcolor: '#f4f6fa' };

const LineItemsTable = ({
  invoice,
  extraWork, updateExtraRow, removeExtraRow, addExtraRow,
  extraWorkErrors = {},
}) => {
  const orderDetails = invoice?.order_details
    ? (typeof invoice.order_details === 'string' ? JSON.parse(invoice.order_details) : invoice.order_details)
    : [];

  const orders = invoice?.orders || [];

  return (
    <>
      <Box
        sx={{
          overflowX: 'auto',
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '10px',
        }}
      >
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCell, width: 44 }}>#</TableCell>
              <TableCell sx={headerCell}>Description</TableCell>
              <TableCell sx={{ ...headerCell, textAlign: 'right' }}>Channel Length</TableCell>
              <TableCell sx={{ ...headerCell, textAlign: 'right' }}>Total Length (ft)</TableCell>
              <TableCell sx={{ ...headerCell, textAlign: 'right' }}>Unit Cost</TableCell>
              <TableCell sx={{ ...headerCell, textAlign: 'right' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Main order rows */}
            {orders.map((order, idx) => {
              const details = orderDetails.find(d => d.order_id === order.id) || {};
              const unitPrice = parseFloat(details.unit_price || 0);
              const subtotal = parseFloat(details.subtotal || 0);

              return (
                <TableRow key={`order-${order.id}`} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                  <TableCell sx={cell}>{idx + 1}</TableCell>
                  <TableCell sx={cell}>
                    <Typography variant="body1" fontWeight={500} sx={{ fontSize: '0.95rem' }}>
                      Pixel Track Channel —{' '}
                      <Box component="span" fontWeight={700}>{order.color}</Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3, fontSize: '0.88rem' }}>
                      Order: <strong>{order.order_id}</strong>&nbsp;|&nbsp;
                      Type: {order.channel_type}&nbsp;|&nbsp;
                      Number of Holes: {order.hole_distance}&nbsp;|&nbsp;
                      Pieces: {order.total_pieces}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ ...cell, textAlign: 'right' }}>
                    {order.channel_length ? `${order.channel_length} ft` : '—'}
                  </TableCell>
                  <TableCell sx={{ ...cell, textAlign: 'right' }}>
                    {parseFloat(order.final_length || 0).toFixed(2)} ft
                  </TableCell>
                  <TableCell sx={{ ...cell, textAlign: 'right' }}>
                    {unitPrice > 0
                      ? `$${unitPrice.toFixed(2)} / ft`
                      : (
                        <Typography variant="body2" color="error.main" sx={{ fontSize: '0.88rem' }}>
                          No pricing set
                        </Typography>
                      )}
                  </TableCell>
                  <TableCell sx={{ ...cell, textAlign: 'right', fontWeight: 700, fontSize: '1rem' }}>
                    ${subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Extra Work rows */}
            {extraWork.map((row, idx) => {
              const rowErrors = extraWorkErrors[row.id] || {};
              return (
                <TableRow key={row.id} sx={{ bgcolor: '#fffde7' }}>
                  <TableCell sx={cell}>{orders.length + idx + 1}</TableCell>
                  <TableCell sx={cell}>
                    <TextField
                      fullWidth size="small"
                      placeholder="Extra work description..."
                      value={row.description}
                      onChange={(e) => updateExtraRow(row.id, 'description', e.target.value)}
                      error={!!rowErrors.description}
                      helperText={rowErrors.description || ''}
                      sx={{ fontSize: '0.95rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...cell, textAlign: 'right' }}>—</TableCell>
                  <TableCell sx={{ ...cell, textAlign: 'right' }}>
                    <TextField
                      size="small" type="number"
                      value={row.qty}
                      onChange={(e) => updateExtraRow(row.id, 'qty', e.target.value)}
                      error={!!rowErrors.qty}
                      helperText={rowErrors.qty || ''}
                      sx={{ width: 90 }}
                      inputProps={{ min: 0, step: 0.5 }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...cell, textAlign: 'right' }}>
                    <TextField
                      size="small" type="number"
                      value={row.unit_price}
                      onChange={(e) => updateExtraRow(row.id, 'unit_price', e.target.value)}
                      error={!!rowErrors.unit_price}
                      helperText={rowErrors.unit_price || ''}
                      sx={{ width: 100 }}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...cell, textAlign: 'right' }}>
                    <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={0.5}>
                      <Typography fontWeight={700} sx={{ fontSize: '1rem' }}>
                        ${(parseFloat(row.qty || 0) * parseFloat(row.unit_price || 0)).toFixed(2)}
                      </Typography>
                      <IconButton size="small" color="error" onClick={() => removeExtraRow(row.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      {/* Add Extra Work */}
      <Stack direction="row" gap={1.5} mb={4}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={addExtraRow}
          sx={{ borderRadius: '8px', fontSize: '0.95rem' }}
        >
          Add Extra Work
        </Button>
      </Stack>
    </>
  );
};

export default LineItemsTable;
