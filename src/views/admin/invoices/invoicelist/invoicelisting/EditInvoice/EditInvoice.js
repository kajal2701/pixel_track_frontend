import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Divider, CircularProgress, Stack, Paper,
  Dialog, DialogContent, IconButton,
} from '@mui/material';
import { ArrowBack, Save, CheckCircle, Visibility, Close } from '@mui/icons-material';
import toast from 'react-hot-toast';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import invoiceService from 'src/services/invoiceService';

import AddressHeader from './AddressHeader';
import LineItemsTable from './LineItemsTable';
import NotesAndTotals from './NotesAndTotals';
import ConfirmDialogs from './ConfirmDialogs';


const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extraWork, setExtraWork] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(5);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [screenshotDialog, setScreenshotDialog] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await invoiceService.getById(id);
      const inv = res.data;
      setInvoice(inv);
      setDiscount(inv.discount_pct ?? 0);
      setGstRate(inv.gst_pct ?? 5);
      setExtraWork(
        inv.extra_work
          ? (typeof inv.extra_work === 'string' ? JSON.parse(inv.extra_work) : inv.extra_work)
          : []
      );
    } catch (err) {
      toast.error(err.message || 'Failed to load invoice.');
    } finally {
      setLoading(false);
    }
  };

  // Pricing calculations
  const orderDetails = invoice?.order_details
    ? (typeof invoice.order_details === 'string' ? JSON.parse(invoice.order_details) : invoice.order_details)
    : [];

  const mainTotal = orderDetails.reduce((sum, ord) => sum + parseFloat(ord.subtotal || 0), 0);
  const extraTotal = extraWork.reduce((sum, row) => sum + parseFloat(row.qty || 0) * parseFloat(row.unit_price || 0), 0);
  const subtotal = mainTotal + extraTotal;
  const discountPct = Math.min(Math.max(parseFloat(discount) || 0, 0), 100);
  const discountAmount = subtotal * (discountPct / 100);
  const gstPct = Math.min(Math.max(parseFloat(gstRate) || 0, 0), 100);
  const gst = (subtotal - discountAmount) * (gstPct / 100);
  const grandTotal = subtotal - discountAmount + gst;

  // Extra work helpers
  const addExtraRow = () =>
    setExtraWork(prev => [...prev, { id: Date.now(), description: '', qty: 1, unit_price: 0 }]);
  const updateExtraRow = (rowId, field, value) =>
    setExtraWork(prev => prev.map(r => r.id === rowId ? { ...r, [field]: value } : r));
  const removeExtraRow = (rowId) =>
    setExtraWork(prev => prev.filter(r => r.id !== rowId));

  // Dialogs
  const [saveDialog, setSaveDialog] = useState(false);
  const [confirmPaymentDialog, setConfirmPaymentDialog] = useState(false);
  const [extraWorkErrors, setExtraWorkErrors] = useState({});

  const validateExtraWork = () => {
    if (extraWork.length === 0) { setExtraWorkErrors({}); return true; }
    const errs = {};
    extraWork.forEach((row) => {
      const rowErrs = {};
      if (!row.description || !row.description.trim()) rowErrs.description = 'Description is required';
      if (!row.qty || parseFloat(row.qty) <= 0) rowErrs.qty = 'Qty must be > 0';
      if (!row.unit_price || parseFloat(row.unit_price) <= 0) rowErrs.unit_price = 'Price must be > 0';
      if (Object.keys(rowErrs).length > 0) errs[row.id] = rowErrs;
    });
    setExtraWorkErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdateExtraRow = (rowId, field, value) => {
    updateExtraRow(rowId, field, value);
    setExtraWorkErrors(prev => {
      if (!prev[rowId]) return prev;
      const updated = { ...prev[rowId] };
      delete updated[field];
      if (Object.keys(updated).length === 0) {
        const { [rowId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [rowId]: updated };
    });
  };

  const handleSaveClick = () => {
    if (!validateExtraWork()) return;
    setSaveDialog(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveDialog(false);
    try {
      const res = await invoiceService.update(invoice.id, {
        extra_work: extraWork,
        extra_work_total: extraTotal,
        discount_pct: discountPct,
        discount_amount: discountAmount,
        gst_pct: gstPct,
        gst_amount: gst,
        total_amount: grandTotal,
      });
      // Fetch fresh data from the server to ensure all fields are fully up to date
      await fetchData();
      toast.success('Saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      await invoiceService.confirmPayment(invoice.id);
      toast.success('Payment confirmed successfully!');
      await fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to confirm payment.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!invoice) return null;

  const BCrumb = [
    { to: '/admin/dashboard', title: 'Home' },
    { to: '/admin/invoices', title: 'Invoices' },
    { title: `Edit ${invoice.invoice_number}` },
  ];

  return (
    <PageContainer title={`Edit Invoice — ${invoice.invoice_number}`} description="Edit Invoice Details">
      <Breadcrumb title={`Edit Invoice — ${invoice.invoice_number}`} items={BCrumb} />

      <Box className="no-print" sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/invoices')}
          sx={{ fontSize: '0.9rem' }}
        >
          Back to Invoices
        </Button>
      </Box>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px',
          overflow: 'hidden',
          mx: 'auto',
        }}
      >
        <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: 'background.paper' }}>

          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: '1.4rem' }}>
            Edit Invoice — {invoice.invoice_number}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <AddressHeader invoice={invoice} />

          <LineItemsTable
            invoice={invoice}
            extraWork={extraWork}
            updateExtraRow={handleUpdateExtraRow}
            removeExtraRow={removeExtraRow}
            addExtraRow={addExtraRow}
            extraWorkErrors={extraWorkErrors}
          />

          <Divider sx={{ mb: 4 }} />

          <NotesAndTotals
            orders={invoice.orders || []}
            discount={discount} setDiscount={setDiscount}
            gstRate={gstRate} setGstRate={setGstRate}
            mainTotal={mainTotal} extraTotal={extraTotal}
            discountPct={discountPct} discountAmount={discountAmount}
            gstPct={gstPct} gst={gst} grandTotal={grandTotal}
          />

          <Divider sx={{ mb: 3 }} />
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              color="primary"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />}
              onClick={handleSaveClick}
              disabled={saving}
              sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>



            {/* Confirm Payment button — only when 'Payment Submitted' */}
            {invoice.status === 'Payment Submitted' && (
              <Button
                id="btn-confirm-payment"
                variant="contained"
                onClick={() => setConfirmPaymentDialog(true)}
                disabled={confirming}
                startIcon={confirming ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
                sx={{
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  bgcolor: '#198754',
                  color: 'common.white',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#157347' },
                }}
              >
                {confirming ? 'Confirming...' : 'Confirm Payment'}
              </Button>
            )}
          </Stack>

          {/* Payment Screenshot — View button + Modal */}
          {invoice.status === 'Payment Submitted' && invoice.payment_screenshot && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={() => setScreenshotDialog(true)}
                sx={{ borderRadius: '8px', fontWeight: 600, textTransform: 'none' }}
              >
                View Payment Screenshot
              </Button>

              <Dialog
                open={screenshotDialog}
                onClose={() => setScreenshotDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px', overflow: 'hidden' } }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 2 }}>
                  <Typography variant="h6" fontWeight={700}>Payment Screenshot</Typography>
                  <IconButton onClick={() => setScreenshotDialog(false)} size="small">
                    <Close />
                  </IconButton>
                </Box>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <Box
                    component="img"
                    src={invoiceService.getPaymentScreenshotUrl(invoice.id)}
                    alt="Payment Screenshot"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      borderRadius: '12px',
                      objectFit: 'contain',
                    }}
                  />
                </DialogContent>
              </Dialog>
            </Box>
          )}

          {/* Paid confirmation badge */}
          {invoice.status === 'Paid' && (
            <Box sx={{ mt: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 24 }} />
                <Typography variant="subtitle2" fontWeight={700} color="success.main">
                  Payment Confirmed
                </Typography>
                {invoice.payment_confirmed_at && (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    — {new Date(invoice.payment_confirmed_at).toLocaleDateString()}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          <ConfirmDialogs
            saveDialog={saveDialog} setSaveDialog={setSaveDialog}
            handleSave={handleSave}
            saving={saving}
            confirmPaymentDialog={confirmPaymentDialog}
            setConfirmPaymentDialog={setConfirmPaymentDialog}
            handleConfirmPayment={handleConfirmPayment}
            confirming={confirming}
          />


        </Box>
      </Paper>
    </PageContainer>
  );
};

export default EditInvoice;
