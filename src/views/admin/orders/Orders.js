import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  IconButton, Grid, Stack, FormControl, InputLabel,
  Select, MenuItem, Card, CircularProgress,
} from '@mui/material';
import { Search, Add, Check, Close, Delete, Refresh, CheckCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import toast from 'react-hot-toast';

import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from 'src/components/shared/ParentCard';
import DataTable from 'src/components/shared/DataTable';
import orderService from 'src/services/orderService';
import StatusDialog from './StatusDialog';
import NotesDialog from './NotesDialog';
import NotesCell from './NotesCell';
import { formatDate } from 'src/utils/helpers';




const columns = [
  { field: 'order_id',     label: 'Order #',     bold: true,  width: '150px', minWidth: '150px' },
  { field: 'created_at',   label: 'Date',                      width: '130px', minWidth: '130px' },
  { field: 'contact_name', label: 'Customer',    bold: true,  width: '150px', minWidth: '150px' },
  { field: 'company_name', label: 'Company',     muted: true, width: '170px', minWidth: '170px' },
  { field: 'color',        label: 'Color',       type: 'chip', chipColor: () => 'primary', width: '120px', minWidth: '120px' },
  { field: 'final_length', label: 'Final Order', bold: true,  width: '130px', minWidth: '130px' },
  {
    field: 'order_status',
    label: 'Status',
    type: 'chip',
    chipColor: (v) => ({ Confirmed: 'success', Pending: 'warning', Cancelled: 'error', Ready: 'info' }[v] || 'default'),
    width: '120px', minWidth: '120px',
  },
  { field: 'notes',   label: 'Notes',   width: '180px', minWidth: '180px' },
  { field: 'actions', label: 'Actions', width: '160px', minWidth: '160px' },
];

const BCrumb = [
  { to: '/admin/dashboard', title: 'Home' },
  { title: 'Orders' },
];

const SUMMARY_CARDS = (counts) => [
  { title: 'Total Orders',     count: counts.total,     sub: 'All orders',           accent: 'primary.main', dot: 'primary.main' },
  { title: 'Pending Orders',   count: counts.pending,   sub: 'Awaiting confirmation', accent: 'warning.main', dot: 'warning.main' },
  { title: 'Confirmed Orders', count: counts.confirmed, sub: 'Ready for production',  accent: 'success.main', dot: 'success.main' },
  { title: 'Cancelled Orders', count: counts.cancelled, sub: 'Orders cancelled',      accent: 'error.main',   dot: 'error.main'   },
];

const Orders = () => {
  const { palette } = useTheme();

  // ── State ────────────────────────────────────────────────
  const [allOrders, setAllOrders]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');

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
        created_at:   formatDate(o.created_at),
        final_length: `${o.final_length} ft`,
      }));
      setAllOrders(formatted);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  // ── Local filter — no API call ───────────────────────────
const filteredOrders = allOrders.filter((order) => {
  const q = searchTerm.toLowerCase();
  const matchesSearch = [
    order.order_id,
    order.contact_name,
    order.company_name,
    order.color,
    order.order_status,
    order.created_at,           // ← date
    order.final_length,         // ← final length
    order.additional_notes,     // ← notes description
  ].some((f) => f?.toLowerCase().includes(q));

  const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
  return matchesSearch && matchesStatus;
});

  const counts = {
    total:     filteredOrders.length,
    pending:   filteredOrders.filter((o) => o.order_status === 'Pending').length,
    confirmed: filteredOrders.filter((o) => o.order_status === 'Confirmed').length,
    cancelled: filteredOrders.filter((o) => o.order_status === 'Cancelled').length,
  };

  // ── Status dialog handlers ───────────────────────────────
  const openStatusDialog = (type, order) => setStatusDialog({ open: true, type, order });
  const closeStatusDialog = () => setStatusDialog({ open: false, type: null, order: null });

  const handleStatusConfirm = async (type, order) => {
    const statusMap = {
      CONFIRM: 'Confirmed',
      CANCEL:  'Cancelled',
      REOPEN:  'Pending',
      READY:   'Ready',
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
  const openNotesDialog  = (order) => setNotesDialog({ open: true, order });
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
  const rows = filteredOrders.map((order) => ({
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
            <IconButton size="small" sx={{ color: palette.warning.main }} onClick={() => openStatusDialog('READY', order)} title="Mark Ready">
              <CheckCircle fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('CANCEL', order)} title="Cancel">
              <Close fontSize="small" />
            </IconButton>
          </>
        )}
        {order.order_status === 'Confirmed' && (
          <IconButton size="small" sx={{ color: palette.info.main }} onClick={() => openStatusDialog('READY', order)} title="Mark Ready">
            <CheckCircle fontSize="small" />
          </IconButton>
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
        <Stack direction="row" gap={1} flexWrap="wrap">
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Ready">Ready</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Add />} href="/admin/customers" sx={{ borderRadius: '8px' }}>
            Manage Customers
          </Button>
        </Stack>
      </Stack>

      {/* ── Search ── */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search by order number, customer, company, color or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Box>

      {/* ── Summary Cards ── */}
      <Grid container spacing={3} mb={3}>
        {SUMMARY_CARDS(counts).map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.title}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', overflow: 'hidden' }}>
              <Box sx={{ height: '4px', backgroundColor: s.accent }} />
              <Box sx={{ p: '18px 20px 16px' }}>
                <Typography variant="h3" fontWeight={700} sx={{ lineHeight: 1, mb: '4px' }}>{s.count}</Typography>
                <Typography variant="body1" fontWeight={500} sx={{ mb: '4px' }}>{s.title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.dot, flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary">{s.sub}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Table ── */}
      <ParentCard title="All Orders">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable rows={rows} columns={columns} defaultRows={10} />
        )}
      </ParentCard>

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
