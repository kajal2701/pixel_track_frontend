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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending': return 'warning';
      case 'Ready': return 'info';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // DataTable column definitions matching admin table
  const columns = [
    { 
      field: 'orderNumber', 
      label: 'Order #', 
      bold: true, 
      width: '150px', 
      minWidth: '150px' 
    },
    { 
      field: 'date', 
      label: 'Date', 
      width: '120px', 
      minWidth: '120px' 
    },
    { 
      field: 'customerName', 
      label: 'Customer', 
      bold: true, 
      width: '150px', 
      minWidth: '150px' 
    },
    { 
      field: 'companyName', 
      label: 'Company', 
      muted: true, 
      width: '170px', 
      minWidth: '170px' 
    },
    { 
      field: 'color', 
      label: 'Color', 
      type: 'chip', 
      chipColor: () => 'primary', 
      width: '120px', 
      minWidth: '120px' 
    },
    { 
      field: 'finalOrder', 
      label: 'Final Order', 
      bold: true, 
      width: '130px', 
      minWidth: '130px' 
    },
    {
      field: 'status',
      label: 'Status',
      type: 'chip',
      chipColor: (v) => ({ Confirmed: 'success', Pending: 'warning', Ready: 'info', Cancelled: 'error' }[v] || 'default'),
      width: '120px', minWidth: '120px',
    },
    { 
      field: 'notes', 
      label: 'Notes', 
      width: '220px', 
      minWidth: '220px' 
    },
    { 
      field: 'actions', 
      label: 'Actions', 
      width: '160px', 
      minWidth: '160px' 
    }
  ];

  // Format rows for DataTable with action buttons
  const rows = filteredOrders.map(order => ({
    ...order,
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        <IconButton 
          size="small" 
          sx={{ color: palette.info.main }}
          onClick={() => handleViewOrder(order)}
          title="View Order Details"
        >
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: palette.primary.main }}
          onClick={() => handleDownloadInvoice(order)}
          title="Download Invoice"
        >
          <Receipt fontSize="small" />
        </IconButton>
      </Stack>
    )
  }));

  const handleViewOrder = (order) => {
    alert(`Order Details:\n\nOrder #: ${order.orderNumber}\nDate: ${order.date}\nCustomer: ${order.customerName}\nCompany: ${order.companyName}\nColor: ${order.color}\nFinal Order: ${order.finalOrder}\nStatus: ${order.status}\nNotes: ${order.notes}\nEmail: ${order.email}`);
  };

  const handleDownloadInvoice = (order) => {
    alert(`Downloading invoice for order ${order.orderNumber}`);
  };

  // Calculate summary statistics
  const totalOrders = filteredOrders.length;
  const confirmedOrders = filteredOrders.filter(order => order.status === 'Confirmed').length;
  const pendingOrders = filteredOrders.filter(order => order.status === 'Pending').length;
  const readyOrders = filteredOrders.filter(order => order.status === 'Ready').length;

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

      {/* Orders Table */}
      <ParentCard title="Order History">
        <DataTable rows={rows} columns={columns} defaultRows={10} />
      </ParentCard>
    </PageContainer>
  );
};

export default OrderHistory;
