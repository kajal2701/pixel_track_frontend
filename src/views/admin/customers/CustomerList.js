import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Stack, Grid } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList, Email, Phone } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import ChildCard from '../../../components/shared/ChildCard';
import DataTable from '../../../components/shared/DataTable';

const CustomerList = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannelType, setFilterChannelType] = useState('all');

  // Sample customer data matching specifications
  const customers = [
    { 
      id: 'CUS-001', 
      companyName: 'ABC Construction',
      customerNumber: 'CUST-001',
      contactPersonName: 'John Doe',
      email: 'john.doe@abcconstruction.com', 
      phoneNumber: '+1 234-567-8900',
      pricePerFoot: 2.50,
      channelType: 'Commercial',
      notes: 'Preferred customer - bulk orders',
      status: 'active',
      joinDate: '2023-01-15'
    },
    { 
      id: 'CUS-002', 
      companyName: 'XYZ Interiors',
      customerNumber: 'CUST-002',
      contactPersonName: 'Jane Smith',
      email: 'jane.smith@xyzinteriors.com', 
      phoneNumber: '+1 234-567-8901',
      pricePerFoot: 2.75,
      channelType: 'Residential',
      notes: 'Regular residential projects',
      status: 'active',
      joinDate: '2023-02-20'
    },
    { 
      id: 'CUS-003', 
      companyName: 'Home Renovations Ltd',
      customerNumber: 'CUST-003',
      contactPersonName: 'Bob Johnson',
      email: 'bob.johnson@homerenovations.com', 
      phoneNumber: '+1 234-567-8902',
      pricePerFoot: 3.00,
      channelType: 'Residential',
      notes: 'VIP customer - priority service',
      status: 'vip',
      joinDate: '2022-12-10'
    },
    { 
      id: 'CUS-004', 
      companyName: 'Commercial Spaces Inc',
      customerNumber: 'CUST-004',
      contactPersonName: 'Alice Brown',
      email: 'alice.brown@commercialspaces.com', 
      phoneNumber: '+1 234-567-8903',
      pricePerFoot: 2.25,
      channelType: 'Commercial',
      notes: 'Large commercial projects',
      status: 'inactive',
      joinDate: '2023-03-05'
    },
    { 
      id: 'CUS-005', 
      companyName: 'Residential Builders',
      customerNumber: 'CUST-005',
      contactPersonName: 'Mike Wilson',
      email: 'mike.wilson@residentialbuilders.com', 
      phoneNumber: '+1 234-567-8904',
      pricePerFoot: 2.40,
      channelType: 'Residential',
      notes: 'New customer - potential for growth',
      status: 'active',
      joinDate: '2023-04-12'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'vip': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getChannelTypeColor = (type) => {
    switch (type) {
      case 'Commercial': return 'info';
      case 'Residential': return 'primary';
      default: return 'default';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    const matchesChannelType = filterChannelType === 'all' || customer.channelType === filterChannelType;
    
    return matchesSearch && matchesStatus && matchesChannelType;
  });

  // DataTable column definitions
  const columns = [
    { 
      field: 'companyName', 
      label: 'Company', 
      bold: true, 
      width: '18%' 
    },
    { 
      field: 'customerNumber', 
      label: 'Customer #', 
      type: 'text', 
      muted: true, 
      width: '12%' 
    },
    { 
      field: 'contactPersonName', 
      label: 'Contact Person', 
      width: '15%' 
    },
    { 
      field: 'email', 
      label: 'Email', 
      width: '20%' 
    },
    { 
      field: 'phoneNumber', 
      label: 'Phone', 
      width: '12%' 
    },
    { 
      field: 'pricePerFoot', 
      label: 'Price/Foot', 
      type: 'text', 
      prefix: '$', 
      width: '10%' 
    },
    { 
      field: 'channelType', 
      label: 'Channel Type', 
      type: 'chip', 
      chipColor: getChannelTypeColor, 
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
      field: 'actions', 
      label: 'Actions', 
      width: '15%' 
    }
  ];

  // Format rows for DataTable with action buttons
  const rows = filteredCustomers.map(customer => ({
    ...customer,
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        <IconButton 
          size="small" 
          sx={{ color: palette.info.main }}
          onClick={() => handleViewCustomer(customer)}
          title="View Details"
        >
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: palette.primary.main }}
          onClick={() => handleEditCustomer(customer)}
          title="Edit Customer"
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: palette.success.main }}
          onClick={() => handleEmailCustomer(customer)}
          title="Send Email"
        >
          <Email fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: palette.error.main }}
          onClick={() => handleDeleteCustomer(customer)}
          title="Delete Customer"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    )
  }));

  const handleViewCustomer = (customer) => {
    alert(`Customer Details:\n\nCompany: ${customer.companyName}\nCustomer Number: ${customer.customerNumber}\nContact Person: ${customer.contactPersonName}\nEmail: ${customer.email}\nPhone: ${customer.phoneNumber}\nPrice per Foot: $${customer.pricePerFoot}\nChannel Type: ${customer.channelType}\nStatus: ${customer.status}\n\nNotes: ${customer.notes || 'No notes'}\nJoined: ${customer.joinDate}`);
  };

  const handleEditCustomer = (customer) => {
    alert(`Edit customer: ${customer.companyName}`);
  };

  const handleEmailCustomer = (customer) => {
    window.open(`mailto:${customer.email}?subject=Prixel Track Order Inquiry`);
  };

  const handleDeleteCustomer = (customer) => {
    if (window.confirm(`Are you sure you want to delete customer ${customer.companyName}?`)) {
      alert(`Customer ${customer.companyName} deleted!`);
    }
  };

  return (
    <PageContainer title="Customer Management" description="Manage customer accounts and information">
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>Customer Management</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: '8px' }}>
            Filter
          </Button>
          <Button variant="contained" startIcon={<Add />} href="/admin/customers/new" sx={{ borderRadius: '8px' }}>
            Add Customer
          </Button>
        </Stack>
      </Stack>

      {/* Search and Filter Bar */}
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mb={3} alignItems="center">
        <TextField
          fullWidth
          placeholder="Search customers by company, customer number, contact person, email, or phone..."
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
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="vip">VIP</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Channel Type</InputLabel>
          <Select
            value={filterChannelType}
            label="Channel Type"
            onChange={(e) => setFilterChannelType(e.target.value)}
            size="medium"
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Residential">Residential</MenuItem>
            <MenuItem value="Commercial">Commercial</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Customer Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <ChildCard title="Total Customers">
            <Typography variant="h4" fontWeight="600" color="primary.main">
              {customers.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Active customer accounts
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChildCard title="Commercial Clients">
            <Typography variant="h4" fontWeight="600" color="info.main">
              {customers.filter(c => c.channelType === 'Commercial').length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Business customers
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChildCard title="Residential Clients">
            <Typography variant="h4" fontWeight="600" color="success.main">
              {customers.filter(c => c.channelType === 'Residential').length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Home owners
            </Typography>
          </ChildCard>
        </Grid>
      </Grid>

      {/* Customers Table */}
      <ParentCard title="Customer Management">
        <DataTable rows={rows} columns={columns} defaultRows={10} />
      </ParentCard>
    </PageContainer>
  );
};

export default CustomerList;