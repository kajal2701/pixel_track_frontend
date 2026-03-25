import React, { useEffect } from 'react';
import {
  Box, Typography, Button, TextField,
  Paper, Grid, CircularProgress,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';

const CustomerForm = ({ 
  customer, 
  onSubmit, 
  loading, 
  isEdit = false, 
  onCancel 
}) => {
  const { palette } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      company_name: '',
      customer_number: '',
      contact_name: '',
      email: '',
      phone: '',
    },
  });

  // Reset form when customer data changes (for edit mode)
  useEffect(() => {
    if (customer && isEdit) {
      reset({
        company_name: customer.company_name || '',
        customer_number: customer.customer_number || '',
        contact_name: customer.contact_name || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    } else if (!isEdit) {
      reset({
        company_name: '',
        customer_number: '',
        contact_name: '',
        email: '',
        phone: '',
      });
    }
  }, [customer, isEdit, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
              Customer Information
            </Typography>
          </Grid>

          {/* Company Name */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Company Name *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter company name"
              {...register('company_name', { required: 'Company name is required' })}
              error={!!errors.company_name}
              helperText={errors.company_name?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Customer Number */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Customer Number *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter customer number"
              {...register('customer_number', { required: 'Customer number is required' })}
              error={!!errors.customer_number}
              helperText={errors.customer_number?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Contact Name */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Contact Person Name *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter contact person name"
              {...register('contact_name', { required: 'Contact name is required' })}
              error={!!errors.contact_name}
              helperText={errors.contact_name?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Email *
            </Typography>
            <TextField
              fullWidth
              type="email"
              variant="outlined"
              placeholder="Enter email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Please enter a valid email address (e.g., user@example.com)',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Phone Number *
            </Typography>
            <TextField
              fullWidth
              type="text"
              variant="outlined"
              placeholder="000-000-0000"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9-]*$/,
                  message: 'Only numbers and hyphens allowed',
                },
                validate: {
                  format: (value) => {
                    // Remove all hyphens and check if only numbers remain
                    const numbersOnly = value.replace(/-/g, '');
                    if (!/^\d+$/.test(numbersOnly)) {
                      return 'Phone number must contain only numbers';
                    }
                    // Check format: 000-000-0000
                    if (!/^\d{3}-?\d{3}-?\d{4}$/.test(value)) {
                      return 'Please use format: 000-000-0000';
                    }
                    return true;
                  },
                },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message || 'Format: 000-000-0000'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Actions */}
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
                startIcon={
                  loading
                    ? <CircularProgress size={18} color="inherit" />
                    : <Save />
                }
                sx={{ borderRadius: '8px', minWidth: 150 }}
              >
                {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Customer' : 'Create Customer')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CustomerForm;
