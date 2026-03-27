import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/assets/images/logos/logo.png';
import authService from 'src/services/authService';

const LoginCustomerOrderPortal = () => {
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur', // Validate on blur
    defaultValues: {
      customer_number: '',
      access_code: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      // Show loading toast
      const loadingToast = toast.loading('Logging in...');

      const response = await authService.login(
        data.customer_number,
        data.access_code
      );

      // Check customer data structure (customer data doesn't have role field)
      const customerData = response.customer || {};
      if (!customerData.customer_number) {
        throw new Error('Invalid customer response: missing customer information');
      }

      // Store user data in localStorage
      localStorage.setItem('userType', 'customer');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('customerData', JSON.stringify(customerData));
      localStorage.setItem('userRole', 'customer'); // Set default role for customers

      // Navigate to customer order history immediately
      navigate('/order/history');

      // Show success toast after navigation
      setTimeout(() => {
        toast.success('Login successful!', {
          id: loadingToast,
        });
      }, 100);
    } catch (err) {
      // Handle different error responses
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Shared input style
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      background: palette.grey[100],
      fontSize: '0.92rem',
      '& fieldset': {
        borderColor: palette.grey[300],
      },
      '&:hover fieldset': {
        borderColor: palette.secondary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: palette.primary.main,
        borderWidth: '2px',
      },
    },
    '& input': { py: '11px', px: '14px' },
  };

  return (
    <PageContainer
      title="Customer Order Portal"
      description="Customer order portal login"
    >
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '520px',
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 2.5 }}>
            <img
              src={Logo}
              alt="PiXEL Tracks & Lights"
              style={{ width: '150px', height: 'auto' }}
            />
          </Box>

          {/* Card */}
          <Card
            elevation={0}
            sx={{
              width: '100%',
              borderRadius: '16px',
              border: `1.5px solid ${palette.divider}`,
              boxShadow:
                '0 8px 40px rgba(27,58,45,0.13), 0 2px 8px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              background: palette.background.default,
            }}
          >
            <Box sx={{ p: '32px 36px 36px' }}>
              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: palette.text.primary,
                  mb: 0.5,
                  letterSpacing: '-0.3px',
                }}
              >
                Customer Order Portal
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: palette.text.secondary,
                  mb: 3.5,
                  fontSize: '0.85rem',
                }}
              >
                Enter your credentials to access your orders
              </Typography>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2.5 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Customer Number */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: palette.grey[500],
                      mb: 0.8,
                      display: 'block',
                      fontSize: '0.78rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Customer Number
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your customer number"
                    variant="outlined"
                    size="small"
                    error={!!errors.customer_number}
                    helperText={errors.customer_number?.message}
                    {...register('customer_number', {
                      required: 'Customer number is required',
                      minLength: {
                        value: 1,
                        message: 'Customer number cannot be empty',
                      },
                    })}
                    sx={inputSx}
                  />
                </Box>

                {/* Access Code */}
                <Box sx={{ mb: 3.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: palette.grey[500],
                      mb: 0.8,
                      display: 'block',
                      fontSize: '0.78rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Access Code
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 400,
                        color: palette.text.secondary,
                        ml: 0.8,
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        letterSpacing: 0,
                      }}
                    >
                      (last 4 digits of phone)
                    </Typography>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g. 1234"
                    type={showCode ? 'text' : 'password'}
                    variant="outlined"
                    size="small"
                    error={!!errors.access_code}
                    helperText={errors.access_code?.message}
                    inputProps={{ maxLength: 4 }}
                    {...register('access_code', {
                      required: 'Access code is required',
                      pattern: {
                        value: /^\d{4}$/,
                        message: 'Access code must be exactly 4 digits',
                      },
                    })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowCode((v) => !v)}
                            sx={{ color: palette.secondary.main }}
                          >
                            {showCode ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                </Box>

                {/* Login Button */}
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    py: '12px',
                    letterSpacing: '0.4px',
                    textTransform: 'none',
                    boxShadow: `0 4px 18px ${palette.primary.main}55`,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      backgroundColor: palette.primary.dark,
                      boxShadow: `0 6px 24px ${palette.primary.main}77`,
                      transform: 'translateY(-1px)',
                    },
                    '&:active': { transform: 'translateY(0px)' },
                    '&.Mui-disabled': {
                      backgroundColor: palette.primary.main,
                      color: '#ffffff',
                      opacity: 0.7,
                    },
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </Box>
          </Card>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default LoginCustomerOrderPortal;