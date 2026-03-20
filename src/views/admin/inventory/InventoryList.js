import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, TextField, InputAdornment, Switch } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';

const InventoryList = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const inventory = [
    { id: 'INV-001', name: 'LED Strip Light 5m', sku: 'LED-STRIP-001', category: 'Lighting', stock: 150, price: 25.99, status: 'active' },
    { id: 'INV-002', name: 'Smart Bulb RGB', sku: 'LED-BULB-002', category: 'Lighting', stock: 89, price: 15.99, status: 'active' },
    { id: 'INV-003', name: 'Track Connector', sku: 'TRACK-CONN-003', category: 'Accessories', stock: 0, price: 8.99, status: 'inactive' },
    { id: 'INV-004', name: 'Power Supply 12V', sku: 'PWR-12V-004', category: 'Power', stock: 45, price: 35.99, status: 'active' },
    { id: 'INV-005', name: 'LED Panel 60x60', sku: 'LED-PANEL-005', category: 'Lighting', stock: 12, price: 89.99, status: 'active' },
  ];

  const getStockColor = (stock) => {
    if (stock === 0) return 'error';
    if (stock < 20) return 'warning';
    return 'success';
  };

  const getStockText = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 20) return 'Low Stock';
    return 'In Stock';
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            placeholder="Search inventory by name, SKU, or category..."
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

        {/* Inventory Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{item.sku}</TableCell>
                  <TableCell>
                    <Chip label={item.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: 600 }}>{item.stock}</Typography>
                      <Chip
                        label={getStockText(item.stock)}
                        color={getStockColor(item.stock)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.status === 'active'}
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: palette.info.main }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: palette.primary.main }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: palette.error.main }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </PageContainer>
  );
};

export default InventoryList;
