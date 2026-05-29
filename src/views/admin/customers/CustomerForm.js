import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField,
  Paper, Grid, CircularProgress, Divider,
  InputAdornment, MenuItem, IconButton,
} from '@mui/material';
import { Save, Cancel, AttachMoney, Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { CHANNEL_PRICING_OPTIONS, formatPhoneNumber } from 'src/utils/helpers';


const CustomerForm = ({ customer, onSubmit, loading, isEdit = false, onCancel }) => {
  const { palette } = useTheme();

  // channel_pricing state: { "10h": "2.50", "9h": "2.75", "8h": "3.00" }
  const [channelPricing, setChannelPricing] = useState({});
  const [pricingErrors, setPricingErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      company_name: '',
      customer_number: '',
      contact_name: '',
      email: '',
      phone: '',
      status: 'active',
      password: '',
    },
  });

  const statusValue = watch("status")
  // Pre-fill form when editing
  useEffect(() => {
    if (customer && isEdit) {
      // Decode Base64 password for display
      let decodedPassword = '';
      if (customer.password) {
        try {
          decodedPassword = atob(customer.password);
        } catch { decodedPassword = ''; }
      }
      reset({
        company_name: customer.company_name || '',
        customer_number: customer.customer_number || '',
        contact_name: customer.contact_name || '',
        email: customer.email || '',
        phone: formatPhoneNumber(customer.phone),
        status: customer.status || 'active',
        password: decodedPassword,
      });
      // channel_pricing comes as object from API e.g. { "10h": 2.50, "9h": 2.75 }
      if (customer.channel_pricing) {
        const existing = typeof customer.channel_pricing === 'string'
          ? JSON.parse(customer.channel_pricing)
          : customer.channel_pricing;
        // Convert values to strings for input fields
        const asStrings = {};
        Object.keys(existing).forEach((k) => {
          asStrings[k] = existing[k] != null ? String(existing[k]) : '';
        });
        setChannelPricing(asStrings);
      } else {
        setChannelPricing({});
      }
    } else if (!isEdit) {
      reset({ company_name: '', customer_number: '', contact_name: '', email: '', phone: '', status: 'active', password: '' });
      setChannelPricing({});
    }
  }, [customer, isEdit, reset]);

  // Handle price input change for a key
  const handlePriceChange = (key, value) => {
    setChannelPricing((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    if (value !== '' && parseFloat(value) > 0) {
      setPricingErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Shared pricing validation — called on both success and error paths
  const validatePricing = () => {
    const errors = {};
    CHANNEL_PRICING_OPTIONS.forEach(({ key }) => {
      const val = channelPricing[key];
      if (!val || val === '' || parseFloat(val) <= 0) {
        errors[key] = true;
      }
    });
    setPricingErrors(errors);
    return Object.keys(errors).length === 0; // true = valid
  };

  const onFormSubmit = (data) => {
    if (!validatePricing()) return; // Block submit if pricing invalid

    // Build channel_pricing object
    const pricingObj = {};
    Object.keys(channelPricing).forEach((key) => {
      const val = channelPricing[key];
      if (val !== '' && val !== null && !isNaN(parseFloat(val))) {
        pricingObj[key] = parseFloat(val);
      }
    });

    const payload = {
      ...data,
      channel_pricing: Object.keys(pricingObj).length > 0 ? pricingObj : null,
    };

    // Only include password if provided (for edit, empty means no change)
    if (!data.password) {
      delete payload.password;
    }

    onSubmit(payload);
  };

  // Called when RHF fields fail — still validate pricing so errors show together
  const onFormError = () => validatePricing();

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit(onFormSubmit, onFormError)} noValidate>
        <Grid container spacing={3}>

          {/* ── Customer Information ── */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1, color: palette.primary.main, fontWeight: 600 }}>
              Customer Information
            </Typography>
          </Grid>

          {/* Company Name */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Company Name *</Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Enter company name"
              {...register('company_name', { required: 'Company name is required' })}
              error={!!errors.company_name} helperText={errors.company_name?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Customer Number */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Customer Number *</Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Enter customer number"
              {...register('customer_number', { required: 'Customer number is required' })}
              error={!!errors.customer_number} helperText={errors.customer_number?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Contact Name */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Contact Person Name *</Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Enter contact person name"
              {...register('contact_name', { required: 'Contact name is required' })}
              error={!!errors.contact_name} helperText={errors.contact_name?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Email *</Typography>
            <TextField
              fullWidth type="email" variant="outlined" placeholder="Enter email address"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Enter a valid email' },
              })}
              error={!!errors.email} helperText={errors.email?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Phone Number *</Typography>
            <TextField
              fullWidth type="text" variant="outlined" placeholder="000-000-0000"
              onInput={(e) => {
                const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                e.target.value = !x[2] ? x[1] : `${x[1]}-${x[2]}${x[3] ? `-${x[3]}` : ''}`;
              }}
              {...register('phone', {
                required: 'Phone number is required',
                validate: {
                  format: (v) => /^\d{3}-\d{3}-\d{4}$/.test(v) || 'Please use format: 000-000-0000',
                },
              })}
              error={!!errors.phone} helperText={errors.phone?.message || 'Format: 000-000-0000'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>Status *</Typography>
            <TextField
              select
              fullWidth variant="outlined"
              {...register('status', { required: 'Status is required' })}
              value={statusValue}
              error={!!errors.status} helperText={errors.status?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>

          {/* Password */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Password {!isEdit && '*'}
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              placeholder={isEdit ? 'Leave blank to keep current' : 'Enter password (min 6 characters)'}
              {...register('password', {
                ...(!isEdit && { required: 'Password is required' }),
                validate: (v) => {
                  if (!v || v === '') return true; // Allow empty on edit
                  if (v.length < 6) return 'Password must be at least 6 characters';
                  return true;
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message || (isEdit ? 'Leave blank to keep current password' : 'Minimum 6 characters')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          {/* ── Pricing Section ── */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 0.5 }}>
              <AttachMoney sx={{ color: palette.success.main, fontSize: 22 }} />
              <Typography variant="h6" sx={{ color: palette.success.dark, fontWeight: 600 }}>
                Channel Pricing (Price Per Foot)
              </Typography>
            </Box>

          </Grid>

          {/* Dynamic price fields — one per channel length */}
          {CHANNEL_PRICING_OPTIONS.map(({ key, label }) => (
            <Grid item xs={12} sm={4} key={key}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                {label} *
              </Typography>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                placeholder="0.00"
                value={channelPricing[key] ?? ''}
                onChange={(e) => handlePriceChange(key, e.target.value)}
                inputProps={{ min: 0.01, step: '0.01' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body2" color="text.secondary">$/ft</Typography>
                    </InputAdornment>
                  ),
                }}
                error={!!pricingErrors[key]}
                helperText={pricingErrors[key] ? 'Price is required and must be greater than 0' : ''}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
          ))}

          {/* ── Actions ── */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined" startIcon={<Cancel />}
                onClick={onCancel} disabled={loading}
                sx={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button
                type="submit" variant="contained" disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
                sx={{ borderRadius: '8px', minWidth: 160 }}
              >
                {loading
                  ? (isEdit ? 'Updating...' : 'Creating...')
                  : (isEdit ? 'Update Customer' : 'Create Customer')}
              </Button>
            </Box>
          </Grid>

        </Grid>
      </form>
    </Paper>
  );
};

export default CustomerForm;
