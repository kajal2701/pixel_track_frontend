import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  IconButton, Stack, Card, CircularProgress,
} from '@mui/material';
import { Search, Add, Check, Close, Delete, Refresh, CheckCircle } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import DataTable from 'src/components/shared/DataTable';
import orderService from 'src/services/orderService';
import StatusDialog from './StatusDialog';
import NotesDialog from './NotesDialog';
import NotesCell from './NotesCell';
import { formatDate, ORDER_TABLE_DATA, getSummaryCardsData } from 'src/utils/helpers';

const columns = [
  { field: 'order_id', label: 'Order #', bold: true, width: '150px', minWidth: '150px' },
  { field: 'created_at', label: 'Date', width: '130px', minWidth: '130px' },
  { field: 'contact_name', label: 'Customer', bold: true, width: '150px', minWidth: '150px' },
  { field: 'company_name', label: 'Company', muted: true, width: '170px', minWidth: '170px' },
  { field: 'color', label: 'Color', type: 'chip', chipColor: () => 'primary', width: '120px', minWidth: '120px' },
  { field: 'final_length', label: 'Final Order', bold: true, width: '130px', minWidth: '130px' },
  { field: 'notes', label: 'Notes', width: '180px', minWidth: '180px' },
  { field: 'actions', label: 'Actions', width: '160px', minWidth: '160px' },
];

const BCrumb = [
  { to: '/admin/dashboard', title: 'Home' },
  { title: 'Orders' },
];

const Orders = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    Pending: '',
    Confirmed: '',
    Ready: '',
    Cancelled: ''
  });

  // Status dialog
  const [statusDialog, setStatusDialog] = useState({ open: false, type: null, order: null });

  // Notes dialog
  const [notesDialog, setNotesDialog] = useState({ open: false, order: null });

  // ── Fetch once on mount ──────────────────────────────────
  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders();
      const formatted = res.data.map((o) => ({
        ...o,
        created_at: formatDate(o.created_at),
        final_length: `${o.final_length} ft`,
      }));
      setAllOrders(formatted);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (status, value) => {
    setSearchTerms((prev) => ({ ...prev, [status]: value }));
  };

  const getFilteredOrders = (status) => {
    const term = searchTerms[status].toLowerCase();
    return allOrders.filter((order) => {
      if (order.order_status !== status) return false;
      if (!term) return true;

      return [
        order.order_id,
        order.contact_name,
        order.company_name,
        order.color,
        order.order_status,
        order.created_at,
        order.final_length,
        order.additional_notes,
      ].some((f) => f?.toString().toLowerCase().includes(term));
    });
  };

  const counts = {
    total: allOrders.length,
    pending: allOrders.filter((o) => o.order_status === 'Pending').length,
    confirmed: allOrders.filter((o) => o.order_status === 'Confirmed').length,
    ready: allOrders.filter((o) => o.order_status === 'Ready').length,
    cancelled: allOrders.filter((o) => o.order_status === 'Cancelled').length,
  };

  const summaryCardsData = getSummaryCardsData(counts);

  // ── Status dialog handlers ───────────────────────────────
  const openStatusDialog = (type, order) => setStatusDialog({ open: true, type, order });
  const closeStatusDialog = () => setStatusDialog({ open: false, type: null, order: null });

  const handleStatusConfirm = async (type, order) => {
    const statusMap = {
      CONFIRM: 'Confirmed',
      CANCEL: 'Cancelled',
      REOPEN: 'Pending',
      READY: 'Ready',
    };

    if (type === 'DELETE') {
      setActionLoading(true);
      try {
        await orderService.deleteOrder(order.id);
        toast.success(`Order ${order.order_id} deleted.`);
        setAllOrders((prev) => prev.filter((o) => o.id !== order.id));
        closeStatusDialog();
      } catch (err) {
        toast.error(err.message || 'Failed to delete order.');
      } finally {
        setActionLoading(false);
      }
      return;
    }

    const newStatus = statusMap[type];
    if (!newStatus) return;

    setActionLoading(true);
    try {
      await orderService.updateStatus(order.id, newStatus);
      toast.success(`Order ${order.order_id} → ${newStatus}`);
      // Update locally — no re-fetch needed
      setAllOrders((prev) =>
        prev.map((o) => o.id === order.id ? { ...o, order_status: newStatus } : o)
      );
      closeStatusDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Notes dialog handlers ────────────────────────────────
  const openNotesDialog = (order) => setNotesDialog({ open: true, order });
  const closeNotesDialog = () => setNotesDialog({ open: false, order: null });

  const handleSaveNotes = async (order, notes) => {
    setActionLoading(true);
    try {
      await orderService.updateNotes(order.id, notes);
      toast.success('Notes saved.');
      // Update locally
      setAllOrders((prev) =>
        prev.map((o) => o.id === order.id ? { ...o, additional_notes: notes } : o)
      );
      closeNotesDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to save notes.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Build rows with action buttons + notes cell ──────────
  const buildRows = (filteredOrders) => filteredOrders.map((order) => ({
    ...order,
    notes: (
      <NotesCell order={order} onOpenNotes={openNotesDialog} />
    ),
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {order.order_status === 'Pending' && (
          <>
            <IconButton size="small" sx={{ color: palette.success.main }} onClick={() => openStatusDialog('CONFIRM', order)} title="Confirm">
              <Check fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.info.main }} onClick={() => openStatusDialog('READY', order)} title="Mark Ready">
              <CheckCircle fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('CANCEL', order)} title="Cancel">
              <Close fontSize="small" />
            </IconButton>
          </>
        )}
        {order.order_status === 'Confirmed' && (
          <>
            <IconButton size="small" sx={{ color: palette.info.main }} onClick={() => openStatusDialog('READY', order)} title="Mark Ready">
              <CheckCircle fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('CANCEL', order)} title="Cancel">
              <Close fontSize="small" />
            </IconButton>
          </>
        )}
        {order.order_status === 'Ready' && (
          <>
            <IconButton size="small" sx={{ color: palette.warning.main }} onClick={() => openStatusDialog('REOPEN', order)} title="Move to Pending">
              <Refresh fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('CANCEL', order)} title="Cancel">
              <Close fontSize="small" />
            </IconButton>
          </>
        )}
        {order.order_status === 'Cancelled' && (
          <IconButton size="small" sx={{ color: palette.info.main }} onClick={() => openStatusDialog('REOPEN', order)} title="Reopen">
            <Refresh fontSize="small" />
          </IconButton>
        )}
        <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('DELETE', order)} title="Delete">
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    ),
  }));

  return (
    <PageContainer description="Confirm and manage customer orders">
      <Breadcrumb title="Orders" items={BCrumb} />

      {/* ── Header ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="flex-end"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/admin/customers')} sx={{ borderRadius: '8px' }}>
          Manage Customers
        </Button>
      </Stack>

      {/* ── Summary Cards ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 3, mb: 4 }}>
        {summaryCardsData.map((s) => (
          <Card
            key={s.title}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px',
              overflow: 'hidden',
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                borderColor: s.accent
              }
            }}
            onClick={() => {
              const el = document.getElementById(s.target);
              if (el) {
                // Determine vertical offset for fixed header
                const yOffset = -100;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
          >
            <Box sx={{ height: '4px', backgroundColor: s.accent }} />
            <Box sx={{ p: '18px 20px 16px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 4px)' }}>
              <Typography variant="h3" fontWeight={700} sx={{ lineHeight: 1, mb: '8px' }}>{s.count}</Typography>
              <Typography variant="body1" fontWeight={500} sx={{ mb: '4px' }}>{s.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: 'auto' }}>
                <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.dot, flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary">{s.sub}</Typography>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* ── Tables ── */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={4} id="tables-container">
          {ORDER_TABLE_DATA.map(({ status, title, subtitle, color }) => {
            const currentRows = buildRows(getFilteredOrders(status));
            const themeColor = palette[color].main;
            return (
              <Card
                id={`table-${status}`}
                key={status}
                variant="outlined"
                sx={{
                  borderRadius: '12px',
                  borderColor: themeColor,
                  borderWidth: 1,
                  boxShadow: `0 4px 20px ${alpha(themeColor, 0.1)}`,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{
                  bgcolor: alpha(themeColor, 0.05),
                  p: 2.5,
                  borderBottom: `2px solid ${themeColor}`
                }}>
                  <Typography variant="h5" fontWeight={600} color={themeColor}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {subtitle}
                  </Typography>
                </Box>

                <Box p={3}>
                  <Box mb={3}>
                    <TextField
                      fullWidth
                      placeholder={`Search within ${title.toLowerCase()} (e.g. order #, customer, etc.)...`}
                      value={searchTerms[status]}
                      onChange={(e) => handleSearchChange(status, e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: palette.text.secondary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      size="small"
                    />
                  </Box>
                  <DataTable
                    rows={currentRows}
                    columns={columns}
                    defaultRows={5}
                    emptyMessage={`No ${title.toLowerCase()} found.`}
                  />
                </Box>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* ── Dialogs ── */}
      <StatusDialog
        open={statusDialog.open}
        type={statusDialog.type}
        order={statusDialog.order}
        onClose={closeStatusDialog}
        onConfirm={handleStatusConfirm}
        loading={actionLoading}
      />

      <NotesDialog
        open={notesDialog.open}
        order={notesDialog.order}
        onClose={closeNotesDialog}
        onSave={handleSaveNotes}
        loading={actionLoading}
      />

    </PageContainer>
  );
};

export default Orders;
