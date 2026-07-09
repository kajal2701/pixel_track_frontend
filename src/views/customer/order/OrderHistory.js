import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment, Stack,
} from '@mui/material';
import { Search, Receipt } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';
import OrderDetailModal from './OrderDetailModal';
import orderService from 'src/services/orderService';
import productService from 'src/services/productService';
import { STATUS_CHIP_COLOR, formatDate, generateColorOptions } from 'src/utils/helpers';

const columns = [
  { field: 'created_at',   label: 'Date' },
  { field: 'order_id',     label: 'Order ID', bold: true },
  {
    field: 'order_status',
    label: 'Status',
    type: 'chip',
    chipColor: STATUS_CHIP_COLOR,
  },
];

const OrderHistory = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [allOrders, setAllOrders]   = useState([]); // original full data from API
  const [colorOptions, setColorOptions] = useState([]);
  const [loading, setLoading]       = useState(true);

  // ── Modal state ──
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen]         = useState(false);

  const customer = JSON.parse(localStorage.getItem('customerData'));

  // ── Redirect if not logged in ──
  useEffect(() => {
    if (!customer?.id) {
      toast.error('Please login to view your orders.');
      navigate('/login');
    }
  }, []);

  // ── Fetch ONCE on mount ──
  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer?.id) return;
      setLoading(true);
      try {
        const [res, productsRes] = await Promise.all([
          orderService.getCustomerOrders(customer.id),
          productService.getAllProducts(),
        ]);
        
        const generatedOptions = generateColorOptions(productsRes.data || [], { grouped: true });
        setColorOptions(generatedOptions);

        const formatted = res.data.map((order) => ({
          ...order,
          created_at: formatDate(order.created_at),
        }));
        setAllOrders(formatted); // store full data
      } catch (err) {
        toast.error(err.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // ← runs only once

  // ── Filter locally from allOrders ──
  const filteredOrders = allOrders.filter((order) => {
    const q = searchTerm.toLowerCase();
    return (
      order.order_id?.toLowerCase().includes(q) ||
      order.order_status?.toLowerCase().includes(q) ||
      order.color?.toLowerCase().includes(q) ||
      order.channel_type?.toLowerCase().includes(q) ||
      order.created_at?.toLowerCase().includes(q)
    );
  });

  // ── Row click handler ──
  const handleRowClick = (row) => {
    setSelectedOrder(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <PageContainer title="Order History" description="View and track your orders">

      {/* ── Header ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>Order History</Typography>
        <Button
          variant="contained"
          startIcon={<Receipt />}
          onClick={() => navigate('/order/new')}
          sx={{ borderRadius: '8px' }}
        >
          New Order
        </Button>
      </Stack>

      {/* ── Search ── */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search by order ID, color, status..."
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
      <ParentCard title="Order History">
        <Box sx={{
          '& .MuiTableContainer-root': { overflowX: 'hidden !important' },
          '& table': { tableLayout: 'fixed', width: '100%' },
        }}>
          <DataTable
            rows={filteredOrders}
            columns={columns}
            defaultRows={10}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </Box>
      </ParentCard>

      {/* ── Order Detail Modal ── */}
      <OrderDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        colorOptions={colorOptions}
      />

    </PageContainer>
  );
};

export default OrderHistory;
