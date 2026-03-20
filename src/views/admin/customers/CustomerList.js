import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, TextField, InputAdornment } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList, Email, Phone } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';

const CustomerList = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const customers = [
    { 
      id: 'CUS-001', 
      name: 'John Doe', 
      email: 'john.doe@email.com', 
      phone: '+1 234-567-8900', 
      company: 'Doe Enterprises',
      orders: 12, 
      totalSpent: 15420.50, 
      status: 'active',
      joinDate: '2023-01-15'
    },
    { 
      id: 'CUS-002', 
      name: 'Jane Smith', 
      email: 'jane.smith@email.com', 
      phone: '+1 234-567-8901', 
      company: 'Smith Industries',
      orders: 8, 
      totalSpent: 8920.00, 
      status: 'active',
      joinDate: '2023-02-20'
    },
    { 
      id: 'CUS-003', 
      name: 'Bob Johnson', 
      email: 'bob.johnson@email.com', 
      phone: '+1 234-567-8902', 
      company: 'Johnson Corp',
      orders: 15, 
      totalSpent: 22100.75, 
      status: 'vip',
      joinDate: '2022-12-10'
    },
    { 
      id: 'CUS-004', 
      name: 'Alice Brown', 
      email: 'alice.brown@email.com', 
      phone: '+1 234-567-8903', 
      company: 'Brown LLC',
      orders: 3, 
      totalSpent: 1450.00, 
      status: 'inactive',
      joinDate: '2023-03-05'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'vip': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer title="Customer Management" description="Manage customer accounts and information">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Customers
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
              href="/admin/customers/new"
              sx={{ borderRadius: '8px' }}
            >
              Add Customer
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search customers by name, email, company, or ID..."
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

        {/* Customers Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Customer ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Orders</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Total Spent</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{customer.id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {customer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Joined {customer.joinDate}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Email fontSize="small" sx={{ color: palette.text.secondary, fontSize: '14px' }} />
                        <Typography variant="body2">{customer.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Phone fontSize="small" sx={{ color: palette.text.secondary, fontSize: '14px' }} />
                        <Typography variant="body2">{customer.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{customer.orders}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      color={getStatusColor(customer.status)}
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

export default CustomerList;
