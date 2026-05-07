import React from 'react';
import { Box, Typography } from '@mui/material';

const OrderDetailsCard = ({ order }) => {
  if (!order) return null;

  return (
    <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.100', borderRadius: '8px', width: '100%' }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        Order Details
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Customer: <strong>{order.contact_name}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Company: <strong>{order.company_name || '—'}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Color: <strong>{order.color || '—'}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Channel Type: <strong>{order.channel_type || '—'}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Channel Length: <strong>{order.channel_length ? `${order.channel_length} ft (${order.hole_distance || Math.round(order.channel_length * 1.5)} Holes)` : '—'}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Holes: <strong>{order.hole_distance || '—'}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total Length: <strong>{order.total_length ? `${order.total_length} ft` : '—'}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total Pieces: <strong>{order.total_pieces ?? '—'}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Final Length: <strong>{order.final_length || '—'}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Delivery: <strong>{order.delivery_method === 'pickup' ? 'Pickup' : order.delivery_method === 'delivery' ? 'Delivery' : '—'}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Address: <strong>{order.delivery_method === 'pickup' ? (order.pickup_location || '—') : (order.delivery_address || '—')}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'} Date: <strong>{order.pickup_date ? new Date(order.pickup_date).toLocaleDateString('en-GB') : '—'}</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderDetailsCard;
