import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Chip, IconButton } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';

const InventoryList = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');

  // Sample inventory data matching specifications
  const inventory = [
    {
      id: 'INV-001',
      color: 'White',
      supplier: 'Supplier A',
      colorCode: 'WH001',
      price: 2.50,
      state: 'Available',
      type: 'Full Roll',
      size: '100ft',
      quantity: 15,
      possibleFeet: 1500,
      slittedQuantity: 0,
      slittedSize: '',
      slittedPossibleFeet: 0,
      readyChannelHoleDistance: '8 inches',
      readyChannelPieces: 0,
      readyChannelLength: 0
    },
    {
      id: 'INV-002',
      color: 'Black',
      supplier: 'Supplier B',
      colorCode: 'BK002',
      price: 3.25,
      state: 'Low Stock',
      type: 'Full Roll',
      size: '100ft',
      quantity: 3,
      possibleFeet: 300,
      slittedQuantity: 2,
      slittedSize: '50ft',
      slittedPossibleFeet: 100,
      readyChannelHoleDistance: '9 inches',
      readyChannelPieces: 5,
      readyChannelLength: 20
    },
    {
      id: 'INV-003',
      color: 'Red',
      supplier: 'Supplier A',
      colorCode: 'RD003',
      price: 2.75,
      state: 'Out of Stock',
      type: 'Full Roll',
      size: '100ft',
      quantity: 0,
      possibleFeet: 0,
      slittedQuantity: 1,
      slittedSize: '25ft',
      slittedPossibleFeet: 25,
      readyChannelHoleDistance: '8 inches',
      readyChannelPieces: 0,
      readyChannelLength: 0
    }
  ];

  const getStateColor = (state) => {
    switch (state) {
      case 'Available': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'error';
      default: return 'default';
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.colorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // DataTable column definitions
  const columns = [
    {
      field: 'color',
      label: 'Color',
      type: 'text',
      bold: true,
      width: '100px'
    },
    {
      field: 'supplier',
      label: 'Supplier',
      type: 'text',
      width: '110px'
    },
    {
      field: 'colorCode',
      label: 'Color Code',
      type: 'text',
      muted: true,
      width: '90px'
    },
    {
      field: 'price',
      label: 'Price/ft',
      type: 'text',
      prefix: '$',
      width: '70px'
    },
    {
      field: 'state',
      label: 'State',
      type: 'chip',
      chipColor: getStateColor,
      width: '100px'
    },
    {
      field: 'type',
      label: 'Type',
      type: 'text',
      width: '80px'
    },
    {
      field: 'size',
      label: 'Size',
      type: 'text',
      width: '70px'
    },
    {
      field: 'quantity',
      label: 'Quantity',
      type: 'text',
      bold: true,
      width: '70px'
    },
    {
      field: 'possibleFeet',
      label: 'Possible Feet',
      type: 'text',
      width: '90px'
    }
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
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ borderRadius: '8px' }}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              href="/admin/inventory/new"
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
      </Box>
    </PageContainer>
  );
};

export default InventoryList;
