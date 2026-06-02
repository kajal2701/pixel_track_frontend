import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField,
  Paper, Grid, CircularProgress, Divider,
  InputAdornment, MenuItem, IconButton, Switch,
} from '@mui/material';
import { Save, Cancel, AttachMoney, Visibility, VisibilityOff, Storefront, Home } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import {
  CHANNEL_PRICING_OPTIONS,
  PRICING_CATEGORIES,
  buildDefaultPricing,
  parsePricingFromApi,
  formatPhoneNumber,
} from 'src/utils/helpers';

// UI-specific config: icon and color for each pricing category
const CATEGORY_UI = {
  commercial: { icon: Storefront, color: 'primary' },
  residential: { icon: Home, color: 'success' },
};


const CustomerForm = ({ customer, onSubmit, loading, isEdit = false, onCancel }) => {
  const { palette } = useTheme();

  // channel_pricing state: { commercial: { "10h": { price: "2.50", enabled: true }, ... }, residential: { ... } }
  const [channelPricing, setChannelPricing] = useState(buildDefaultPricing());
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
      delivery_address: '',
    },
  });

  const statusValue = watch("status")
  // Pre-fill form when editing
  useEffect(() => {
    if (customer && isEdit) {
      reset({
        company_name: customer.company_name || '',
        customer_number: customer.customer_number || '',
        contact_name: customer.contact_name || '',
        email: customer.email || '',
        phone: formatPhoneNumber(customer.phone),
        status: customer.status || 'active',
        password: '',  // Never show hashed password; leave blank for "no change"
        delivery_address: customer.delivery_address || '',
      });
      setChannelPricing(parsePricingFromApi(customer.channel_pricing));
    } else if (!isEdit) {
      reset({ company_name: '', customer_number: '', contact_name: '', email: '', phone: '', status: 'active', password: '', delivery_address: '' });
      setChannelPricing(buildDefaultPricing());
    }
  }, [customer, isEdit, reset]);

  // Handle price input change for a category + key
  const handlePriceChange = (category, key, value) => {
    setChannelPricing((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: { ...prev[category][key], price: value },
      },
    }));
    // Clear error on change
    if (value !== '' && parseFloat(value) > 0) {
      setPricingErrors((prev) => ({ ...prev, [`${category}_${key}`]: false }));
    }
  };

  // Handle toggle change for a category + key
  const handleToggleChange = (category, key) => {
    setChannelPricing((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: { ...prev[category][key], enabled: !prev[category][key].enabled },
      },
    }));
    // Clear the "at least one" error when toggling on
    setPricingErrors((prev) => ({ ...prev, [`${category}_min`]: false }));
  };

  // Pricing validation — at least 1 enabled per category, price required for enabled sizes
  const validatePricing = () => {
    const errs = {};

    PRICING_CATEGORIES.forEach(({ key: cat }) => {
      const catPricing = channelPricing[cat] || {};
      let enabledCount = 0;

      CHANNEL_PRICING_OPTIONS.forEach(({ key }) => {
        const entry = catPricing[key] || {};
        if (entry.enabled) {
          enabledCount++;
          // Price required for enabled sizes
          if (!entry.price || entry.price === '' || parseFloat(entry.price) <= 0) {
            errs[`${cat}_${key}`] = true;
          }
        }
      });

      // At least one size must be enabled per category
      if (enabledCount === 0) {
        errs[`${cat}_min`] = true;
      }
    });

    setPricingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onFormSubmit = (data) => {
    if (!validatePricing()) return; // Block submit if pricing invalid

    // Build channel_pricing object in new nested format
    const pricingObj = { commercial: {}, residential: {} };

    PRICING_CATEGORIES.forEach(({ key: cat }) => {
      CHANNEL_PRICING_OPTIONS.forEach(({ key }) => {
        const entry = channelPricing[cat]?.[key] || {};
        pricingObj[cat][key] = {
          price: entry.price && !isNaN(parseFloat(entry.price)) ? parseFloat(entry.price) : 0,
          enabled: !!entry.enabled,
        };
      });
    });

    const payload = {
      ...data,
      channel_pricing: pricingObj,
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

          {/* ── Commercial & Residential pricing cards ── */}
          {PRICING_CATEGORIES.map(({ key: cat, label }) => {
            const { icon: Icon, color } = CATEGORY_UI[cat];
            return (
            <Grid item xs={12} md={6} key={cat}>
              <Box
                sx={{
                  border: `1px solid`,
                  borderColor: pricingErrors[`${cat}_min`] ? 'error.main' : `${color}.light`,
                  borderRadius: '12px',
                  p: 2.5,
                  backgroundColor: pricingErrors[`${cat}_min`] ? 'error.lighter' : `${color}.lighter`,
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Category Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Icon sx={{ color: `${color}.main`, fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: `${color}.dark` }}>
                    {label} Pricing
                  </Typography>
                </Box>

                {/* Size rows */}
                {CHANNEL_PRICING_OPTIONS.map(({ key, label: sizeLabel }) => {
                  const entry = channelPricing[cat]?.[key] || { price: '', enabled: true };
                  const hasError = !!pricingErrors[`${cat}_${key}`];

                  return (
                    <Box
                      key={key}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 1.5,
                        opacity: entry.enabled ? 1 : 0.5,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      {/* Toggle */}
                      <Switch
                        size="small"
                        checked={!!entry.enabled}
                        onChange={() => handleToggleChange(cat, key)}
                        color={color}
                      />

                      {/* Size label */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          minWidth: 120,
                          color: entry.enabled ? 'text.primary' : 'text.disabled',
                        }}
                      >
                        {sizeLabel}
                      </Typography>

                      {/* Price input */}
                      <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        placeholder="0.00"
                        value={entry.price}
                        onChange={(e) => handlePriceChange(cat, key, e.target.value)}
                        disabled={!entry.enabled}
                        inputProps={{ min: 0.01, step: '0.01' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography variant="body2" color="text.secondary">$/ft</Typography>
                            </InputAdornment>
                          ),
                        }}
                        error={hasError}
                        helperText={hasError ? 'Price required' : ''}
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                        }}
                      />
                    </Box>
                  );
                })}

                {/* Min-one-enabled error */}
                {pricingErrors[`${cat}_min`] && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    At least one size must be enabled for {label}
                  </Typography>
                )}
              </Box>
            </Grid>
          );
          })}

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
