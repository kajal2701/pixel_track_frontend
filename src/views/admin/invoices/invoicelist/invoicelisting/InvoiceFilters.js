import React from 'react';
import PropTypes from 'prop-types';
import {
  Stack, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const InvoiceFilters = ({
  searchTerm,
  onSearchChange,
  filterCustomer,
  onCustomerChange,
  filterStatus,
  onStatusChange,
  customers = [],
  activeTab,
}) => {
  const theme = useTheme();
  const { palette } = theme;

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mb={3} alignItems="center">
      <TextField
        fullWidth
        placeholder={activeTab === 0 ? "Search by order #, customer, contact, color..." : "Search by invoice #, order #, customer, contact..."}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: palette.text.secondary }} />
            </InputAdornment>
          ),
        }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
      />
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Customer</InputLabel>
        <Select
          value={filterCustomer}
          label="Customer"
          onChange={(e) => onCustomerChange(e.target.value)}
          size="medium"
          sx={{ borderRadius: '12px' }}
        >
          <MenuItem value="all">All Customers</MenuItem>
          {customers.map((cust) => (
            <MenuItem key={cust} value={cust}>{cust}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {activeTab !== 0 && (
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => onStatusChange(e.target.value)}
            size="medium"
            sx={{ borderRadius: '12px' }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Sent">Sent</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      )}
    </Stack>
  );
};

InvoiceFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filterCustomer: PropTypes.string.isRequired,
  onCustomerChange: PropTypes.func.isRequired,
  filterStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  customers: PropTypes.arrayOf(PropTypes.string),
  activeTab: PropTypes.number.isRequired,
};

export default InvoiceFilters;
