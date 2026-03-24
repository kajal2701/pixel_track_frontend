import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Stack, Grid } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList, Email, Phone } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';

const CustomerList = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');

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

 

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm);
    
    return matchesSearch;
  });

  // DataTable column definitions
  const columns = [
    { 
      field: 'companyName', 
      label: 'Company Name', 
      bold: true, 
      width: '20%',
      minWidth: '150px'
    },
    { 
      field: 'customerNumber', 
      label: 'Customer Number', 
      type: 'text', 
      muted: true, 
      width: '15%',
      minWidth: '120px'
    },
    { 
      field: 'contactPersonName', 
      label: 'Contact Person', 
      width: '15%',
      minWidth: '150px'
    },
    { 
      field: 'email', 
      label: 'Email', 
      width: '20%',
      minWidth: '200px'
    },
    { 
      field: 'phoneNumber', 
      label: 'Phone Number', 
      width: '15%',
      minWidth: '130px'
    },
    { 
      field: 'actions', 
      label: 'Actions', 
      width: '15%',
      minWidth: '100px'
    }
  ];

  // Format rows for DataTable with action buttons
  const rows = filteredCustomers.map(customer => ({
    ...customer,
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
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
          sx={{ color: palette.error.main }}
          onClick={() => handleDeleteCustomer(customer)}
          title="Delete Customer"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    )
  }));



  const handleEditCustomer = (customer) => {
    alert(`Edit customer: ${customer.companyName}`);
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
        
          <Button variant="contained" startIcon={<Add />} href="/admin/customers/new" sx={{ borderRadius: '8px' }}>
            Add Customer
          </Button>
        </Stack>
      </Stack>

      {/* Search Bar */}
      <Box mb={3}>
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
      </Box>

    

      {/* Customers Table */}
      <ParentCard title="Customer Management">
        <DataTable rows={rows} columns={columns} defaultRows={10} />
      </ParentCard>
    </PageContainer>
  );
};

export default CustomerList;