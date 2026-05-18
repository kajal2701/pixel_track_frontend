import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment, Chip,
  IconButton, FormControl, InputLabel, Select, MenuItem,
  Stack, Grid, CircularProgress,
} from '@mui/material';
import {
  Search, Add, Edit, Delete, FilterList,
  PlayArrow, CheckCircle, Cancel as CancelIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import ChildCard from '../../../components/shared/ChildCard';
import DataTable from '../../../components/shared/DataTable';
import DeleteProductionDialog from './DeleteProductionDialog';
import StatusUpdateDialog from './StatusUpdateDialog';
import productionService from '../../../services/productionService';
import toast from 'react-hot-toast';
import { getStatusColor, getTypeColor, ORDER_COLORS, TypeChipWithOrderColor } from '../../../utils/helpers';

const ProductionList = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  const [production, setProduction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [statusDialog, setStatusDialog] = useState({ open: false, production: null, newStatus: null });
  const [statusLoading, setStatusLoading] = useState(false);

  // Current user info for role-based filtering
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const isProductionTech = adminData.role === 'production tech';

  // ── Fetch ────────────────────────────────────────────────────
  const fetchProduction = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productionService.getAllProduction();
      let records = res.data || [];

      // Read from localStorage inside callback so [] dependency is truthful
      const currentAdmin = JSON.parse(localStorage.getItem('adminData') || '{}');
      if (currentAdmin.role === 'production tech' && currentAdmin.id) {
        records = records.filter(
          (item) => String(item.assignee) === String(currentAdmin.id)
        );
      }

      setProduction(records);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch production records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProduction(); }, [fetchProduction]);

  // ── Filter ───────────────────────────────────────────────────
  const filteredProduction = production.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (item.order_id || '').toLowerCase().includes(term) ||
      (item.assignee_name || '').toLowerCase().includes(term) ||
      (item.production_type || '').toLowerCase().includes(term) ||
      (item.target_state || '').toLowerCase().includes(term) ||
      (item.raw_material_color || '').toLowerCase().includes(term) ||
      String(item.id || '').toLowerCase().includes(term);

    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ── Columns ──────────────────────────────────────────────────
  const columns = [
    { field: 'id', label: 'ID', bold: true, width: '5%' },
    { field: 'typeChip', label: 'Type', width: '12%' },
    {
      field: 'target_state', label: 'Target', width: '10%', render: (row) => (
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Typography variant="body1">{row.target_state}</Typography>
          {row.isAuto && <Chip label="Auto" size="small" color="info" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />}
        </Stack>
      )
    },
    { field: 'rawMaterialDisplay', label: 'Raw Material', width: '18%' },
    { field: 'qtyDisplay', label: 'Qty / Size', width: '12%' },
    { field: 'channelDisplay', label: 'Ch. Length', width: '8%' },
    { field: 'assignee_name', label: 'Assign', width: '10%' },
    { field: 'statusChip', label: 'Status', type: 'chip', chipColor: (value) => getStatusColor(value), width: '10%' },
    { field: 'actions', label: 'Actions', width: '12%' },
  ];

  // ── Order Color Grouping ─────────────────────────────────────
  // Assign a consistent color to each unique order_id
  const orderColorMap = React.useMemo(() => {
    const map = {};
    let colorIdx = 0;
    filteredProduction.forEach((item) => {
      if (item.order_id && !map[item.order_id]) {
        map[item.order_id] = ORDER_COLORS[colorIdx % ORDER_COLORS.length];
        colorIdx++;
      }
    });
    return map;
  }, [filteredProduction]);

  // ── Rows ─────────────────────────────────────────────────────
  const rows = filteredProduction.map((item) => {
    // Build channel length display: "6.67 ft (10H)"
    let channelDisplay = '—';
    if (item.channel_length) {
      const ft = parseFloat(item.channel_length);
      const holes = Math.round(ft * 1.5);
      channelDisplay = `${ft} ft (${holes}H)`;
    }

    // Check if auto-created
    const isAuto = (item.notes || '').toLowerCase().includes('auto-created');

    // Order color for grouping
    const orderColor = item.order_id ? orderColorMap[item.order_id] : null;

    return {
      ...item,
      typeChip: <TypeChipWithOrderColor item={item} orderColor={orderColor} />,
      rawMaterialDisplay: item.raw_material_color
        ? `${item.raw_material_type || ''} — ${item.raw_material_color} (${item.raw_material_color_code || ''})`
        : '—',
      qtyDisplay: `${item.qty || 0} × ${item.size || '—'}`,
      channelDisplay,
      statusChip: item.status,
      isAuto,
      actions: (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.25 }}>
          {(item.status === 'Pending' || item.status === 'In Progress') && (
            <IconButton size="small" sx={{ color: palette.primary.main }} onClick={() => navigate(`/admin/production/edit/${item.id}`)} title="Edit">
              <Edit fontSize="small" />
            </IconButton>
          )}
          {item.status === 'Pending' && (
            <IconButton size="small" sx={{ color: palette.success.main }} onClick={() => openStatusDialog(item, 'In Progress')} title="Start">
              <PlayArrow fontSize="small" />
            </IconButton>
          )}
          {item.status === 'In Progress' && (
            <IconButton size="small" sx={{ color: palette.success.main }} onClick={() => openStatusDialog(item, 'Completed')} title="Mark Completed">
              <CheckCircle fontSize="small" />
            </IconButton>
          )}
          {(item.status === 'Pending' || item.status === 'In Progress') && (
            <IconButton size="small" sx={{ color: palette.warning.main }} onClick={() => openStatusDialog(item, 'Cancelled')} title="Cancel">
              <CancelIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" sx={{ color: palette.error.main }} onClick={() => handleDeleteProduction(item)} title="Delete">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    };
  });

  // ── Status Dialog ─────────────────────────────────────────────
  const openStatusDialog = (item, newStatus) => setStatusDialog({ open: true, production: item, newStatus });
  const closeStatusDialog = () => setStatusDialog({ open: false, production: null, newStatus: null });

  const handleStatusConfirm = async (prod, newStatus) => {
    setStatusLoading(true);
    try {
      await productionService.updateStatus(prod.id, newStatus);
      toast.success(`Production #${prod.id} → ${newStatus}`);
      await fetchProduction();
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setStatusLoading(false);
      closeStatusDialog();
    }
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDeleteProduction = (item) => {
    setSelectedProduction(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (prod) => {
    setDeleteLoading(true);
    try {
      await productionService.deleteProduction(prod.id);
      toast.success(`Production #${prod.id} deleted.`);
      await fetchProduction();
      setDeleteDialogOpen(false);
      setSelectedProduction(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete production.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedProduction(null);
  };

  // ── Summary counts ────────────────────────────────────────────
  const pending = production.filter((i) => i.status === 'Pending').length;
  const inProgress = production.filter((i) => i.status === 'In Progress').length;
  const completed = production.filter((i) => i.status === 'Completed').length;
  const cancelled = production.filter((i) => i.status === 'Cancelled').length;

  return (
    <PageContainer title="Production Management" description="Manage production records">
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>Production Management</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/admin/production/new')} sx={{ borderRadius: '8px' }}>
            New Production
          </Button>
        </Stack>
      </Stack>

      {/* Search + Filter */}
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mb={3} alignItems="center">
        <TextField
          fullWidth
          placeholder="Search by order #, assignee, type, target state, color..."
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
        <FormControl sx={{ minWidth: 170 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Pending">
            <Typography variant="h4" fontWeight={600} color="warning.main">{pending}</Typography>
            <Typography variant="body2" color="textSecondary">Awaiting start</Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ChildCard title="In Progress">
            <Typography variant="h4" fontWeight={600} color="info.main">{inProgress}</Typography>
            <Typography variant="body2" color="textSecondary">Currently being processed</Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Completed">
            <Typography variant="h4" fontWeight={600} color="success.main">{completed}</Typography>
            <Typography variant="body2" color="textSecondary">Finished</Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Cancelled">
            <Typography variant="h4" fontWeight={600} color="error.main">{cancelled}</Typography>
            <Typography variant="body2" color="textSecondary">Cancelled</Typography>
          </ChildCard>
        </Grid>
      </Grid>

      {/* Table */}
      <ParentCard title="Production Records">
        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable rows={rows} columns={columns} defaultRows={10} emptyMessage="No production records found." />
        )}
      </ParentCard>

      {/* Delete Dialog */}
      <DeleteProductionDialog
        open={deleteDialogOpen}
        production={selectedProduction}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        open={statusDialog.open}
        production={statusDialog.production}
        newStatus={statusDialog.newStatus}
        onClose={closeStatusDialog}
        onConfirm={handleStatusConfirm}
        loading={statusLoading}
      />
    </PageContainer>
  );
};

export default ProductionList;