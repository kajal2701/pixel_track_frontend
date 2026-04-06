import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  IconButton, MenuItem, FormControl, InputLabel, Select,
  Stack, CircularProgress, Chip,
} from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';
import inventoryService from 'src/services/inventoryService';
import DeleteInventoryDialog from './DeleteInventoryDialog';

// ── Common columns (shared across all types) ──
const commonStart = [
  { field: 'supplier', label: 'Supplier', type: 'text', bold: true, width: '130px' },
  { field: 'color_name', label: 'Color Name', type: 'text', width: '110px' },
  { field: 'color_code', label: 'Color Code', type: 'text', width: '110px' },
  { field: 'price', label: 'Price', type: 'text', width: '80px' },
];

const actionsCol = { field: 'actions', label: 'Actions', type: 'text', width: '100px' };

// ── Type-specific columns ──
const fullRollColumns = [
  ...commonStart,
  { field: 'channel_length', label: 'Channel Length', type: 'text', width: '120px' },
  { field: 'size', label: 'Size (feet)', type: 'text', width: '100px' },
  { field: 'quantity', label: 'Quantity', type: 'text', bold: true, width: '90px' },
  { field: 'possible_feet', label: 'Possible Feet', type: 'text', width: '110px' },
  actionsCol,
];

const slittedColumns = [
  ...commonStart,
  { field: 'channel_length', label: 'Channel Length', type: 'text', width: '120px' },
  { field: 'size', label: 'Size (feet)', type: 'text', width: '100px' },
  { field: 'quantity', label: 'Quantity', type: 'text', bold: true, width: '90px' },
  { field: 'possible_feet', label: 'Possible Feet', type: 'text', width: '110px' },
  actionsCol,
];

const readyChannelColumns = [
  ...commonStart,
  { field: 'hole_distance', label: 'Hole Distance', type: 'text', width: '120px' },
  { field: 'pieces', label: 'Pieces', type: 'text', bold: true, width: '90px' },
  { field: 'length', label: 'Length/Piece', type: 'text', width: '110px' },
  actionsCol,
];

// ── "All" view — show type badge + merged display columns ──
const allColumns = [
  ...commonStart,
  {
    field: 'inventory_type',
    label: 'Type',
    type: 'chip',
    chipColor: (val) => {
      if (val === 'Full Roll') return 'primary';
      if (val === 'Slitted') return 'warning';
      if (val === 'Ready Channel') return 'success';
      return 'default';
    },
    width: '130px',
  },
  { field: 'channel_length', label: 'Ch. Length', type: 'text', width: '110px' },
  { field: 'displaySize', label: 'Size / Hole Dist', type: 'text', width: '120px' },
  { field: 'displayQuantity', label: 'Qty / Pieces', type: 'text', bold: true, width: '100px' },
  { field: 'displayLength', label: 'Feet / Length', type: 'text', width: '110px' },
  actionsCol,
];

const InventoryList = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  // ── State ──
  const [allInventory, setAllInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });

  // ── Fetch inventory on mount ──
  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await inventoryService.getAllInventory();
      setAllInventory(response.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  };

  // ── Format display fields for "All" view ──
  const formatRow = (item) => {
    let displaySize = '';
    let displayQuantity = '';
    let displayLength = '';

    if (item.inventory_type === 'Full Roll' || item.inventory_type === 'Slitted') {
      displaySize = item.size ? `${item.size} ft` : '—';
      displayQuantity = item.quantity ?? '—';
      displayLength = item.possible_feet ?? '—';
    } else if (item.inventory_type === 'Ready Channel') {
      displaySize = item.hole_distance || '—';
      displayQuantity = item.pieces ?? '—';
      displayLength = item.length ?? '—';
      return { ...item, displaySize, displayQuantity, displayLength, channel_length: '—' };
    }

    return { ...item, displaySize, displayQuantity, displayLength };
  };

  // ── Pick columns based on filter ──
  const columns = useMemo(() => {
    switch (filterType) {
      case 'Full Roll': return fullRollColumns;
      case 'Slitted': return slittedColumns;
      case 'Ready Channel': return readyChannelColumns;
      default: return allColumns;
    }
  }, [filterType]);

  // ── Local filter ──
  const filteredInventory = allInventory
    .map(formatRow)
    .filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = [
        item.supplier,
        item.color_name,
        item.color_code,
        item.inventory_type,
        String(item.price ?? ''),
        String(item.size ?? ''),
        item.hole_distance,
        String(item.quantity ?? ''),
        String(item.pieces ?? ''),
        String(item.possible_feet ?? ''),
        String(item.length ?? ''),
        String(item.channel_length ?? ''),
      ].some((field) => field?.toLowerCase().includes(q));

      const matchesType = filterType === 'All' || item.inventory_type === filterType;
      return matchesSearch && matchesType;
    });

  // ── Delete dialog handlers ──
  const openDeleteDialog = (item) => setDeleteDialog({ open: true, item });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, item: null });

  const handleDeleteConfirm = async (item) => {
    setActionLoading(true);
    try {
      await inventoryService.deleteInventory(item.id);
      toast.success(`Inventory item ${item.color_code} deleted successfully.`);
      fetchInventory();
      closeDeleteDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to delete inventory item.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Edit handler ──
  const handleEdit = (item) => {
    navigate(`/admin/inventory/edit/${item.id}`);
  };

  // ── Build rows with action buttons ──
  const rows = filteredInventory.map((item) => ({
    ...item,
    actions: (
      <Stack direction="row" gap={0.5}>
        <IconButton
          size="small"
          sx={{ color: palette.info.main }}
          onClick={() => handleEdit(item)}
          title="Edit"
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: palette.error.main }}
          onClick={() => openDeleteDialog(item)}
          title="Delete"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    ),
  }));

  // ── Summary stats ──
  const fullRollCount = allInventory
    .filter((item) => item.inventory_type === 'Full Roll' && item.quantity > 0)
    .reduce((sum, item) => sum + (item.quantity || 0), 0);

  const slittedCount = allInventory
    .filter((item) => item.inventory_type === 'Slitted' && item.quantity > 0)
    .reduce((sum, item) => sum + (item.quantity || 0), 0);

  const readyChannelCount = allInventory
    .filter((item) => item.inventory_type === 'Ready Channel' && item.pieces > 0)
    .reduce((sum, item) => sum + (item.pieces || 0), 0);

  return (
    <PageContainer title="Inventory Management" description="Manage product inventory">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Inventory
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="inventory-type-label">Type</InputLabel>
              <Select
                labelId="inventory-type-label"
                id="inventory-type-select"
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Full Roll">Full Roll</MenuItem>
                <MenuItem value="Slitted">Slitted</MenuItem>
                <MenuItem value="Ready Channel">Ready Channel</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/admin/inventory/new')}
              sx={{ borderRadius: '8px' }}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search inventory by supplier, color name, color code, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: palette.background.paper,
              }
            }}
          />
        </Box>

        {/* Inventory Types Summary */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <ParentCard title="Full Rolls" sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="600" color="primary.main">
              {loading ? <CircularProgress size={20} /> : fullRollCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total rolls available
            </Typography>
          </ParentCard>
          <ParentCard title="Slitted Rolls" sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="600" color="warning.main">
              {loading ? <CircularProgress size={20} /> : slittedCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total slitted pieces
            </Typography>
          </ParentCard>
          <ParentCard title="Ready Channels" sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="600" color="success.main">
              {loading ? <CircularProgress size={20} /> : readyChannelCount}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total ready pieces
            </Typography>
          </ParentCard>
        </Box>

        {/* DataTable */}
        <ParentCard title={filterType === 'All' ? 'All Inventory' : `${filterType} Inventory`}>
          <DataTable
            rows={rows}
            columns={columns}
            defaultRows={10}
            loading={loading}
          />
        </ParentCard>

        {/* Delete Confirmation Dialog */}
        <DeleteInventoryDialog
          open={deleteDialog.open}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteConfirm}
          item={deleteDialog.item}
          loading={actionLoading}
        />
      </Box>
    </PageContainer>
  );
};

export default InventoryList;
