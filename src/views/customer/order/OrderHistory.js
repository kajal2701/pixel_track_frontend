import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Stack, Grid } from '@mui/material';
import { Search, Visibility, Download, FilterList, Receipt } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import ChildCard from '../../../components/shared/ChildCard';
import DataTable from '../../../components/shared/DataTable';

const OrderHistory = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample order data matching admin table structure
  const orders = [
    { 
      id: 1, 
      orderNumber: 'ORD-2024-001', 
      date: '2024-03-15', 
      customerName: 'ABC Construction',
      companyName: 'ABC Construction',
      color: 'White', 
      finalOrder: '216 ft', 
      status: 'Confirmed', 
      notes: 'Delivery by end of month',
      email: 'contact@abcconstruction.com'
    },
    { 
      id: 2, 
      orderNumber: 'ORD-2024-002', 
      date: '2024-03-16', 
      customerName: 'XYZ Interiors',
      companyName: 'XYZ Interiors',
      color: 'Black', 
      finalOrder: '144 ft', 
      status: 'Pending', 
      notes: 'Ready for production',
      email: 'orders@xyzinteriors.com'
    },
    { 
      id: 3, 
      orderNumber: 'ORD-2024-003', 
      date: '2024-03-17', 
      customerName: 'Home Renovations Ltd',
      companyName: 'Home Renovations Ltd',
      color: 'Red', 
      finalOrder: '288 ft', 
      status: 'Ready', 
      notes: 'Awaiting delivery',
      email: 'info@homerenovations.com'
    },
    { 
      id: 4, 
      orderNumber: 'ORD-2024-004', 
      date: '2024-03-18', 
      customerName: 'Commercial Spaces Inc',
      companyName: 'Commercial Spaces Inc',
      color: 'Gray', 
      finalOrder: '150 ft', 
      status: 'Pending', 
      notes: 'Large commercial project',
      email: 'alice.brown@commercialspaces.com'
    },
    { 
      id: 5, 
      orderNumber: 'ORD-2024-005', 
      date: '2024-03-19', 
      customerName: 'Residential Builders',
      companyName: 'Residential Builders',
      color: 'Blue', 
      finalOrder: '168 ft', 
      status: 'Confirmed', 
      notes: 'New residential project',
      email: 'mike.wilson@residentialbuilders.com'
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // DataTable column definitions - 3 columns with percentage-based widths
  const columns = [
  { 
    field: 'date', 
    label: 'Date'
  },
  { 
    field: 'orderNumber', 
    label: 'Order ID', 
    bold: true
  },
  {
    field: 'status',
    label: 'Status',
    type: 'chip',
    chipColor: (v) => ({ Confirmed: 'success', Pending: 'warning', Ready: 'info', Cancelled: 'error' }[v] || 'default')
  }
];

  // Format rows for DataTable - simplified for 3 columns
  const rows = filteredOrders;

  return (
    <PageContainer title="Order History" description="View and track your orders">
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>Order History</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
         
          <Button 
            variant="contained" 
            startIcon={<Receipt />} 
            onClick={() => navigate('/order/new')}
            sx={{ borderRadius: '8px' }}
          >
            New Order
          </Button>
        </Stack>
      </Stack>

      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search by order ID, date or status..."
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

      {/* Orders Table */}
      <ParentCard title="Order History">
        <Box sx={{ 
          '& .MuiTableContainer-root': { 
            overflowX: 'hidden !important' 
          },
          '& table': {
            tableLayout: 'fixed',
            width: '100%'
          }
        }}>
          <DataTable rows={rows} columns={columns} defaultRows={10} />
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default OrderHistory;