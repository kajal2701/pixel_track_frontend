import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, TextField, InputAdornment } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList, PictureAsPdf, Download } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';

const Invoices = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const invoices = [
    { 
      id: 'INV-001', 
      orderId: 'ORD-001', 
      customer: 'John Doe', 
      date: '2024-01-15', 
      dueDate: '2024-02-15',
      amount: 1250.00, 
      status: 'paid',
      paymentMethod: 'Credit Card'
    },
    { 
      id: 'INV-002', 
      orderId: 'ORD-002', 
      customer: 'Jane Smith', 
      date: '2024-01-14', 
      dueDate: '2024-02-14',
      amount: 890.00, 
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    },
    { 
      id: 'INV-003', 
      orderId: 'ORD-003', 
      customer: 'Bob Johnson', 
      date: '2024-01-13', 
      dueDate: '2024-02-13',
      amount: 2100.00, 
      status: 'overdue',
      paymentMethod: 'PayPal'
    },
    { 
      id: 'INV-004', 
      orderId: 'ORD-004', 
      customer: 'Alice Brown', 
      date: '2024-01-12', 
      dueDate: '2024-02-12',
      amount: 450.00, 
      status: 'paid',
      paymentMethod: 'Credit Card'
    },
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
      default: return 'default';
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <PageContainer title="Invoice Management" description="Manage customer invoices and payments">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Invoices
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
              sx={{ borderRadius: '8px' }}
            >
              Create Invoice
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Paper sx={{ flex: 1, p: 2, borderRadius: '12px', backgroundColor: palette.success.light }}>
            <Typography variant="h6" color="success.dark">Total Invoices</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: palette.success.dark }}>
              ${totalAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="success.dark">
              {filteredInvoices.length} invoices
            </Typography>
          </Paper>
          <Paper sx={{ flex: 1, p: 2, borderRadius: '12px', backgroundColor: palette.info.light }}>
            <Typography variant="h6" color="info.dark">Paid</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: palette.info.dark }}>
              ${paidAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="info.dark">
              {filteredInvoices.filter(inv => inv.status === 'paid').length} invoices
            </Typography>
          </Paper>
          <Paper sx={{ flex: 1, p: 2, borderRadius: '12px', backgroundColor: palette.warning.light }}>
            <Typography variant="h6" color="warning.dark">Pending</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: palette.warning.dark }}>
              ${pendingAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="warning.dark">
              {filteredInvoices.filter(inv => inv.status === 'pending').length} invoices
            </Typography>
          </Paper>
          <Paper sx={{ flex: 1, p: 2, borderRadius: '12px', backgroundColor: palette.error.light }}>
            <Typography variant="h6" color="error.dark">Overdue</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: palette.error.dark }}>
              ${overdueAmount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="error.dark">
              {filteredInvoices.filter(inv => inv.status === 'overdue').length} invoices
            </Typography>
          </Paper>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search invoices by ID, customer, or order ID..."
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

        {/* Invoices Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Invoice ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Payment Method</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{invoice.id}</TableCell>
                  <TableCell>{invoice.orderId}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.paymentMethod}
                      color={getPaymentMethodColor(invoice.paymentMethod)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      color={getStatusColor(invoice.status)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: palette.info.main }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: palette.primary.main }}>
                        <PictureAsPdf fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: palette.success.main }}>
                        <Download fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: palette.warning.main }}>
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

export default Invoices;
