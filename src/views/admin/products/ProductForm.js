import React, { useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, CircularProgress, Divider } from '@mui/material';
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
      manufacturer: '',
      color: '',
      color_code: '',
      full_roll_length: '98',
      slits_per_roll: '6',
      slitted_roll_length: '98',
    },
  });

  useEffect(() => {
    if (product && isEdit) {
      reset({
        manufacturer: product.manufacturer || '',
        color: product.color || '',
        color_code: product.color_code || '',
        full_roll_length: product.full_roll_length ?? '98',
        slits_per_roll: product.slits_per_roll ?? '6',
        slitted_roll_length: product.slitted_roll_length ?? '98',
      });
      return;
    }

    if (!isEdit) {
      reset({
        manufacturer: '',
        color: '',
        color_code: '',
        full_roll_length: '98',
        slits_per_roll: '6',
        slitted_roll_length: '98',
      });
    }
  }, [product, isEdit, reset]);

  const onFormSubmit = (data) => {
    const payload = {
      product_name: null,
      manufacturer: data.manufacturer?.trim(),
      color: data.color?.trim(),
      color_code: data.color_code?.trim() || null,
      price: null,
      stock: null,
      full_roll_length: data.full_roll_length === '' ? 98 : Number(data.full_roll_length),
      slits_per_roll: data.slits_per_roll === '' ? 6 : Number(data.slits_per_roll),
      slitted_roll_length: data.slitted_roll_length === '' ? 98 : Number(data.slitted_roll_length),
    };
    onSubmit(payload);
  };

  // ── Section heading helper ──
  const SectionHeading = ({ title }) => (
    <Grid item xs={12}>
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 0.5, color: palette.primary.main, fontWeight: 700, letterSpacing: 0.3 }}>
        {title}
      </Typography>
      <Divider />
    </Grid>
  );

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 0, color: palette.primary.main, fontWeight: 600 }}>
              Product Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Manufacturer (Supplier) *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter manufacturer / supplier name"
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


          {/* ── Section: Supplier Roll Configuration ── */}
          <SectionHeading title="Roll Configuration" />

          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Configure the production specs for this supplier. These values are used when converting Full Rolls → Slitted Rolls → Ready Channels.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Full Roll Length (feet) *
            </Typography>
            <TextField
              fullWidth
              type="number"
              inputProps={{ min: 1, step: '0.01' }}
              variant="outlined"
              placeholder="e.g., 98"
              {...register('full_roll_length', {
                required: 'Full roll length is required',
                validate: (v) => {
                  const n = Number(v);
                  if (!Number.isFinite(n) || n <= 0) return 'Must be greater than 0';
                  return true;
                },
              })}
              error={!!errors.full_roll_length}
              helperText={errors.full_roll_length?.message || 'Length of one full roll from this supplier'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Slits Per Roll *
            </Typography>
            <TextField
              fullWidth
              type="number"
              inputProps={{ min: 1, step: '1' }}
              variant="outlined"
              placeholder="e.g., 6"
              {...register('slits_per_roll', {
                required: 'Slits per roll is required',
                validate: (v) => {
                  const n = Number(v);
                  if (!Number.isFinite(n) || n <= 0) return 'Must be greater than 0';
                  if (!Number.isInteger(n)) return 'Must be a whole number';
                  return true;
                },
              })}
              error={!!errors.slits_per_roll}
              helperText={errors.slits_per_roll?.message || 'Number of slitted rolls produced from 1 full roll'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Slitted Roll Length (feet) *
            </Typography>
            <TextField
              fullWidth
              type="number"
              inputProps={{ min: 1, step: '0.01' }}
              variant="outlined"
              placeholder="e.g., 98"
              {...register('slitted_roll_length', {
                required: 'Slitted roll length is required',
                validate: (v) => {
                  const n = Number(v);
                  if (!Number.isFinite(n) || n <= 0) return 'Must be greater than 0';
                  return true;
                },
              })}
              error={!!errors.slitted_roll_length}
              helperText={errors.slitted_roll_length?.message || 'Length of each slitted roll (may differ from full roll)'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* ── Actions ── */}
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
