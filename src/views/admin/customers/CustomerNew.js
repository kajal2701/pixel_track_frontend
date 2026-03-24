import React from 'react';
import { Box, Typography, Button, TextField, Paper, Grid } from '@mui/material';
import { Save, Cancel, ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageContainer from '../../../components/container/PageContainer';

const CustomerNew = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('New customer:', data);
    // Handle form submission here
    navigate('/admin/customers');
  };

  return (
    <PageContainer title="Add New Customer" description="Create a new customer account">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/customers')}
            sx={{ mr: 2, borderRadius: '8px' }}
          >
            Back to Customers
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Add New Customer
          </Typography>
        </Box>

        {/* Form */}
        <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
                  Customer Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Company Name
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  variant="outlined"
                  placeholder="Enter company name"
                  {...register('company_name', { required: 'Company name is required' })}
                  error={!!errors.company_name}
                  helperText={errors.company_name?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Customer Number
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  variant="outlined"
                  placeholder="e.g., CUST-001"
                  {...register('customer_number', { required: 'Customer number is required' })}
                  error={!!errors.customer_number}
                  helperText={errors.customer_number?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Contact Person Name
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  variant="outlined"
                  placeholder="Enter contact person name"
                  {...register('contact_name', { required: 'Contact person name is required' })}
                  error={!!errors.contact_name}
                  helperText={errors.contact_name?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  variant="outlined"
                  placeholder="Enter email address"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Must be a valid email format'
                    }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  Phone Number
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  variant="outlined"
                  placeholder="000-000-0000"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    maxLength: {
                      value: 12,
                      message: 'Max length: 12 characters'
                    },
                    pattern: {
                      value: /^\d{3}-\d{3}-\d{4}$/,
                      message: 'Pattern: 000-000-0000 (e.g., 123-456-7890)'
                    }
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message || 'Pattern: 000-000-0000 (e.g., 123-456-7890)'}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => navigate('/admin/customers')}
                    sx={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    sx={{ borderRadius: '8px' }}
                  >
                    Create Customer
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default CustomerNew;
