import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  TextareaAutosize, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Stack, FormControl, InputLabel, Select, MenuItem, Card
} from '@mui/material';
import { Search, Add, Edit, Visibility, FilterList, Check, Close, Email, Delete, Refresh } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from 'src/components/shared/ParentCard';
import ChildCard from 'src/components/shared/ChildCard';
import DataTable from 'src/components/shared/DataTable';

// ── Column definitions ─────────────────────────────────────────
const columns = [
  { field: 'orderNumber', label: 'Order #', bold: true, width: '150px', minWidth: '150px' },
  { field: 'date', label: 'Date', width: '120px', minWidth: '120px' },
  { field: 'customerName', label: 'Customer', bold: true, width: '150px', minWidth: '150px' },
  { field: 'companyName', label: 'Company', muted: true, width: '170px', minWidth: '170px' },
  { field: 'color', label: 'Color', type: 'chip', chipColor: () => 'primary', width: '120px', minWidth: '120px' },
  { field: 'finalOrder', label: 'Final Order', bold: true, width: '130px', minWidth: '130px' },
  {
    field: 'status',
    label: 'Status',
    type: 'chip',
    chipColor: (v) => ({ Confirmed: 'success', Pending: 'warning', Cancelled: 'error', Ready: 'info' }[v] || 'default'),
    width: '120px', minWidth: '120px',
  },
  { field: 'notes', label: 'Notes', width: '220px', minWidth: '220px' },
  { field: 'actions', label: 'Actions', width: '160px', minWidth: '160px' },
];
// Total = 150+120+150+170+120+130+120+220+160 = 1340px

// ── Sample data ────────────────────────────────────────────────
const sampleOrders = [
  { id: 1, orderNumber: 'ORD-2024-001', date: '2024-03-15', customerName: 'John Smith', companyName: 'ABC Construction', color: 'White', finalOrder: '216 ft', status: 'Pending', notes: 'Delivery by end of month', email: 'contact@abcconstruction.com' },
  { id: 2, orderNumber: 'ORD-2024-002', date: '2024-03-16', customerName: 'Sarah Johnson', companyName: 'XYZ Interiors', color: 'Black', finalOrder: '144 ft', status: 'Confirmed', notes: 'Ready for production', email: 'orders@xyzinteriors.com' },
  { id: 3, orderNumber: 'ORD-2024-003', date: '2024-03-17', customerName: 'Mike Wilson', companyName: 'Home Renovations Ltd', color: 'Red', finalOrder: '288 ft', status: 'Ready', notes: 'Awaiting delivery', email: 'info@homerenovations.com' },
  { id: 4, orderNumber: 'ORD-2024-004', date: '2024-03-18', customerName: 'Emily Davis', companyName: 'Commercial Spaces', color: 'Gray', finalOrder: '432 ft', status: 'Cancelled', notes: 'Project delayed', email: 'projects@commercialspaces.com' },
  { id: 5, orderNumber: 'ORD-2024-005', date: '2024-03-19', customerName: 'Robert Brown', companyName: 'Residential Builders', color: 'Blue', finalOrder: '168 ft', status: 'Pending', notes: 'Credit check needed', email: 'sales@residentialbuilders.com' },
];

const BCrumb = [
  { to: '/admin/dashboard', title: 'Home' },
  { title: 'Orders' },
];

const Orders = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notesDialog, setNotesDialog] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState({}); // Track which notes are being edited

  const filteredOrders = sampleOrders.filter((order) => {
    const matchesSearch = [order.orderNumber, order.customerName, order.companyName, order.color, order.status]
      .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleConfirmOrder = (order) => alert(`Order ${order.orderNumber} confirmed! Email sent to ${order.customerName}`);
  const handleCancelOrder = (order) => { if (window.confirm(`Cancel ${order.orderNumber}?`)) alert(`Cancelled. Email sent.`); };
  const handleReopenOrder = (order) => { if (window.confirm(`Reopen ${order.orderNumber}?`)) alert(`Order reopened. Email sent.`); };
  const handleDeleteOrder = (order) => { if (window.confirm(`Delete ${order.orderNumber}? This cannot be undone.`)) alert(`Order deleted.`); };
  const handleAddNotes = (order) => { setSelectedOrder(order); setOrderNotes(order.notes || ''); setNotesDialog(true); };
  const handleSaveNotes = () => { if (selectedOrder) { selectedOrder.notes = orderNotes; setNotesDialog(false); } };

  // Notes editing handlers
  const handleNotesChange = (orderId, value) => {
    setEditingNotes(prev => ({ ...prev, [orderId]: value }));
  };

  const handleNotesBlur = (orderId) => {
    const order = sampleOrders.find(o => o.id === orderId);
    if (order && editingNotes[orderId] !== undefined) {
      order.notes = editingNotes[orderId];
      // Clear editing state after saving
      setEditingNotes(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
    }
  };

  // Build rows with inline action buttons
  const rows = filteredOrders.map((order) => ({
    ...order,
    notes: (
      <TextareaAutosize
        value={editingNotes[order.id] !== undefined ? editingNotes[order.id] : (order.notes || '')}
        onChange={(e) => handleNotesChange(order.id, e.target.value)}
        onBlur={() => handleNotesBlur(order.id)}
        placeholder="Add notes..."
        minRows={1}
        maxRows={6}
        style={{
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          resize: 'vertical',
          overflow: 'auto',
          backgroundColor: editingNotes[order.id] !== undefined ? 'white' : 'transparent',
        }}
      />
    ),
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {order.status === 'Pending' && (
          <>
            <IconButton size="small" sx={{ color: palette.success.main }} onClick={() => handleConfirmOrder(order)} title="Confirm"><Check fontSize="small" /></IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => handleCancelOrder(order)} title="Cancel"><Close fontSize="small" /></IconButton>
          </>
        )}
        {order.status === 'Cancelled' && (
          <IconButton size="small" sx={{ color: palette.info.main }} onClick={() => handleReopenOrder(order)} title="Reopen"><Refresh fontSize="small" /></IconButton>
        )}
        <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => handleDeleteOrder(order)} title="Delete"><Delete fontSize="small" /></IconButton>
      </Stack>
    ),
  }));

  return (
    <PageContainer description="Confirm and manage customer orders">
      <Breadcrumb title="Orders" items={BCrumb} />

      {/* ── Header — wraps on small screens, never overflows ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="flex-end"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        {/* <Typography variant="h4" fontWeight={700}>Order Management</Typography> */}
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

      {/* ── Summary cards — Grid so they never overflow ── */}
      <Grid container spacing={3} mb={3}>
        {[
          {
            title: 'Total orders',
            count: filteredOrders.length,
            sub: 'All orders',
            accent: 'primary.main',
            dot: 'primary.main',
          },
          {
            title: 'Pending orders',
            count: filteredOrders.filter((o) => o.status === 'Pending').length,
            sub: 'Awaiting confirmation',
            accent: 'warning.main',
            dot: 'warning.main',
          },
          {
            title: 'Confirmed orders',
            count: filteredOrders.filter((o) => o.status === 'Confirmed').length,
            sub: 'Ready for production',
            accent: 'success.main',
            dot: 'success.main',
          },
          {
            title: 'Cancelled orders',
            count: filteredOrders.filter((o) => o.status === 'Cancelled').length,
            sub: 'Orders cancelled',
            accent: 'error.main',
            dot: 'error.main',
          },
        ].map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.title}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Top color band */}
              <Box
                sx={{
                  height: '4px',
                  backgroundColor: s.accent,
                }}
              />

              {/* Card body */}
              <Box sx={{ p: '18px 20px 16px' }}>
                {/* Number */}
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ lineHeight: 1, mb: '4px' }}
                >
                  {s.count}
                </Typography>

                {/* Title */}
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ mb: '4px' }}
                >
                  {s.title}
                </Typography>

                {/* Sub with dot */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: s.dot,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {s.sub}
                  </Typography>
                </Box>
              </Box>
            </Card>
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