import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';
import productService from 'src/services/productService';
import DeleteProductDialog from './DeleteProductDialog';
import { formatDate } from 'src/utils/helpers';

const columns = [
  { field: 'manufacturer', label: 'Manufacturer', bold: true, width: '220px', minWidth: '220px' },
  { field: 'color', label: 'Color', width: '140px', minWidth: '140px' },
  { field: 'color_code', label: 'Color Code', width: '140px', minWidth: '140px' },
  {
    field: 'full_roll_length',
    label: 'Roll Length',
    width: '120px',
    minWidth: '120px',
    render: (row) => (
      <Typography variant="h6" fontWeight="400">
        {row.full_roll_length != null ? `${row.full_roll_length} ft` : '98 ft'}
      </Typography>
    ),
  },
  {
    field: 'slits_per_roll',
    label: 'Slits/Roll',
    width: '110px',
    minWidth: '110px',
    render: (row) => (
      <Typography variant="h6" fontWeight="400">
        {row.slits_per_roll != null ? `× ${row.slits_per_roll}` : '× 6'}
      </Typography>
    ),
  },
  {
    field: 'slitted_roll_length',
    label: 'Slit Length',
    width: '120px',
    minWidth: '120px',
    render: (row) => (
      <Typography variant="h6" fontWeight="400">
        {row.slitted_roll_length != null ? `${row.slitted_roll_length} ft` : '98 ft'}
      </Typography>
    ),
  },
  { field: 'created_at', label: 'Created', width: '160px', minWidth: '160px' },
  { field: 'actions', label: 'Actions', width: '120px', minWidth: '120px' },
];

const ProductList = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState('');

  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });

  const colorOptions = useMemo(() => {
    const colors = allProducts.map((p) => p.color).filter(Boolean);
    return Array.from(new Set(colors)).sort((a, b) => String(a).localeCompare(String(b)));
  }, [allProducts]);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts(params);
      const formatted = (response.data || []).map((p) => ({
        ...p,
        created_at: p.created_at ? formatDate(p.created_at) : '',
      }));
      setAllProducts(formatted);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allProducts.filter((p) => {
      if (colorFilter && p.color !== colorFilter) return false;
      if (!q) return true;
      return [
        p.manufacturer,
        p.color,
        p.color_code,
      ].some((v) =>
        String(v ?? '')
          .toLowerCase()
          .includes(q),
      );
    });
  }, [allProducts, searchTerm, colorFilter]);

  const openDeleteDialog = (product) => setDeleteDialog({ open: true, product });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, product: null });

  const handleDeleteConfirm = async (product) => {
    setActionLoading(true);
    try {
      await productService.deleteProduct(product.id);
      toast.success(`Product "${product.color} (${product.color_code || product.id})" deleted successfully.`);
      closeDeleteDialog();
      await fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  const rows = filteredProducts.map((product) => ({
    ...product,
    actions: (
      <Stack direction="row" gap={0.5}>
        <IconButton
          size="small"
          sx={{ color: palette.info.main }}
          onClick={() => handleEdit(product)}
          title="Edit"
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: palette.error.main }}
          onClick={() => openDeleteDialog(product)}
          title="Delete"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    ),
  }));

  return (
    <PageContainer description="Manage products">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Products
        </Typography>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/products/groups')}
            sx={{ borderRadius: '8px' }}
          >
            Group Colors
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/products/new')}
            sx={{ borderRadius: '8px' }}
          >
            Add Product
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
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

        <TextField
          select
          fullWidth
          label="Color"
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, minWidth: { md: 260 } }}
        >
          <MenuItem value="">All</MenuItem>
          {colorOptions.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <ParentCard title="All Products">
        <DataTable
          rows={rows}
          columns={columns}
          defaultRows={10}
          loading={loading}
          emptyMessage="No products found"
        />
      </ParentCard>

      <DeleteProductDialog
        open={deleteDialog.open}
        product={deleteDialog.product}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </PageContainer>
  );
};

export default ProductList;
