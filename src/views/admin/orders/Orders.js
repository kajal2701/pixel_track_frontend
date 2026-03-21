import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  TextareaAutosize, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Stack,
} from '@mui/material';
import { Search, Add, Edit, Visibility, FilterList, Check, Close, Email } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from 'src/components/shared/ParentCard';
import ChildCard from 'src/components/shared/ChildCard';
import DataTable from 'src/components/shared/DataTable';

// ── Column definitions ─────────────────────────────────────────
const columns = [
  { field: 'orderNumber', label: 'Order #',     bold: true,  width: '14%' },
  { field: 'date',        label: 'Date',                      width: '12%' },
  { field: 'customerName',label: 'Customer',   bold: true,  width: '20%' },
  { field: 'color',       label: 'Color',       type: 'chip', chipColor: () => 'primary', width: '10%' },
  { field: 'finalOrder',  label: 'Final Order', bold: true,  width: '12%' },
  {
    field: 'status',
    label: 'Status',
    type: 'chip',
    chipColor: (v) => ({ Confirmed: 'success', Pending: 'warning', Cancelled: 'error', Ready: 'info' }[v] || 'default'),
    width: '11%',
  },
  { field: 'actions', label: 'Actions', width: '21%' },
];

// ── Sample data ────────────────────────────────────────────────
const sampleOrders = [
  { id: 1, orderNumber: 'ORD-2024-001', date: '2024-03-15', customerName: 'ABC Construction',    color: 'White', finalOrder: '216 ft', status: 'Pending',   notes: 'Delivery by end of month', email: 'contact@abcconstruction.com' },
  { id: 2, orderNumber: 'ORD-2024-002', date: '2024-03-16', customerName: 'XYZ Interiors',       color: 'Black', finalOrder: '144 ft', status: 'Confirmed', notes: 'Ready for production',      email: 'orders@xyzinteriors.com' },
  { id: 3, orderNumber: 'ORD-2024-003', date: '2024-03-17', customerName: 'Home Renovations Ltd',color: 'Red',   finalOrder: '288 ft', status: 'Ready',     notes: 'Awaiting delivery',         email: 'info@homerenovations.com' },
  { id: 4, orderNumber: 'ORD-2024-004', date: '2024-03-18', customerName: 'Commercial Spaces',   color: 'Gray',  finalOrder: '432 ft', status: 'Cancelled', notes: 'Project delayed',           email: 'projects@commercialspaces.com' },
  { id: 5, orderNumber: 'ORD-2024-005', date: '2024-03-19', customerName: 'Residential Builders', color: 'Blue', finalOrder: '168 ft', status: 'Pending',   notes: 'Credit check needed',       email: 'sales@residentialbuilders.com' },
];

const BCrumb = [
  { to: '/admin/dashboard', title: 'Home' },
  { title: 'Orders' },
];

const Orders = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm]   = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notesDialog, setNotesDialog] = useState(false);
  const [orderNotes, setOrderNotes]   = useState('');

  const filteredOrders = sampleOrders.filter((order) =>
    [order.orderNumber, order.customerName, order.color, order.status]
      .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleConfirmOrder  = (order) => alert(`Order ${order.orderNumber} confirmed! Email sent to ${order.customerName}`);
  const handleCancelOrder   = (order) => { if (window.confirm(`Cancel ${order.orderNumber}?`)) alert(`Cancelled. Email sent.`); };
  const handleViewOrder     = (order) => alert(`Order: ${order.orderNumber}\nCustomer: ${order.customerName}\nStatus: ${order.status}\nNotes: ${order.notes}`);
  const handleEmailCustomer = (order) => alert(`Email sent to ${order.customerName} (${order.email})`);
  const handleAddNotes      = (order) => { setSelectedOrder(order); setOrderNotes(order.notes || ''); setNotesDialog(true); };
  const handleSaveNotes     = () => { if (selectedOrder) { selectedOrder.notes = orderNotes; setNotesDialog(false); } };

  // Build rows with inline action buttons
  const rows = filteredOrders.map((order) => ({
    ...order,
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {order.status === 'Pending' && (
          <>
            <IconButton size="small" sx={{ color: palette.success.main }} onClick={() => handleConfirmOrder(order)} title="Confirm"><Check fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }}   onClick={() => handleCancelOrder(order)}  title="Cancel"><Close fontSize="small" /></IconButton>
          </>
        )}
        <IconButton size="small" sx={{ color: palette.info.main }}    onClick={() => handleViewOrder(order)}     title="View"><Visibility fontSize="small" /></IconButton>
        <IconButton size="small" sx={{ color: palette.primary.main }} onClick={() => handleEmailCustomer(order)} title="Email"><Email fontSize="small" /></IconButton>
        <IconButton size="small" sx={{ color: palette.warning.main }} onClick={() => handleAddNotes(order)}      title="Notes"><Edit fontSize="small" /></IconButton>
      </Stack>
    ),
  }));

  return (
    <PageContainer title="Order Management" description="Confirm and manage customer orders">
      <Breadcrumb title="Orders" items={BCrumb} />

      {/* ── Header — wraps on small screens, never overflows ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>Order Management</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: '8px' }}>
            Filter
          </Button>
          <Button variant="contained" startIcon={<Add />} href="/admin/customers" sx={{ borderRadius: '8px' }}>
            Manage Customers
          </Button>
        </Stack>
      </Stack>

      {/* ── Search ── */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search by order number, customer, color or status..."
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

      {/* ── Summary cards — Grid so they never overflow ── */}
      <Grid container spacing={3} mb={3}>
        {[
          { title: 'Pending Orders',   count: filteredOrders.filter((o) => o.status === 'Pending').length,   color: 'warning.main', sub: 'Awaiting confirmation' },
          { title: 'Confirmed Orders', count: filteredOrders.filter((o) => o.status === 'Confirmed').length, color: 'success.main', sub: 'Ready for production'  },
          { title: 'Ready Orders',     count: filteredOrders.filter((o) => o.status === 'Ready').length,     color: 'info.main',    sub: 'Awaiting delivery'     },
        ].map((s) => (
          <Grid item xs={12} sm={4} key={s.title}>
            <ChildCard title={s.title}>
              <Typography variant="h4" fontWeight="600" color={s.color}>{s.count}</Typography>
              <Typography variant="body2" color="textSecondary">{s.sub}</Typography>
            </ChildCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Orders table ── */}
      <ParentCard title="All Orders">
        <DataTable rows={rows} columns={columns} defaultRows={10} />
      </ParentCard>

      {/* ── Notes Dialog ── */}
      <Dialog open={notesDialog} onClose={() => setNotesDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Notes — {selectedOrder?.orderNumber}</DialogTitle>
        <DialogContent>
          <TextareaAutosize
            minRows={4}
            placeholder="Add additional notes for this order..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${palette.divider}`,
              fontFamily: 'inherit',
              fontSize: '14px',
              marginTop: '8px',
              boxSizing: 'border-box',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveNotes} variant="contained">Save Notes</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Orders;