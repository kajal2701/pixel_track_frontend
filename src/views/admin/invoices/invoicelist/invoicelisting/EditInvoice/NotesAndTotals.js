import React from 'react';
import { Box, Typography, TextField, Divider, Stack } from '@mui/material';

const NotesAndTotals = ({
  orders,
  discount, setDiscount,
  gstRate, setGstRate,
  mainTotal, extraTotal,
  discountPct, discountAmount,
  gstPct, gst, grandTotal,
}) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 5,
      mb: 4,
      alignItems: 'start',
    }}
  >
    {/* Notes */}
    <Box>
      {orders.map((order, idx) => (
        <Box key={order.id} mb={3}>
          <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
            Notes (Order {order.order_id}):
          </Typography>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              p: 1.5,
              minHeight: 50,
              bgcolor: 'grey.50',
            }}
          >
            {order.customer_notes ? (
              <Typography variant="body2" color="text.primary" sx={{ mb: order.additional_notes ? 1 : 0 }}>
                <strong>Customer:</strong> {order.customer_notes}
              </Typography>
            ) : null}
            {order.additional_notes ? (
              <Typography variant="body2" color="text.primary">
                <strong>Admin:</strong> {order.additional_notes}
              </Typography>
            ) : null}
            {!order.customer_notes && !order.additional_notes && (
              <Typography variant="body2" color="text.secondary">
                No notes.
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>

    {/* Totals */}
    <Box>
      <Stack spacing={1.6}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
            Sub Total :
          </Typography>
          <Typography variant="body1" fontWeight={500} sx={{ fontSize: '0.9rem' }}>
            $ {mainTotal.toFixed(2)}
          </Typography>
        </Box>
        {extraTotal > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              Total Extra Work :
            </Typography>
            <Typography variant="body1" fontWeight={500} sx={{ fontSize: '0.9rem' }}>
              $ {extraTotal.toFixed(2)}
            </Typography>
          </Box>
        )}

        {/* Discount row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              Discount :
            </Typography>
            <TextField
              size="small"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.5 }}
              sx={{ width: 110 }}
              InputProps={{ endAdornment: <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>%</Typography> }}
            />
          </Box>
          <Typography variant="body1" fontWeight={500} sx={{ fontSize: '0.9rem', color: 'error.main' }}>
            {discountPct > 0 ? `- $ ${discountAmount.toFixed(2)}` : '$ 0.00'}
          </Typography>
        </Box>

        {/* GST row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
              GST :
            </Typography>
            <TextField
              size="small"
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.5 }}
              sx={{ width: 110 }}
              InputProps={{ endAdornment: <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>%</Typography> }}
            />
          </Box>
          <Typography variant="body1" fontWeight={500} sx={{ fontSize: '0.9rem' }}>
            $ {gst.toFixed(2)}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5 }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ fontSize: '1.05rem' }}>
            Main Total :
          </Typography>
          <Typography variant="subtitle1" fontWeight={800} color="primary.main" sx={{ fontSize: '1.05rem' }}>
            $ {grandTotal.toFixed(2)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  </Box>
);

export default NotesAndTotals;
