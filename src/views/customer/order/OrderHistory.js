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
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample order data
  const orders = [
    { 
      id: 'ORD-2024-001', 
      orderDate: '2024-03-15',
      customerName: 'ABC Construction',
      customerNumber: 'CUST-001',
      items: [
        { type: 'Full Roll', color: 'White', quantity: 1, lengthInFeet: 216, pricePerFoot: 2.50 }
      ],
      totalAmount: 540.00,
      status: 'completed',
      deliveryDate: '2024-03-18',
      paymentStatus: 'paid'
    },
    { 
      id: 'ORD-2024-002', 
      orderDate: '2024-03-16',
      customerName: 'XYZ Interiors',
      customerNumber: 'CUST-002',
      items: [
        { type: 'Full Roll', color: 'Black', quantity: 1, lengthInFeet: 144, pricePerFoot: 2.50 }
      ],
      totalAmount: 360.00,
      status: 'in-progress',
      deliveryDate: '2024-03-20',
      paymentStatus: 'pending'
    },
    { 
      id: 'ORD-2024-003', 
      orderDate: '2024-03-17',
      customerName: 'Home Renovations Ltd',
      customerNumber: 'CUST-003',
      items: [
        { type: 'Ready Channel', color: 'Red', quantity: 2, lengthInFeet: 96, pricePerFoot: 3.00, holeDistance: '8 inches' }
      ],
      totalAmount: 576.00,
      status: 'pending',
      deliveryDate: '2024-03-22',
      paymentStatus: 'pending'
    },
    { 
      id: 'ORD-2024-004', 
      orderDate: '2024-03-18',
      customerName: 'Commercial Spaces Inc',
      customerNumber: 'CUST-004',
      items: [
        { type: 'Slitted', color: 'Gray', quantity: 3, lengthInFeet: 50, pricePerFoot: 2.25 }
      ],
      totalAmount: 337.50,
      status: 'completed',
      deliveryDate: '2024-03-19',
      paymentStatus: 'paid'
    },
    { 
      id: 'ORD-2024-005', 
      orderDate: '2024-03-19',
      customerName: 'Residential Builders',
      customerNumber: 'CUST-005',
      items: [
        { type: 'Full Roll', color: 'Blue', quantity: 1, lengthInFeet: 168, pricePerFoot: 2.40 }
      ],
      totalAmount: 403.20,
      status: 'shipped',
      deliveryDate: '2024-03-21',
      paymentStatus: 'paid'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'info';
      case 'shipped': return 'primary';
      case 'cancelled': return 'error';
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

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrdersByStatus = filteredOrders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  // DataTable column definitions
  const columns = [
    { 
      field: 'id', 
      label: 'Order #', 
      bold: true, 
      width: '12%' 
    },
    { 
      field: 'orderDate', 
      label: 'Order Date', 
      width: '10%' 
    },
    { 
      field: 'customerName', 
      label: 'Customer', 
      width: '18%' 
    },
    { 
      field: 'customerNumber', 
      label: 'Customer #', 
      muted: true, 
      width: '10%' 
    },
    { 
      field: 'items', 
      label: 'Items', 
      width: '25%' 
    },
    { 
      field: 'totalAmount', 
      label: 'Total', 
      type: 'text', 
      prefix: '$', 
      bold: true, 
      width: '10%' 
    },
    { 
      field: 'status', 
      label: 'Status', 
      type: 'chip', 
      chipColor: getStatusColor, 
      width: '8%' 
    },
    { 
      field: 'paymentStatus', 
      label: 'Payment', 
      type: 'chip', 
      chipColor: getPaymentStatusColor, 
      width: '8%' 
    },
    { 
      field: 'actions', 
      label: 'Actions', 
      width: '19%' 
    }
  ];

  // Format rows for DataTable with action buttons
  const rows = filteredOrdersByStatus.map(order => ({
    ...order,
    items: order.items.map(item => 
      `${item.quantity}× ${item.color} ${item.type}${item.holeDistance ? ` (${item.holeDistance})` : ''}`
    ).join(', '),
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
        <IconButton 
          size="small" 
          sx={{ color: palette.success.main }}
          onClick={() => handleTrackOrder(order)}
          title="Track Order"
        >
          <Download fontSize="small" />
        </IconButton>
        {order.status === 'pending' && (
          <IconButton 
            size="small" 
            sx={{ color: palette.warning.main }}
            onClick={() => handleModifyOrder(order)}
            title="Modify Order"
          >
            <FilterList fontSize="small" />
          </IconButton>
        )}
      </Stack>
    )
  }));

  const handleViewOrder = (order) => {
    const itemsList = order.items.map(item => 
      `${item.quantity} × ${item.color} ${item.type} (${item.lengthInFeet}ft) @ $${item.pricePerFoot}/ft${item.holeDistance ? ` - ${item.holeDistance}` : ''} = $${(item.quantity * item.lengthInFeet * item.pricePerFoot).toFixed(2)}`
    ).join('\n');
    
    alert(`Order Details:\n\nOrder #: ${order.id}\nOrder Date: ${order.orderDate}\nCustomer: ${order.customerName} (${order.customerNumber})\nStatus: ${order.status.toUpperCase()}\nPayment: ${order.paymentStatus.toUpperCase()}\nDelivery Date: ${order.deliveryDate}\nTotal Amount: $${order.totalAmount.toFixed(2)}\n\nItems:\n${itemsList}`);
  };

  const handleDownloadInvoice = (order) => {
    alert(`Downloading invoice for order ${order.id}`);
  };

  const handleTrackOrder = (order) => {
    alert(`Tracking order ${order.id} - Status: ${order.status}`);
  };

  const handleModifyOrder = (order) => {
    if (window.confirm(`Do you want to modify order ${order.id}?`)) {
      navigate(`/order/new`);
    }
  };

  // Calculate summary statistics
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
  const totalSpent = filteredOrders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.totalAmount, 0);

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
          <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: '8px' }}>
            Filter
          </Button>
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

      {/* Search and Filter Bar */}
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mb={3} alignItems="center">
        <TextField
          fullWidth
          placeholder="Search orders by order #, customer, or customer number..."
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
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
            size="medium"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Order Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Total Orders">
            <Typography variant="h4" fontWeight="600" color="primary.main">
              {totalOrders}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              All time orders
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Completed">
            <Typography variant="h4" fontWeight="600" color="success.main">
              {completedOrders}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Delivered orders
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Pending">
            <Typography variant="h4" fontWeight="600" color="warning.main">
              {pendingOrders}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Awaiting processing
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Total Spent">
            <Typography variant="h4" fontWeight="600" color="info.main">
              ${totalSpent.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total order value
            </Typography>
          </ChildCard>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <ParentCard title="Order History">
        <DataTable rows={rows} columns={columns} defaultRows={10} />
      </ParentCard>
    </PageContainer>
  );
};

export default OrderHistory;
