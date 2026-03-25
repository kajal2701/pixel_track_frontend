import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  IconButton, Grid, Stack, CircularProgress,
} from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';
import customerService from 'src/services/customerService';
import DeleteCustomerDialog from './DeleteCustomerDialog';
import { formatDate } from 'src/utils/helpers';

// Column definitions
const columns = [
  { field: 'customer_number', label: 'Customer #', bold: true, width: '150px', minWidth: '150px' },
  { field: 'company_name', label: 'Company', bold: true, width: '200px', minWidth: '200px' },
  { field: 'contact_name', label: 'Contact Person', width: '180px', minWidth: '180px' },
  { field: 'email', label: 'Email', width: '220px', minWidth: '220px' },
  { field: 'phone', label: 'Phone', width: '150px', minWidth: '150px' },
  { field: 'status', label: 'Status', type: 'chip', chipColor: (v) => ({ active: 'success', inactive: 'error' }[v] || 'default'), width: '100px', minWidth: '100px' },
  { field: 'created_at', label: 'Created Date', width: '130px', minWidth: '130px' },
  { field: 'actions', label: 'Actions', width: '120px', minWidth: '120px' },
];

const CustomerList = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, customer: null });

  // ── Fetch customers on mount ──────────────────────────────
  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.getAllCustomers();
      const formatted = response.data.map((customer) => ({
        ...customer,
        created_at: formatDate(customer.created_at),
      }));
      setAllCustomers(formatted);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  // ── Local filter ───────────────────────────────────────────
  const filteredCustomers = allCustomers.filter((customer) => {
    const q = searchTerm.toLowerCase();
    return [
      customer.customer_number,
      customer.company_name,
      customer.contact_name,
      customer.email,
      customer.phone,
      customer.status,
      customer.created_at,
    ].some((field) => field?.toLowerCase().includes(q));
  });

  // ── Delete dialog handlers ───────────────────────────────
  const openDeleteDialog = (customer) => setDeleteDialog({ open: true, customer });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, customer: null });

  const handleDeleteConfirm = async (customer) => {
    setActionLoading(true);
    try {
      await customerService.deleteCustomer(customer.id);
      toast.success(`Customer ${customer.company_name} deleted successfully.`);
      setAllCustomers((prev) => prev.filter((c) => c.id !== customer.id));
      closeDeleteDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to delete customer.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Edit handler ───────────────────────────────────────────
  const handleEdit = (customer) => {
    navigate(`/admin/customers/edit/${customer.id}`);
  };

  // ── Build rows with action buttons ──────────────────────────
  const rows = filteredCustomers.map((customer) => ({
    ...customer,
    actions: (
      <Stack direction="row" gap={0.5}>
        <IconButton
          size="small"
          sx={{ color: palette.info.main }}
          onClick={() => handleEdit(customer)}
          title="Edit"
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: palette.error.main }}
          onClick={() => openDeleteDialog(customer)}
          title="Delete"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    ),
  }));

  return (
    <PageContainer description="Manage customer accounts">
      {/* ── Header ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/customers/new')}
          sx={{ borderRadius: '8px' }}
        >
          Add Customer
        </Button>
      </Stack>

      {/* ── Search ── */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search customers..."
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

     

      {/* ── Table ── */}
      <ParentCard title="All Customers">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable rows={rows} columns={columns} defaultRows={10} />
        )}
      </ParentCard>

      {/* ── Delete Dialog ── */}
      <DeleteCustomerDialog
        open={deleteDialog.open}
        customer={deleteDialog.customer}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </PageContainer>
  );
};

export default CustomerList;