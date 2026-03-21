import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Stack, Grid } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList, PictureAsPdf, Download } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import ChildCard from '../../../components/shared/ChildCard';
import DataTable from '../../../components/shared/DataTable';

const Invoices = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample invoice data matching specifications
  const invoices = [
    { 
      id: 'INV-2024-001', 
      orderId: 'ORD-2024-001', 
      customerName: 'ABC Construction', 
      customerNumber: 'CUST-001',
      date: '2024-03-15', 
      dueDate: '2024-04-15',
      amount: 540.00, 
      status: 'paid',
      paymentMethod: 'Credit Card',
      items: [
        { description: 'White Full Roll - 216ft', quantity: 1, unitPrice: 2.50, total: 540.00 }
      ]
    },
    { 
      id: 'INV-2024-002', 
      orderId: 'ORD-2024-002', 
      customerName: 'XYZ Interiors', 
      customerNumber: 'CUST-002',
      date: '2024-03-16', 
      dueDate: '2024-04-16',
      amount: 360.00, 
      status: 'pending',
      paymentMethod: 'Bank Transfer',
      items: [
        { description: 'Black Full Roll - 144ft', quantity: 1, unitPrice: 2.50, total: 360.00 }
      ]
    },
    { 
      id: 'INV-2024-003', 
      orderId: 'ORD-2024-003', 
      customerName: 'Home Renovations Ltd', 
      customerNumber: 'CUST-003',
      date: '2024-03-17', 
      dueDate: '2024-04-17',
      amount: 864.00, 
      status: 'overdue',
      paymentMethod: 'PayPal',
      items: [
        { description: 'Red Full Roll - 288ft', quantity: 1, unitPrice: 3.00, total: 864.00 }
      ]
    },
    { 
      id: 'INV-2024-004', 
      orderId: 'ORD-2024-004', 
      customerName: 'Commercial Spaces Inc', 
      customerNumber: 'CUST-004',
      date: '2024-03-18', 
      dueDate: '2024-04-18',
      amount: 972.00, 
      status: 'paid',
      paymentMethod: 'Credit Card',
      items: [
        { description: 'Gray Full Roll - 432ft', quantity: 1, unitPrice: 2.25, total: 972.00 }
      ]
    },
    { 
      id: 'INV-2024-005', 
      orderId: 'ORD-2024-005', 
      customerName: 'Residential Builders', 
      customerNumber: 'CUST-005',
      date: '2024-03-19', 
      dueDate: '2024-04-19',
      amount: 403.20, 
      status: 'pending',
      paymentMethod: 'Bank Transfer',
      items: [
        { description: 'Blue Full Roll - 168ft', quantity: 1, unitPrice: 2.40, total: 403.20 }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Credit Card': return 'primary';
      case 'Bank Transfer': return 'info';
      case 'PayPal': return 'warning';
      case 'Cash': return 'success';
      case 'Check': return 'secondary';
      default: return 'default';
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary statistics
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0);

  // DataTable column definitions
  const columns = [
    { 
      field: 'id', 
      label: 'Invoice #', 
      bold: true, 
      width: '12%' 
    },
    { 
      field: 'orderId', 
      label: 'Order #', 
      width: '12%' 
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
      field: 'date', 
      label: 'Date', 
      width: '10%' 
    },
    { 
      field: 'dueDate', 
      label: 'Due Date', 
      width: '10%' 
    },
    { 
      field: 'amount', 
      label: 'Amount', 
      type: 'text', 
      prefix: '$', 
      bold: true, 
      width: '10%' 
    },
    { 
      field: 'paymentMethod', 
      label: 'Payment Method', 
      type: 'chip', 
      chipColor: getPaymentMethodColor, 
      width: '12%' 
    },
    { 
      field: 'status', 
      label: 'Status', 
      type: 'chip', 
      chipColor: getStatusColor, 
      width: '8%' 
    },
    { 
      field: 'actions', 
      label: 'Actions', 
      width: '18%' 
    }
  ];

  // Format rows for DataTable with action buttons
  const rows = filteredInvoices.map(invoice => ({
    ...invoice,
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        <IconButton 
          size="small" 
          sx={{ color: palette.info.main }}
          onClick={() => handleViewInvoice(invoice)}
          title="View Invoice"
        >
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: palette.primary.main }}
          onClick={() => handleDownloadPDF(invoice)}
          title="Download PDF"
        >
          <PictureAsPdf fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: palette.success.main }}
          onClick={() => handleSendInvoice(invoice)}
          title="Send Invoice"
        >
          <Download fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: palette.warning.main }}
          onClick={() => handleEditInvoice(invoice)}
          title="Edit Invoice"
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: palette.error.main }}
          onClick={() => handleDeleteInvoice(invoice)}
          title="Delete Invoice"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    )
  }));

  const handleViewInvoice = (invoice) => {
    const itemsList = invoice.items.map(item => 
      `${item.description} - ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}`
    ).join('\n');
    
    alert(`Invoice Details:\n\nInvoice #: ${invoice.id}\nOrder #: ${invoice.orderId}\nCustomer: ${invoice.customerName} (${invoice.customerNumber})\nDate: ${invoice.date}\nDue Date: ${invoice.dueDate}\nAmount: $${invoice.amount.toFixed(2)}\nPayment Method: ${invoice.paymentMethod}\nStatus: ${invoice.status.toUpperCase()}\n\nItems:\n${itemsList}`);
  };

  const handleDownloadPDF = (invoice) => {
    alert(`Downloading PDF for invoice ${invoice.id}`);
  };

  const handleSendInvoice = (invoice) => {
    alert(`Sending invoice ${invoice.id} to ${invoice.customerName}`);
  };

  const handleEditInvoice = (invoice) => {
    alert(`Edit invoice: ${invoice.id}`);
  };

  const handleDeleteInvoice = (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.id}?`)) {
      alert(`Invoice ${invoice.id} deleted!`);
    }
  };

  return (
    <PageContainer title="Invoice Management" description="Manage customer invoices and payments">
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>Invoice Management</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: '8px' }}>
            Filter
          </Button>
          <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: '8px' }}>
            Create Invoice
          </Button>
        </Stack>
      </Stack>

      {/* Search and Filter Bar */}
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mb={3} alignItems="center">
        <TextField
          fullWidth
          placeholder="Search invoices by invoice #, order #, customer, or customer number..."
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
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Invoice Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Total Invoices">
            <Typography variant="h4" fontWeight="600" color="primary.main">
              ${totalAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {filteredInvoices.length} invoices
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Paid">
            <Typography variant="h4" fontWeight="600" color="success.main">
              ${paidAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {filteredInvoices.filter(inv => inv.status === 'paid').length} invoices
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Pending">
            <Typography variant="h4" fontWeight="600" color="warning.main">
              ${pendingAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {filteredInvoices.filter(inv => inv.status === 'pending').length} invoices
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ChildCard title="Overdue">
            <Typography variant="h4" fontWeight="600" color="error.main">
              ${overdueAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {filteredInvoices.filter(inv => inv.status === 'overdue').length} invoices
            </Typography>
          </ChildCard>
        </Grid>
      </Grid>

      {/* Invoices Table */}
      <ParentCard title="Invoice Management">
        <DataTable rows={rows} columns={columns} defaultRows={10} />
      </ParentCard>
    </PageContainer>
  );
};

export default Invoices;