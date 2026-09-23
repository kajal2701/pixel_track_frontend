import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Stack, IconButton, Chip,
  CircularProgress,
} from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';
import invoiceService from '../../../services/invoiceService';
import { getInvoiceStatusColor, formatDate, encodeInvoiceId } from '../../../utils/helpers';

const CustomerInvoices = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const customer = JSON.parse(localStorage.getItem('customerData'));

  // ── Redirect if not logged in ──
  useEffect(() => {
    if (!customer?.id) {
      toast.error('Please login to view your invoices.');
      navigate('/login');
    }
  }, []);

  // ── Fetch invoices on mount ──
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!customer?.id) return;
      setLoading(true);
      try {
        const res = await invoiceService.getCustomerInvoices(customer.id);
        setInvoices(res.data || []);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch invoices.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // ── Filter locally ──
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchTerm.toLowerCase();
    return (
      inv.invoice_number?.toLowerCase().includes(q) ||
      inv.status?.toLowerCase().includes(q) ||
      inv.total_amount?.toString().includes(q) ||
      formatDate(inv.created_at)?.toLowerCase().includes(q)
    );
  });

  // ── View invoice handler ──
  const handleViewInvoice = (invoice) => {
    const encodedToken = encodeInvoiceId(invoice.id);
    navigate(`/view-invoice/${encodedToken}`);
  };

  // ── Table columns ──
  const columns = [
    {
      field: 'invoice_number',
      label: 'Invoice #',
      bold: true,
      width: '22%',
    },
    {
      field: 'created_at',
      label: 'Date',
      width: '18%',
    },
    {
      field: 'total_amount',
      label: 'Amount',
      bold: true,
      width: '18%',
    },
    {
      field: 'status',
      label: 'Status',
      type: 'chip',
      chipColor: getInvoiceStatusColor,
      width: '18%',
    },
    {
      field: 'actions',
      label: 'Actions',
      width: '12%',
    },
  ];

  const rows = filteredInvoices.map((invoice) => ({
    ...invoice,
    created_at: formatDate(invoice.created_at),
    total_amount: `$${parseFloat(invoice.total_amount || 0).toFixed(2)}`,
    actions: (
      <IconButton
        id={`btn-view-invoice-${invoice.id}`}
        size="small"
        sx={{ color: palette.info.main }}
        onClick={() => handleViewInvoice(invoice)}
        title="View Invoice"
      >
        <Visibility fontSize="small" />
      </IconButton>
    ),
  }));

  return (
    <PageContainer title="My Invoices" description="View your invoices and payment status">

      {/* ── Header ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>My Invoices</Typography>
      </Stack>

      {/* ── Search ── */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search by invoice number, status, amount..."
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
      <ParentCard title="Invoices">
        <Box sx={{
          '& .MuiTableContainer-root': { overflowX: 'hidden !important' },
          '& table': { tableLayout: 'fixed', width: '100%' },
        }}>
          <DataTable
            rows={rows}
            columns={columns}
            defaultRows={10}
            loading={loading}
            emptyMessage="No invoices found."
          />
        </Box>
      </ParentCard>

    </PageContainer>
  );
};

export default CustomerInvoices;
