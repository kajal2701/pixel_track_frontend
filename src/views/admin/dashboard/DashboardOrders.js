import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Box, TextField, InputAdornment, IconButton, Stack, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Search, Add, Check, Close, Delete, LocalShipping, CheckCircle } from '@mui/icons-material';

import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';

import orderService from '../../../services/orderService';
import productionService from '../../../services/productionService';

import StatusDialog from '../orders/StatusDialog';
import NotesDialog from '../orders/NotesDialog';
import NotesCell from '../orders/NotesCell';
import ProductionRequestDialog from '../orders/ProductionRequestDialog';
import DispatchDialog from '../orders/DispatchDialog';
import OrderDetailModal from '../../customer/order/OrderDetailModal';

const DashboardOrders = ({ allOrders, loading, fetchOrders }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  const [actionLoading, setActionLoading] = useState(false);

  // Dashboard Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Dialog States
  const [statusDialog, setStatusDialog] = useState({ open: false, type: null, order: null });
  const [notesDialog, setNotesDialog] = useState({ open: false, order: null });
  const [productionDialog, setProductionDialog] = useState({ open: false, order: null, inventoryResult: null });
  const [dispatchDialog, setDispatchDialog] = useState({ open: false, order: null });
  const [detailModal, setDetailModal] = useState({ open: false, order: null });

  // Filtered Orders for the Table
  const filteredOrders = allOrders.filter(order => {
    if (statusFilter !== 'All' && order.order_status !== statusFilter) return false;
    if (!searchQuery) return true;

    const term = searchQuery.toLowerCase();
    return [
      order.order_id,
      order.contact_name,
      order.company_name,
      order.order_status,
      order.final_length,
    ].some((f) => f?.toString().toLowerCase().includes(term));
  });

  // Action Handlers
  const openStatusDialog = (type, order) => setStatusDialog({ open: true, type, order });
  const closeStatusDialog = () => setStatusDialog({ open: false, type: null, order: null });

  const openNotesDialog = (order) => setNotesDialog({ open: true, order });
  const closeNotesDialog = () => setNotesDialog({ open: false, order: null });

  const openProductionDialog = (order, inventoryResult) => setProductionDialog({ open: true, order, inventoryResult });
  const closeProductionDialog = () => setProductionDialog({ open: false, order: null, inventoryResult: null });

  const openDispatchDialog = (order) => setDispatchDialog({ open: true, order });
  const closeDispatchDialog = () => setDispatchDialog({ open: false, order: null });

  const openDetailModal = (order) => setDetailModal({ open: true, order });
  const closeDetailModal = () => setDetailModal({ open: false, order: null });

  const handleSaveNotes = async (order, notes) => {
    setActionLoading(true);
    try {
      await orderService.updateNotes(order.id, notes);
      toast.success('Notes updated');
      await fetchOrders();
      closeNotesDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to save notes.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispatchConfirm = async (order, location, sourceLocation, assignedTechId) => {
    setActionLoading(true);
    try {
      await orderService.updateStatus(order.id, 'Ready for Pickup/Delivery', location, sourceLocation, assignedTechId);
      toast.success(`Order dispatched`);
      await fetchOrders();
      closeDispatchDialog();
    } catch (err) {
      toast.error('Failed to dispatch order.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusConfirm = async (type, order, options = {}) => {
    const statusMap = {
      CONFIRM: 'Confirmed',
      CANCEL: 'Cancelled',
      READY: 'Ready',
      PICKUP_DELIVERY: 'Ready for Pickup/Delivery',
      COMPLETE: 'Completed',
    };

    if (type === 'DELETE') {
      setActionLoading(true);
      try {
        await orderService.deleteOrder(order.id);
        toast.success(`Order deleted.`);
        await fetchOrders();
        closeStatusDialog();
      } catch (err) {
        toast.error('Failed to delete order.');
      } finally {
        setActionLoading(false);
      }
      return;
    }

    if (type === 'CONFIRM' && options.action === 'request-modification') {
      setActionLoading(true);
      try {
        await orderService.requestModification(order.id, options.payload);
        toast.success(`Modification applied`);
        await fetchOrders();
        closeStatusDialog();
      } catch (err) {
        toast.error('Failed to request modification.');
      } finally {
        setActionLoading(false);
      }
      return;
    }

    if (type === 'CONFIRM' && options.action === 'awaiting-material') {
      setActionLoading(true);
      try {
        await orderService.updateStatus(order.id, 'Awaiting material');
        toast.success(`Order → Awaiting material`);
        await fetchOrders();
        closeStatusDialog();
        navigate('/admin/inventory');
      } catch (err) {
        toast.error('Failed to move order.');
      } finally {
        setActionLoading(false);
      }
      return;
    }

    if (type === 'CONFIRM' && options.action === 'request-production') {
      // Only open production dialog — no confirm API call here
      // Confirm will be called after production is created successfully
      closeStatusDialog();
      openProductionDialog(order, options.inventoryResult);
      return;
    }

    if (type === 'CONFIRM' && (!options.action || options.action === 'confirm')) {
      setActionLoading(true);
      try {
        await orderService.confirmOrder(order.id);
        toast.success(`Order → Confirmed`);
        await fetchOrders();
        closeStatusDialog();
      } catch (err) {
        toast.error('Failed to confirm order.');
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
      toast.success(`Order → ${newStatus}`);
      await fetchOrders();
      closeStatusDialog();
    } catch (err) {
      toast.error('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProductionRequest = async (requestData) => {
    setActionLoading(true);
    try {
      const { order, inventoryResult, assignee, notes } = requestData;
      const payload = {
        order_id: order.order_id,
        color: order.color,
        channel_length: order.channel_length,
        needs: {
          slittedPieces: inventoryResult?.slittedUsed || 0,
          fullRollPieces: inventoryResult?.fullRollUsed || 0,
        },
        assignee: assignee?.id || null,
        source_type: ((inventoryResult?.slittedUsed || 0) > 0) ? 'Slitted' : 'Full Roll',
        notes: notes || ''
      };
      await productionService.createProductionRequest(payload);
      toast.success('Production request created.');

      // Now confirm the order (holds Ready Channel inventory)
      await orderService.confirmOrder(order.id);
      toast.success(`Order ${order.order_id} → Confirmed`);

      // Then move to Awaiting production
      await orderService.updateStatus(order.id, 'Awaiting production');
      await fetchOrders();
      closeProductionDialog();
    } catch (err) {
      toast.error('Failed to request production.');
    } finally {
      setActionLoading(false);
    }
  };

  // Table Columns
  const columns = [
    { field: 'order_id', label: 'Order #', bold: true, width: '120px' },
    { field: 'customer_tag', label: 'Customer Tag', bold: true, width: '130px' },
    { field: 'created_at', label: 'Date', width: '120px' },
    { field: 'contact_name', label: 'Customer', bold: true, width: '130px' },
    { field: 'final_length', label: 'Length', bold: true, width: '100px' },
    {
      field: 'order_status',
      label: 'Status',
      type: 'chip',
      chipColor: (status) => {
        const map = {
          Pending: 'warning', Confirmed: 'success', 'Awaiting production': 'primary',
          'Awaiting material': 'secondary', Ready: 'info', 'Ready for Pickup/Delivery': 'success',
          Completed: 'success', Cancelled: 'error'
        };
        return map[status] || 'default';
      },
      width: '130px'
    },
    { field: 'notes', label: 'Notes', width: '150px' },
    { field: 'actions', label: 'Actions', width: '180px' },
  ];

  const buildRows = (orders) => orders.map((order) => ({
    ...order,
    customer_tag: order.customer_tag || '—',
    notes: (
      <Box onClick={(e) => e.stopPropagation()}>
        <NotesCell order={order} onOpenNotes={openNotesDialog} />
      </Box>
    ),
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap"
        onClick={(e) => e.stopPropagation()}>
        {order.order_status === 'Pending' && (
          <>
            <IconButton size="small" sx={{ color: palette.success.main }} onClick={() => openStatusDialog('CONFIRM', order)} title="Confirm">
              <Check fontSize="small" />
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
        {order.order_status === 'Awaiting production' && (
          <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('CANCEL', order)} title="Cancel">
            <Close fontSize="small" />
          </IconButton>
        )}
        {order.order_status === 'Awaiting material' && (
          <>
            <IconButton size="small" sx={{ color: palette.success.main }} onClick={() => openStatusDialog('CONFIRM', order)} title="Confirm">
              <Check fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.primary.main }} onClick={() => navigate('/admin/inventory')} title="Add Inventory">
              <Add fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('CANCEL', order)} title="Cancel">
              <Close fontSize="small" />
            </IconButton>
          </>
        )}
        {order.order_status === 'Ready' && (
          <>
            <IconButton size="small" sx={{ color: palette.success.main }} onClick={() => openDispatchDialog(order)} title="Ready for Pickup/Delivery">
              <LocalShipping fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('CANCEL', order)} title="Cancel">
              <Close fontSize="small" />
            </IconButton>
          </>
        )}
        {order.order_status === 'Ready for Pickup/Delivery' && (
          <>
            <IconButton size="small" sx={{ color: palette.success.main }} onClick={() => openStatusDialog('COMPLETE', order)} title="Complete Order">
              <CheckCircle fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('CANCEL', order)} title="Cancel">
              <Close fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('DELETE', order)} title="Delete">
              <Delete fontSize="small" />
            </IconButton>
          </>
        )}
        {order.order_status !== 'Ready for Pickup/Delivery' && (
          <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('DELETE', order)} title="Delete">
            <Delete fontSize="small" />
          </IconButton>
        )}
      </Stack>
    )
  }));

  return (
    <>
      <ParentCard title="Orders Management">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
          <TextField
            fullWidth
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Awaiting production">Awaiting production</MenuItem>
              <MenuItem value="Awaiting material">Awaiting material</MenuItem>
              <MenuItem value="Ready">Ready</MenuItem>
              <MenuItem value="Ready for Pickup/Delivery">Ready for Pickup/Delivery</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={buildRows(filteredOrders)}
            columns={columns}
            defaultRows={10}
            emptyMessage="No orders found."
            onRowClick={(row) => {
              if (row.order_status === 'Completed') {
                openDetailModal(row);
              }
            }}
          />
        )}
      </ParentCard>

      <StatusDialog open={statusDialog.open} type={statusDialog.type} order={statusDialog.order} onClose={closeStatusDialog} onConfirm={handleStatusConfirm} loading={actionLoading} />
      <NotesDialog open={notesDialog.open} order={notesDialog.order} onClose={closeNotesDialog} onSave={handleSaveNotes} loading={actionLoading} />
      <ProductionRequestDialog open={productionDialog.open} order={productionDialog.order} inventoryResult={productionDialog.inventoryResult} onClose={closeProductionDialog} onSubmit={handleProductionRequest} loading={actionLoading} />
      <DispatchDialog open={dispatchDialog.open} order={dispatchDialog.order} onClose={closeDispatchDialog} onConfirm={handleDispatchConfirm} loading={actionLoading} />
      <OrderDetailModal open={detailModal.open} order={detailModal.order} onClose={closeDetailModal} />
    </>
  );
};

export default DashboardOrders;
