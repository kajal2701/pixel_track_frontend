import React, { useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, CircularProgress } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';

const ProductForm = ({ product, onSubmit, loading, isEdit = false, onCancel }) => {
  const { palette } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      product_name: '',
      manufacturer: '',
      color: '',
      color_code: '',
      price: '',
      stock: '',
    },
  });

  useEffect(() => {
    if (product && isEdit) {
      reset({
        product_name: product.product_name || '',
        manufacturer: product.manufacturer || '',
        color: product.color || '',
        color_code: product.color_code || '',
        price: product.price ?? '',
        stock: product.stock ?? '',
      });
      return;
    }

    if (!isEdit) {
      reset({
        product_name: '',
        manufacturer: '',
        color: '',
        color_code: '',
        price: '',
        stock: '',
      });
    }
  }, [product, isEdit, reset]);

  const onFormSubmit = (data) => {
    const payload = {
      product_name: data.product_name?.trim(),
      manufacturer: data.manufacturer?.trim(),
      color: data.color?.trim(),
      color_code: data.color_code?.trim() || null,
      price: data.price === '' ? null : Number(data.price),
      stock: data.stock === '' ? 0 : Number(data.stock),
    };
    onSubmit(payload);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
              Product Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Product Name *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter product name"
              {...register('product_name', { required: 'Product name is required' })}
              error={!!errors.product_name}
              helperText={errors.product_name?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Manufacturer *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter manufacturer"
              {...register('manufacturer', { required: 'Manufacturer is required' })}
              error={!!errors.manufacturer}
              helperText={errors.manufacturer?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Color *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter color"
              {...register('color', { required: 'Color is required' })}
              error={!!errors.color}
              helperText={errors.color?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Color Code *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter color code"
              {...register('color_code', { required: 'Color code is required' })}
              error={!!errors.color_code}
              helperText={errors.color_code?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Price *
            </Typography>
            <TextField
              fullWidth
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              variant="outlined"
              placeholder="0.00"
              {...register('price', {
                required: 'Price is required',
                validate: (v) =>
                  (Number.isFinite(Number(v)) && Number(v) >= 0) || 'Price must be 0 or higher',
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Stock
            </Typography>
            <TextField
              fullWidth
              type="number"
              inputProps={{ min: 0, step: '1' }}
              variant="outlined"
              placeholder="0"
              {...register('stock', {
                validate: (v) => {
                  if (v === '' || v == null) return true;
                  const n = Number(v);
                  if (!Number.isFinite(n) || n < 0) return 'Stock must be 0 or higher';
                  if (!Number.isInteger(n)) return 'Stock must be a whole number';
                  return true;
                },
              })}
              error={!!errors.stock}
              helperText={errors.stock?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={onCancel}
                disabled={loading}
                sx={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
                sx={{ borderRadius: '8px', minWidth: 150 }}
              >
                {loading
                  ? isEdit
                    ? 'Updating...'
                    : 'Creating...'
                  : isEdit
                    ? 'Update Product'
                    : 'Create Product'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm;
