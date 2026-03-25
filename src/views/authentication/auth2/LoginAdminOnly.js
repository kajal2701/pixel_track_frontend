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
import adminAuthService from 'src/services/adminAuthService';

const LoginAdminOnly = () => {
  const [showPassword, setShowPassword] = useState(false);
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
      username: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
     if (loading) return;
    setError('');
    setLoading(true);

    try {
      // Show loading toast
      const loadingToast = toast.loading('Authenticating...');

      const response = await adminAuthService.login(
        data.username,
        data.password
      );
      // Check if admin data has role field
      const adminData = response.admin || {};
      if (!adminData.role) {
        throw new Error('Invalid admin response: missing role information');
      }

      // Store admin data in localStorage
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('adminData', JSON.stringify(adminData));
      localStorage.setItem('userRole', adminData.role);

      // Navigate to admin dashboard immediately
      navigate('/admin/orders');
      
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
    <PageContainer title="Admin Login" description="Admin login page">
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
              boxShadow: '0 8px 40px rgba(27,58,45,0.13), 0 2px 8px rgba(0,0,0,0.06)',
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
                Admin Portal
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: palette.text.secondary,
                  mb: 3.5,
                  fontSize: '0.85rem',
                }}
              >
                Sign in with your admin credentials
              </Typography>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2.5 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Username */}
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
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your username"
                    variant="outlined"
                    size="small"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    {...register('username', {
                      required: 'Username is required',
                      minLength: {
                        value: 3,
                        message: 'Username must be at least 3 characters long',
                      },
                    })}
                    sx={inputSx}
                  />
                </Box>

                {/* Password */}
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
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    size="small"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                      },
                    })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setShowPassword((v) => !v)}
                            sx={{ color: palette.secondary.main }}
                          >
                            {showPassword ? (
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
                    '&:disabled': {
                      opacity: 0.6,
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

export default LoginAdminOnly;