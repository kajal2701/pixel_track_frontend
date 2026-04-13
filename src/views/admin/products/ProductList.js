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
  { field: 'product_name', label: 'Product', bold: true, width: '220px', minWidth: '220px' },
  { field: 'manufacturer', label: 'Manufacturer', width: '180px', minWidth: '180px' },
  { field: 'color', label: 'Color', width: '140px', minWidth: '140px' },
  { field: 'color_code', label: 'Color Code', width: '140px', minWidth: '140px' },
  {
    field: 'price',
    label: 'Price',
    width: '120px',
    minWidth: '120px',
    render: (row) => {
      if (row.price == null || row.price === '') return '-';
      const num = Number(row.price);
      if (!Number.isFinite(num)) return row.price;
      return `$${num.toFixed(2)}`;
    },
  },
  { field: 'stock', label: 'Stock', width: '100px', minWidth: '100px' },
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
        p.product_name,
        p.manufacturer,
        p.color,
        p.color_code,
        String(p.price ?? ''),
        String(p.stock ?? ''),
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
      toast.success(`Product "${product.product_name}" deleted successfully.`);
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/products/new')}
          sx={{ borderRadius: '8px' }}
        >
          Add Product
        </Button>
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            rows={rows}
            columns={columns}
            defaultRows={10}
            emptyMessage="No products found"
          />
        )}
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
