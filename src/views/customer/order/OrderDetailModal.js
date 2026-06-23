import React from 'react';
import {
  Box, Typography, Dialog, DialogTitle, DialogContent,
  IconButton, Grid, Chip, Divider, Button
} from '@mui/material';
import { Close, LocalShipping, Store, CalendarToday, Edit } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { STATUS_CHIP_COLOR, formatDate, getChannelLengthLabel } from 'src/utils/helpers';

/* ── Detail Row ── */
const DetailRow = ({ label, value, icon }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.2 }}>
    {icon && (
      <Box sx={{ color: 'primary.main', mt: 0.2 }}>{icon}</Box>
    )}
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500} sx={{ mt: 0.2, wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Box>
  </Box>
);

const OrderDetailModal = ({ open, onClose, order }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header with close icon */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
          color: '#fff',
          py: 2,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} color="inherit">
            Order Details
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.3 }} color="inherit">
            {order.order_id}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#fff',
            backgroundColor: 'rgba(255,255,255,0.15)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
          }}
          size="small"
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        {/* ── Status Badge ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, mt: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            Status:
          </Typography>
          <Chip
            label={order.order_status}
            color={STATUS_CHIP_COLOR(order.order_status)}
            size="small"
            sx={{ borderRadius: '8px', fontWeight: 600, px: 1 }}
          />
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* ── Order Configuration ── */}
        <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Order Configuration
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <DetailRow label="Channel Type" value={order.channel_type} />
          </Grid>
          <Grid item xs={6}>
            <DetailRow label="Color" value={order.color} />
          </Grid>
          <Grid item xs={6}>
            <DetailRow label="Channel Length" value={getChannelLengthLabel(order.channel_length)} />
          </Grid>

          <Grid item xs={6}>
            <DetailRow label="Total Length" value={order.total_length ? `${order.total_length} ft` : '—'} />
          </Grid>
          <Grid item xs={6}>
            <DetailRow label="Total Pieces" value={order.total_pieces} />
          </Grid>
          <Grid item xs={6}>
            <DetailRow label="Final Length" value={order.final_length ? `${order.final_length} ft` : '—'} />
          </Grid>
          <Grid item xs={6}>
            <DetailRow
              label="Order Date"
              value={order.created_at}
              icon={<CalendarToday sx={{ fontSize: 18 }} />}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* ── Delivery Info ── */}
        <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Delivery Information
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <DetailRow
              label="Delivery Method"
              value={order.delivery_method === 'pickup' ? 'Pickup' : order.delivery_method === 'delivery' ? 'Delivery' : order.delivery_method || '—'}
              icon={order.delivery_method === 'delivery'
                ? <LocalShipping sx={{ fontSize: 18 }} />
                : <Store sx={{ fontSize: 18 }} />
              }
            />
          </Grid>
          {order.delivery_method === 'pickup' && (
            <>
              <Grid item xs={6}>
                <DetailRow label="Pickup Location" value={order.pickup_location} />
              </Grid>
              <Grid item xs={6}>
                <DetailRow
                  label="Pickup Date"
                  value={order.pickup_date ? formatDate(order.pickup_date) : '—'}
                  icon={<CalendarToday sx={{ fontSize: 18 }} />}
                />
              </Grid>
            </>
          )}
          {order.delivery_method === 'delivery' && (
            <>
              <Grid item xs={12}>
                <DetailRow
                  label="Delivery Date"
                  value={order.pickup_date ? formatDate(order.pickup_date) : '—'}
                  icon={<CalendarToday sx={{ fontSize: 18 }} />}
                />
              </Grid>
              <Grid item xs={12}>
                <DetailRow label="Delivery Address" value={order.delivery_address} />
              </Grid>
            </>
          )}
        </Grid>

        {/* ── Notes ── */}
        {(order.customer_notes || order.additional_notes) && (
          <>
            <Divider sx={{ my: 2.5 }} />
            <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Notes
            </Typography>
            {order.customer_notes && (
              <DetailRow label="Customer Notes" value={order.customer_notes} />
            )}
            {order.additional_notes && (
              <DetailRow label="Additional Notes" value={order.additional_notes} />
            )}
          </>
        )}

        {/* ── Actions ── */}
        {order.order_status === 'Pending' && (
          <>
            <Divider sx={{ my: 2.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => { onClose(); navigate(`/order/edit/${order.id}`); }}
                sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
              >
                Edit Order
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
