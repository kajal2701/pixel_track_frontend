import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  IconButton, Stack, Card, CircularProgress, Chip,
} from '@mui/material';
import { Search, Add, Check, Close, Delete, CheckCircle, LocalShipping, Store, LocationOn } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import DataTable from 'src/components/shared/DataTable';
import orderService from 'src/services/orderService';
import productionService from 'src/services/productionService';
import StatusDialog from './StatusDialog';
import NotesDialog from './NotesDialog';
import NotesCell from './NotesCell';
import ProductionRequestDialog from './ProductionRequestDialog';
import DispatchDialog from './DispatchDialog';
import OrderDetailModal from '../../customer/order/OrderDetailModal';
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
    'Awaiting production': '',
    'Awaiting material': '',
    Ready: '',
    'Ready for Pickup/Delivery': '',
    Completed: '',
    Cancelled: ''
  });

  // Status dialog
  const [statusDialog, setStatusDialog] = useState({ open: false, type: null, order: null });

  // Notes dialog
  const [notesDialog, setNotesDialog] = useState({ open: false, order: null });
  const [productionDialog, setProductionDialog] = useState({
    open: false,
    order: null,
    inventoryResult: null,
  });
  const [detailModal, setDetailModal] = useState({ open: false, order: null });

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
        order.customer_notes,
      ].some((f) => f?.toString().toLowerCase().includes(term));
    });
  };

  const counts = {
    total: allOrders.length,
    pending: allOrders.filter((o) => o.order_status === 'Pending').length,
    confirmed: allOrders.filter((o) => o.order_status === 'Confirmed').length,
    awaitingProduction: allOrders.filter((o) => o.order_status === 'Awaiting production').length,
    awaitingMaterial: allOrders.filter((o) => o.order_status === 'Awaiting material').length,
    ready: allOrders.filter((o) => o.order_status === 'Ready').length,
    readyForPickup: allOrders.filter((o) => o.order_status === 'Ready for Pickup/Delivery').length,
    completed: allOrders.filter((o) => o.order_status === 'Completed').length,
    cancelled: allOrders.filter((o) => o.order_status === 'Cancelled').length,
  };

  const summaryCardsData = getSummaryCardsData(counts);

  // ── Status dialog handlers ───────────────────────────────
  const openStatusDialog = (type, order) => setStatusDialog({ open: true, type, order });
  const closeStatusDialog = () => setStatusDialog({ open: false, type: null, order: null });
  const openProductionDialog = (order, inventoryResult) =>
    setProductionDialog({ open: true, order, inventoryResult });
  const closeProductionDialog = () =>
    setProductionDialog({ open: false, order: null, inventoryResult: null });

  const openDetailModal = (order) => setDetailModal({ open: true, order });
  const closeDetailModal = () => setDetailModal({ open: false, order: null });

  // Dispatch dialog
  const [dispatchDialog, setDispatchDialog] = useState({ open: false, order: null });
  const openDispatchDialog = (order) => setDispatchDialog({ open: true, order });
  const closeDispatchDialog = () => setDispatchDialog({ open: false, order: null });

  const handleDispatchConfirm = async (order, location, sourceLocation) => {
    setActionLoading(true);
    try {
      await orderService.updateStatus(order.id, 'Ready for Pickup/Delivery', location, sourceLocation);
      toast.success(`Order ${order.order_id} dispatched for ${order.delivery_method === 'pickup' ? 'pickup' : 'delivery'}`);
      await fetchOrders();
      closeDispatchDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch order.');
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
        toast.success(`Order ${order.order_id} deleted.`);
        await fetchOrders();
        closeStatusDialog();
      } catch (err) {
        toast.error(err.message || 'Failed to delete order.');
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
        const awaitingMaterialStatus = 'Awaiting material';
        await orderService.updateStatus(order.id, awaitingMaterialStatus);
        toast.success(`Order ${order.order_id} → ${awaitingMaterialStatus}`);
        await fetchOrders();
        closeStatusDialog();
        navigate('/admin/inventory');
      } catch (err) {
        toast.error(err.message || 'Failed to move order to awaiting material.');
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
        toast.success(`Order ${order.order_id} → Confirmed`);
        await fetchOrders();
        closeStatusDialog();
      } catch (err) {
        toast.error(err.message || 'Failed to confirm order.');
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
      await fetchOrders();
      const updatedOrder = { ...order, order_status: newStatus };
      closeStatusDialog();

      const inventoryResult = options.inventoryResult || null;
      const needsProduction = type === 'CONFIRM'
        && inventoryResult
        && ((inventoryResult.slittedUsed || 0) > 0 || (inventoryResult.fullRollUsed || 0) > 0);

      if (needsProduction) {
        openProductionDialog(updatedOrder, inventoryResult);
      }
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
      await fetchOrders();
      closeNotesDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to save notes.');
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
      const awaitingProductionStatus = 'Awaiting production';
      await orderService.updateStatus(order.id, awaitingProductionStatus);
      await fetchOrders();
      closeProductionDialog();
      navigate('/admin/production');
    } catch (err) {
      toast.error(err.message || 'Failed to request production.');
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
    // Location column for Ready orders
    location: (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <LocationOn sx={{ fontSize: 16, color: palette.text.secondary }} />
        <Typography variant="body2" fontWeight={500}>Warehouse</Typography>
      </Stack>
    ),
    // Dispatch info column for Ready for Pickup/Delivery orders
    dispatch_info: (
      <Stack spacing={0.5}>
        <Chip
          icon={order.delivery_method === 'pickup' ? <Store sx={{ fontSize: 14 }} /> : <LocalShipping sx={{ fontSize: 14 }} />}
          label={order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'}
          color={order.delivery_method === 'pickup' ? 'info' : 'success'}
          size="small"
          sx={{ fontWeight: 600, borderRadius: '6px', width: 'fit-content' }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 200, display: 'block' }}>
          {order.delivery_method === 'pickup'
            ? (order.pickup_location || '—')
            : (order.delivery_address || '—')}
        </Typography>
      </Stack>
    ),
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
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
          <>
            <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => openStatusDialog('CANCEL', order)} title="Cancel">
              <Close fontSize="small" />
            </IconButton>
          </>
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
            const tableId = `table-${status.replace(/\s+/g, '-')}`;

            // Build dynamic columns per status
            const tableColumns = [...columns];
            if (status === 'Ready') {
              // Insert Location column before Notes
              const notesIdx = tableColumns.findIndex(c => c.field === 'notes');
              tableColumns.splice(notesIdx > -1 ? notesIdx : tableColumns.length, 0, {
                field: 'location',
                label: 'Location',
                width: '150px',
                minWidth: '150px',
              });
            } else if (status === 'Ready for Pickup/Delivery') {
              // Insert Dispatch Info column before Notes
              const notesIdx = tableColumns.findIndex(c => c.field === 'notes');
              tableColumns.splice(notesIdx > -1 ? notesIdx : tableColumns.length, 0, {
                field: 'dispatch_info',
                label: 'Dispatch Info',
                width: '220px',
                minWidth: '220px',
              });
            }
            return (
              <Card
                id={tableId}
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
                    columns={tableColumns}
                    defaultRows={5}
                    emptyMessage={`No ${title.toLowerCase()} found.`}
                    onRowClick={(row) => {
                      if (status === 'Completed' || row.order_status === 'Completed') {
                        openDetailModal(row);
                      }
                    }}
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

      <ProductionRequestDialog
        open={productionDialog.open}
        order={productionDialog.order}
        inventoryResult={productionDialog.inventoryResult}
        onClose={closeProductionDialog}
        onSubmit={handleProductionRequest}
        loading={actionLoading}
      />

      <DispatchDialog
        open={dispatchDialog.open}
        order={dispatchDialog.order}
        onClose={closeDispatchDialog}
        onConfirm={handleDispatchConfirm}
        loading={actionLoading}
      />

      <OrderDetailModal
        open={detailModal.open}
        order={detailModal.order}
        onClose={closeDetailModal}
      />

    </PageContainer>
  );
};

export default Orders;
