import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button,
  TableHead, Grid, Stack, Divider
} from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';
import toast from 'react-hot-toast';
import invoiceService from 'src/services/invoiceService';
import Logo from 'src/assets/images/logos/PiXEL-Tracks-Lights_Logo-White.webp';
import PaymentDialog from './PaymentDialog';
import { formatDate, PIXEL_TRACK } from 'src/utils/helpers';

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  const handleDownload = () => {
    window.print();
  };

  const handlePayment = async (screenshotFile) => {
    try {
      await invoiceService.submitPayment(invoice.id, screenshotFile);
      toast.success('Payment screenshot uploaded successfully!');
      setOpenPaymentDialog(false);
      fetchInvoiceDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to submit payment.');
      throw err;
    }
  };

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    setLoading(true);
    try {
      const res = await invoiceService.getById(id);
      setInvoice(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load invoice details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f4f6f9', p: 3 }}>
        <Typography variant="h5" color="error" gutterBottom>Invoice Not Found</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const extraWork = invoice.extra_work
    ? (typeof invoice.extra_work === 'string' ? JSON.parse(invoice.extra_work) : invoice.extra_work)
    : [];

  const orders = invoice.orders || [];
  const orderDetails = invoice.order_details
    ? (typeof invoice.order_details === 'string' ? JSON.parse(invoice.order_details) : invoice.order_details)
    : [];

  const mainTotal = orderDetails.reduce((sum, ord) => sum + parseFloat(ord.subtotal || 0), 0);
  const extraTotal = parseFloat(invoice.extra_work_total || 0);
  const subtotal = mainTotal + extraTotal;
  const discountPct = parseFloat(invoice.discount_pct || 0);
  const discountAmount = parseFloat(invoice.discount_amount || 0);
  const gstPct = parseFloat(invoice.gst_pct || 5);
  const gstAmount = parseFloat(invoice.gst_amount || 0);
  const grandTotal = parseFloat(invoice.total_amount || 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f9', py: { xs: 2, md: 5 }, px: { xs: 1.5, md: 3 } }}>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .invoice-paper { 
            box-shadow: none !important; 
            border: none !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            border-radius: 0 !important; 
          }
        }
      `}</style>

      <Paper
        className="invoice-paper"
        elevation={0}
        sx={{
          maxWidth: '1100px',
          mx: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            bgcolor: '#0c101a',
            py: 4,
            px: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src={Logo} alt="Pixel Track Logo" style={{ height: '70px', objectFit: 'contain' }} />
        </Box>

        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Left Column: From */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.95rem' }}>Invoice From:</Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '1.25rem', my: 1 }}>
                  {PIXEL_TRACK.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>{PIXEL_TRACK.address}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>{PIXEL_TRACK.city} {PIXEL_TRACK.province}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>{PIXEL_TRACK.email}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>{PIXEL_TRACK.phone}</Typography>
              </Box>
            </Grid>

            {/* Right Column: To + Invoice Details */}
            <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.95rem' }}>Invoice To:</Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '1.25rem', my: 1 }}>
                  {invoice.contact_name || 'Valued Customer'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.2, fontSize: '0.95rem' }}>
                  {invoice.company_name || '—'}
                </Typography>
                {invoice.email && <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>{invoice.email}</Typography>}
                {invoice.phone && <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>{invoice.phone}</Typography>}

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                    Invoice #: <span style={{ fontWeight: 400, color: '#475569' }}>{invoice.invoice_number}</span>
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                    Date: <span style={{ fontWeight: 400, color: '#475569' }}>{formatDate(invoice.created_at)}</span>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: '1.1rem' }}>
            Invoice Details
          </Typography>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              mb: 3,
              overflow: 'hidden'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f4f6fa' }}>
                  <TableCell sx={{ fontWeight: 700, py: 1.5 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 1.5, textAlign: 'right' }}>Qty / Length</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 1.5, textAlign: 'right' }}>Unit Price</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 1.5, textAlign: 'right' }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, idx) => {
                  const details = orderDetails.find(d => d.order_id === order.id) || {};
                  const unitPrice = parseFloat(details.unit_price || 0);
                  const itemSubtotal = parseFloat(details.subtotal || 0);

                  return (
                    <TableRow key={`order-${order.id}`}>
                      <TableCell sx={{ py: 1.5 }}>{idx + 1}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" fontWeight={600}>
                          Pixel Track Channel — {order.color || '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Order: {order.order_id} | Type: {order.channel_type || '—'} | Hole Dist: {order.hole_distance || '—'} | Pieces: {order.total_pieces || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, textAlign: 'right' }}>
                        {order.final_length ? `${parseFloat(order.final_length).toFixed(2)} ft` : '—'}
                      </TableCell>
                      <TableCell sx={{ py: 1.5, textAlign: 'right' }}>
                        {unitPrice ? `$${unitPrice.toFixed(2)} / ft` : '—'}
                      </TableCell>
                      <TableCell sx={{ py: 1.5, textAlign: 'right', fontWeight: 600 }}>
                        ${itemSubtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {extraWork.map((item, idx) => (
                  <TableRow key={item.id || idx} sx={{ bgcolor: '#fffdf0' }}>
                    <TableCell sx={{ py: 1.5 }}>{orders.length + idx + 1}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {item.description || 'Extra Work Item'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, textAlign: 'right' }}>
                      {item.qty || 1}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, textAlign: 'right' }}>
                      ${parseFloat(item.unit_price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, textAlign: 'right', fontWeight: 600 }}>
                      ${(parseFloat(item.qty || 0) * parseFloat(item.unit_price || 0)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={4} sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={12} md={6}>
              {orders.some(o => o.customer_notes) && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Customer Notes
                  </Typography>
                  <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', p: 2, bgcolor: 'grey.50', mb: 2 }}>
                    {orders.filter(o => o.customer_notes).map(o => (
                      <Typography key={`note-${o.id}`} variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                        <strong>{o.order_id}:</strong> {o.customer_notes}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" color="text.secondary">Subtotal:</Typography>
                  <Typography variant="subtitle1" fontWeight={600}>${subtotal.toFixed(2)}</Typography>
                </Box>

                {discountAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" color="text.secondary">Discount ({discountPct}%):</Typography>
                    <Typography variant="subtitle1" fontWeight={600} color="error.main">-${discountAmount.toFixed(2)}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" color="text.secondary">GST ({gstPct}%):</Typography>
                  <Typography variant="subtitle1" fontWeight={600}>${gstAmount.toFixed(2)}</Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={800}>Total Amount:</Typography>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    ${grandTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#334155' }}>
              <Phone fontSize="small" />
              <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{PIXEL_TRACK.phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#334155' }}>
              <Email fontSize="small" />
              <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{PIXEL_TRACK.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#334155' }}>
              <LocationOn fontSize="small" />
              <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{PIXEL_TRACK.address} {PIXEL_TRACK.city} {PIXEL_TRACK.province}</Typography>
            </Box>
          </Box>

          <Box className="no-print" sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={2} justifyContent="center">
              {invoice.status === 'Sent' && (
                <Button
                  id="btn-confirm-pay"
                  variant="contained"
                  onClick={() => setOpenPaymentDialog(true)}
                  sx={{
                    borderRadius: '12px',
                    px: 4,
                    py: 1.2,
                    fontWeight: 600,
                    bgcolor: '#198754',
                    color: 'common.white',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#157347' },
                  }}
                >
                  Confirm & Pay
                </Button>
              )}
              <Button
                id="btn-download-invoice"
                variant="outlined"
                color="primary"
                onClick={handleDownload}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Download Invoice
              </Button>
            </Stack>
          </Box>

        </Box>
      </Paper>

      <PaymentDialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        amount={invoice ? invoice.total_amount : 0}
        invoiceNumber={invoice ? invoice.invoice_number : ''}
        onPay={handlePayment}
      />
    </Box>
  );
};

export default ViewInvoice;
