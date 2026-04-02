import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Chip, IconButton, MenuItem, FormControl, InputLabel, Select, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';
import DeleteInventoryDialog from './DeleteInventoryDialog';

const InventoryList = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('All');

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleEdit = (item) => {
    // Pass the item state to the edit page
    navigate('/admin/inventory/edit', { state: { editData: item } });
  };

  const openDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // Implement actual deletion logic here
    console.log("Deleting item: ", itemToDelete);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Sample inventory data matching specifications
  const inventory = [
    {
      id: 'INV-001',
      color: 'White',
      supplier: 'Supplier A',
      colorCode: 'WH001',
      price: 2.50,
      type: 'Full Roll',
      size: '100ft',
      quantity: 15,
      possibleFeet: 1500,
    },
    {
      id: 'INV-002',
      color: 'Black',
      supplier: 'Supplier B',
      colorCode: 'BK002',
      price: 3.25,
      type: 'Slitted',
      slittedSize: '50ft',
      slittedQuantity: 20,
      slittedPossibleFeet: 1000,
    },
    {
      id: 'INV-003',
      color: 'Red',
      supplier: 'Supplier A',
      colorCode: 'RD003',
      price: 2.75,
      type: 'Ready Channel',
      readyChannelHoleDistance: '8 inches',
      readyChannelPieces: 50,
      readyChannelLength: 20
    },
    {
      id: 'INV-004',
      color: 'Blue',
      supplier: 'Supplier C',
      colorCode: 'BL004',
      price: 2.10,
      type: 'Ready Channel',
      readyChannelHoleDistance: '9 inches',
      readyChannelPieces: 100,
      readyChannelLength: 10
    }
  ];

  // Format data for display
  const formattedInventory = inventory.map(item => {
    let displaySize = '';
    let displayQuantity = 0;
    let displayLength = 0;

    if (item.type === 'Full Roll') {
      displaySize = item.size || '';
      displayQuantity = item.quantity || 0;
      displayLength = item.possibleFeet || 0;
    } else if (item.type === 'Slitted') {
      displaySize = item.slittedSize || '';
      displayQuantity = item.slittedQuantity || 0;
      displayLength = item.slittedPossibleFeet || 0;
    } else if (item.type === 'Ready Channel') {
      displaySize = item.readyChannelHoleDistance || '';
      displayQuantity = item.readyChannelPieces || 0;
      displayLength = item.readyChannelLength || 0;
    }

    return {
      ...item,
      displaySize,
      displayQuantity,
      displayLength,
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
      )
    };
  });

  const filteredInventory = formattedInventory.filter(item => {
    const matchesSearch = item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.colorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterState === 'All' || item.type === filterState;
    return matchesSearch && matchesFilter;
  });

  // DataTable column definitions
  const columns = [
    { field: 'color', label: 'Color', type: 'text', bold: true, width: '100px' },
    { field: 'supplier', label: 'Supplier', type: 'text', width: '110px' },
    { field: 'colorCode', label: 'Color Code', type: 'text', muted: true, width: '90px' },
    { field: 'price', label: 'Price/ft', type: 'text', prefix: '$', width: '70px' },
    { field: 'type', label: 'Inventory State', type: 'text', width: '120px' },
    { field: 'displaySize', label: 'Size/Hole Dist', type: 'text', width: '110px' },
    { field: 'displayQuantity', label: 'Qty/Pieces', type: 'text', bold: true, width: '80px' },
    { field: 'displayLength', label: 'Feet/Length', type: 'text', width: '100px' },
    { field: 'actions', label: 'Actions', type: 'text', width: '110px' }
  ];

  return (
    <PageContainer title="Inventory Management" description="Manage product inventory">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Inventory
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="inventory-state-label">State</InputLabel>
              <Select
                labelId="inventory-state-label"
                id="inventory-state-select"
                value={filterState}
                label="State"
                onChange={(e) => setFilterState(e.target.value)}
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
            placeholder="Search inventory by color, supplier, color code, or type..."
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
              {inventory.filter(item => item.type === 'Full Roll' && item.quantity > 0).reduce((sum, item) => sum + item.quantity, 0)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total rolls available
            </Typography>
          </ParentCard>
          <ParentCard title="Slitted Rolls" sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="600" color="warning.main">
              {inventory.filter(item => item.slittedQuantity > 0).reduce((sum, item) => sum + item.slittedQuantity, 0)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total slitted pieces
            </Typography>
          </ParentCard>
          <ParentCard title="Ready Channels" sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="600" color="success.main">
              {inventory.filter(item => item.readyChannelPieces > 0).reduce((sum, item) => sum + item.readyChannelPieces, 0)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total ready pieces
            </Typography>
          </ParentCard>
        </Box>

        {/* DataTable */}
        <ParentCard title="Inventory Management">
          <DataTable
            rows={filteredInventory}
            columns={columns}
            defaultRows={10}
          />
        </ParentCard>

        {/* Delete Confirmation Dialog */}
        <DeleteInventoryDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          item={itemToDelete}
        />
      </Box>
    </PageContainer>
  );
};

export default InventoryList;
