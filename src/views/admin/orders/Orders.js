import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  IconButton, Stack, Card, CircularProgress, Chip, Tooltip,
} from '@mui/material';
import { Search, Add, Check, Close, Delete, CheckCircle, LocalShipping, Store, LocationOn, Layers, Assignment } from '@mui/icons-material';
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
import BulkCompleteDialog from './BulkCompleteDialog';
import OrderDetailModal from '../../customer/order/OrderDetailModal';
import { formatDate, ORDER_TABLE_DATA, getSummaryCardsData } from 'src/utils/helpers';

const columns = [
  { field: 'order_id', label: 'Order #', bold: true, width: '150px', minWidth: '150px' },
  {
    field: 'created_at',
    label: 'Date',
    width: '160px',
    minWidth: '160px',
    render: (row) => <Typography variant="h6" fontWeight="400">{row.formatted_created_at}</Typography>
  },
  {
    field: 'pickup_date',
    label: 'Pick Up Date',
    width: '160px',
    minWidth: '160px',
    render: (row) => <Typography variant="h6" fontWeight="400">{row.formatted_pickup_date}</Typography>
  },
  { field: 'contact_name', label: 'Customer', bold: true, width: '150px', minWidth: '150px' },
  { field: 'company_name', label: 'Company', muted: true, width: '170px', minWidth: '170px' },
  { field: 'color', label: 'Color', type: 'chip', chipColor: () => 'primary', width: '120px', minWidth: '120px' },
  { field: 'final_length', label: 'Final Order', bold: true, width: '130px', minWidth: '130px', sortType: 'numeric' },
  { field: 'notes', label: 'Notes', width: '180px', minWidth: '180px' },
  { field: 'actions', label: 'Actions', width: '160px', minWidth: '160px' },
];

const BCrumb = [
  { to: '/admin/dashboard', title: 'Home' },
  { title: 'Orders' },
];

const PAGINATED_STATUSES = ['Completed'];

const Orders = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedReadyOrderIds, setSelectedReadyOrderIds] = useState([]);
  const [bulkConfirmDialog, setBulkConfirmDialog] = useState(false);
  const [summary, setSummary] = useState({
    total: 0, pending: 0, confirmed: 0, awaitingProduction: 0,
    awaitingMaterial: 0, ready: 0, readyForPickup: 0,
    completed: 0, cancelled: 0,
  });

  // Per-status search terms
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

  // Server-side pagination state only for Completed orders
  const [paginatedTables, setPaginatedTables] = useState({
    Completed: { data: [], total: 0, page: 0, rowsPerPage: 5, loading: false, sortBy: 'created_at', sortOrder: 'desc' },
  });
  const [debouncedSearch, setDebouncedSearch] = useState({ Completed: '' });

  // Status dialog
  const [statusDialog, setStatusDialog] = useState({ open: false, type: null, order: null });
  // Notes dialog
  const [notesDialog, setNotesDialog] = useState({ open: false, order: null });
  const [productionDialog, setProductionDialog] = useState({ open: false, order: null, inventoryResult: null });
  const [detailModal, setDetailModal] = useState({ open: false, order: null });
  // Dispatch dialog
  const [dispatchDialog, setDispatchDialog] = useState({ open: false, order: null });

  // ── Debounce search for paginated statuses (Completed) ──────
  const debounceTimers = useRef({});
  useEffect(() => {
    if (debounceTimers.current['Completed']) clearTimeout(debounceTimers.current['Completed']);
    debounceTimers.current['Completed'] = setTimeout(() => {
      setDebouncedSearch({ Completed: searchTerms['Completed'] });
      setPaginatedTables((prev) => ({
        ...prev,
        Completed: { ...prev.Completed, page: 0 },
      }));
    }, 300);

    return () => {
      if (debounceTimers.current['Completed']) clearTimeout(debounceTimers.current['Completed']);
    };
  }, [searchTerms['Completed']]);

  // ── Format order helper ──────────────────────────────────
  const formatOrder = (o) => ({
    ...o,
    formatted_created_at: formatDate(o.created_at),
    formatted_pickup_date: o.pickup_date ? formatDate(o.pickup_date) : '—',
    final_length: `${o.final_length} ft`,
  });

  // ── Fetch active orders (all non-Completed orders, including Cancelled) ──
  const fetchActiveOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Concurrently fetch active orders and full summary
      const [res, summaryRes] = await Promise.all([
        orderService.getAllOrders({ exclude_status: 'Completed' }),
        orderService.getOrdersPaginated({ page: 1, limit: 1 }),
      ]);

      setActiveOrders(res.data.map(formatOrder));
      if (summaryRes.summary) {
        setSummary(summaryRes.summary);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch single paginated status (Completed) ─────────────
  const fetchPaginatedOrders = useCallback(async (status, page, rowsPerPage, search, sortBy = 'created_at', sortOrder = 'desc') => {
    setPaginatedTables((prev) => ({
      ...prev,
      [status]: { ...prev[status], loading: true },
    }));

    try {
      const res = await orderService.getOrdersPaginated({
        page: page + 1,
        limit: rowsPerPage,
        status,
        search: search || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      setPaginatedTables((prev) => ({
        ...prev,
        [status]: {
          ...prev[status],
          data: res.data.map(formatOrder),
          total: res.pagination?.total || 0,
          loading: false,
          sortBy,
          sortOrder,
        },
      }));
    } catch (err) {
      toast.error(err.message || `Failed to fetch ${status.toLowerCase()} orders.`);
      setPaginatedTables((prev) => ({
        ...prev,
        [status]: { ...prev[status], loading: false },
      }));
    }
  }, []);

  // ── Mount / Dependency triggers ──────────────────────────
  useEffect(() => { fetchActiveOrders(); }, [fetchActiveOrders]);

  useEffect(() => {
    fetchPaginatedOrders(
      'Completed',
      paginatedTables.Completed.page,
      paginatedTables.Completed.rowsPerPage,
      debouncedSearch.Completed,
      paginatedTables.Completed.sortBy,
      paginatedTables.Completed.sortOrder,
    );
  }, [
    fetchPaginatedOrders,
    paginatedTables.Completed.page,
    paginatedTables.Completed.rowsPerPage,
    debouncedSearch.Completed,
    paginatedTables.Completed.sortBy,
    paginatedTables.Completed.sortOrder,
  ]);

  // ── Refresh everything after an action ──────────────────
  const refreshAll = async () => {
    await Promise.all([
      fetchActiveOrders(),
      fetchPaginatedOrders(
        'Completed',
        paginatedTables.Completed.page,
        paginatedTables.Completed.rowsPerPage,
        debouncedSearch.Completed,
        paginatedTables.Completed.sortBy,
        paginatedTables.Completed.sortOrder,
      ),
    ]);
  };

  const handleSearchChange = (status, value) => {
    setSearchTerms((prev) => ({ ...prev, [status]: value }));
  };

  // Client-side filter for active statuses
  const getFilteredOrders = (status) => {
    const term = searchTerms[status].toLowerCase();
    return activeOrders.filter((order) => {
      if (order.order_status !== status) return false;
      if (!term) return true;
      return [
        order.order_id,
        order.customer_tag,
        order.contact_name,
        order.company_name,
        order.color,
        order.order_status,
        order.formatted_created_at,
        order.formatted_pickup_date,
        order.pickup_date,
        order.final_length,
        order.additional_notes,
        order.customer_notes,
        order.linked_production_id,
      ].some((f) => f?.toString().toLowerCase().includes(term));
    });
  };

  const counts = summary;
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

  const openDispatchDialog = (order) => setDispatchDialog({ open: true, order });
  const closeDispatchDialog = () => setDispatchDialog({ open: false, order: null });

  const handleDispatchConfirm = async (order, location, sourceLocations, assignedTechId) => {
    setActionLoading(true);
    try {
      await orderService.updateStatus(order.id, 'Ready for Pickup/Delivery', location, sourceLocations, assignedTechId);
      toast.success(`Order ${order.order_id} dispatched for ${order.delivery_method === 'pickup' ? 'pickup' : 'delivery'}`);
      await refreshAll();
      closeDispatchDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch order.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Multi-select Ready for Pickup/Delivery orders ──────
  const handleSelectReadyRow = (id, isSelected) => {
    if (isSelected) {
      setSelectedReadyOrderIds((prev) => [...prev, id]);
    } else {
      setSelectedReadyOrderIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSelectAllReadyRows = (isSelected, rowIds) => {
    if (isSelected) {
      setSelectedReadyOrderIds((prev) => Array.from(new Set([...prev, ...rowIds])));
    } else {
      setSelectedReadyOrderIds((prev) => prev.filter((id) => !rowIds.includes(id)));
    }
  };

  const handleBulkMarkCompleted = async () => {
    if (selectedReadyOrderIds.length === 0) return;
    setActionLoading(true);
    try {
      const selectedOrders = activeOrders.filter((o) => selectedReadyOrderIds.includes(o.id));
      await Promise.all(selectedOrders.map((o) => orderService.updateStatus(o.id, 'Completed')));
      toast.success(`${selectedOrders.length} order(s) marked as Completed.`);
      setSelectedReadyOrderIds([]);
      setBulkConfirmDialog(false);
      await refreshAll();
    } catch (err) {
      toast.error(err.message || 'Failed to complete selected orders.');
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
        await refreshAll();
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
        await refreshAll();
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
        await refreshAll();
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
        await refreshAll();
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
      await refreshAll();
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
  const onOverrideModification = async (order) => {
    setActionLoading(true);
    try {
      const response = await orderService.overrideModification(order.id);
      toast.success('Approval overridden successfully.');
      await refreshAll();
      if (response && response.data) {
        setStatusDialog(prev => ({ ...prev, order: response.data }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to override approval.');
    } finally {
      setActionLoading(false);
    }
  };

  const openNotesDialog = (order) => setNotesDialog({ open: true, order });
  const closeNotesDialog = () => setNotesDialog({ open: false, order: null });

  const handleSaveNotes = async (order, notes) => {
    setActionLoading(true);
    try {
      await orderService.updateNotes(order.id, notes);
      toast.success('Notes saved.');
      await refreshAll();
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
      await refreshAll();
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
      <Box onClick={(e) => e.stopPropagation()}>
        <NotesCell order={order} onOpenNotes={openNotesDialog} />
      </Box>
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
      <Stack direction="row" gap={0.5} flexWrap="wrap" onClick={(e) => e.stopPropagation()}>
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

  // Helper to get rows and props for a status table
  const getTableProps = (status) => {
    if (PAGINATED_STATUSES.includes(status)) {
      const current = paginatedTables[status] || { data: [], total: 0, page: 0, rowsPerPage: 5, loading: false, sortBy: 'created_at', sortOrder: 'desc' };
      return {
        rows: buildRows(current.data),
        isServerSide: true,
        totalCount: current.total,
        serverPage: current.page,
        serverRowsPerPage: current.rowsPerPage,
        serverSortBy: current.sortBy || 'created_at',
        serverSortOrder: current.sortOrder || 'desc',
        onServerSortChange: (newSortBy, newSortOrder) => {
          setPaginatedTables((prev) => ({
            ...prev,
            [status]: { ...prev[status], sortBy: newSortBy, sortOrder: newSortOrder, page: 0 },
          }));
        },
        onServerPageChange: (newPage) => {
          setPaginatedTables((prev) => ({
            ...prev,
            [status]: { ...prev[status], page: newPage },
          }));
        },
        onServerRowsPerPageChange: (newRowsPerPage) => {
          setPaginatedTables((prev) => ({
            ...prev,
            [status]: { ...prev[status], rowsPerPage: newRowsPerPage, page: 0 },
          }));
        },
        tableLoading: current.loading,
      };
    }
    return {
      rows: buildRows(getFilteredOrders(status)),
      isServerSide: false,
      totalCount: 0,
      serverPage: 0,
      serverRowsPerPage: 5,
      serverSortBy: undefined,
      serverSortOrder: undefined,
      onServerSortChange: undefined,
      onServerPageChange: undefined,
      onServerRowsPerPageChange: undefined,
      tableLoading: false,
    };
  };

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
            const isPaginated = PAGINATED_STATUSES.includes(status);
            const tableProps = getTableProps(status);
            const currentRows = tableProps.rows;
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
            } else if (status === 'Awaiting production') {
              // Insert Production ID column before Notes
              const notesIdx = tableColumns.findIndex(c => c.field === 'notes');
              tableColumns.splice(notesIdx > -1 ? notesIdx : tableColumns.length, 0, {
                field: 'linked_production_id',
                label: 'Batch Production',
                width: '150px',
                minWidth: '150px',
                sortValue: (row) => {
                  const hasProduction = !!row.linked_production_id;
                  const isBatch = hasProduction && row.linked_order_count > 1;
                  return isBatch ? row.linked_production_id : '';
                },
                render: (row) => {
                  const hasProduction = !!row.linked_production_id;
                  const isBatch = hasProduction && row.linked_order_count > 1;

                  if (!hasProduction) return <Typography variant="body2" color="text.secondary">—</Typography>;

                  return (
                    <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Tooltip title={isBatch ? "Batch Production" : "Individual Production"} placement="top">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {isBatch ? (
                            <Layers sx={{ fontSize: 18, color: 'warning.main' }} />
                          ) : (
                            <Assignment sx={{ fontSize: 18, color: 'error.main' }} />
                          )}
                        </Box>
                      </Tooltip>
                      {isBatch ? (
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/admin/production', { state: { search: String(row.linked_production_id) } });
                          }}
                          sx={{ cursor: 'pointer', display: 'inline-block' }}
                        >
                          <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ textDecoration: 'underline' }}>
                            {row.linked_production_id}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                          —
                        </Typography>
                      )}
                    </Box>
                  );
                }
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
                  borderBottom: `2px solid ${themeColor}`,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                }}>
                  <Box>
                    <Typography variant="h5" fontWeight={600} color={themeColor}>
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {subtitle}
                    </Typography>
                  </Box>

                  {status === 'Ready for Pickup/Delivery' && selectedReadyOrderIds.length > 0 && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => setBulkConfirmDialog(true)}
                      disabled={actionLoading}
                      sx={{ borderRadius: '8px', fontWeight: 600 }}
                    >
                      Mark Selected as Completed ({selectedReadyOrderIds.length})
                    </Button>
                  )}
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
                  {tableProps.tableLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                      <CircularProgress size={30} />
                    </Box>
                  ) : (
                    <DataTable
                      rows={currentRows}
                      columns={tableColumns}
                      defaultRows={5}
                      emptyMessage={`No ${title.toLowerCase()} found.`}
                      selectable={status === 'Ready for Pickup/Delivery'}
                      selectedIds={selectedReadyOrderIds}
                      onSelectRow={handleSelectReadyRow}
                      onSelectAll={handleSelectAllReadyRows}
                      getRowId={(row) => row.id}
                      onRowClick={(row) => {
                        if (status === 'Completed' || row.order_status === 'Completed' || status === 'Awaiting production' || row.order_status === 'Awaiting production') {
                          openDetailModal(row);
                        }
                      }}
                      // Server-side pagination & sorting props (only for Completed)
                      serverSide={tableProps.isServerSide}
                      totalCount={tableProps.totalCount}
                      serverPage={tableProps.serverPage}
                      serverRowsPerPage={tableProps.serverRowsPerPage}
                      onServerPageChange={tableProps.onServerPageChange}
                      onServerRowsPerPageChange={tableProps.onServerRowsPerPageChange}
                      serverSortBy={tableProps.serverSortBy}
                      serverSortOrder={tableProps.serverSortOrder}
                      onServerSortChange={tableProps.onServerSortChange}
                      sortableFields={['order_id', 'created_at', 'pickup_date', 'final_length']}
                    />
                  )}
                </Box>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* ── Dialogs ── */}
      <BulkCompleteDialog
        open={bulkConfirmDialog}
        count={selectedReadyOrderIds.length}
        onClose={() => setBulkConfirmDialog(false)}
        onConfirm={handleBulkMarkCompleted}
        loading={actionLoading}
      />
      <StatusDialog
        open={statusDialog.open}
        type={statusDialog.type}
        order={statusDialog.order}
        onClose={closeStatusDialog}
        onConfirm={handleStatusConfirm}
        onOverrideModification={onOverrideModification}
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
