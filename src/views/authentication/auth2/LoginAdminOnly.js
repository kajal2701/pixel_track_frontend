import React from 'react';
import { Box, Card, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/assets/images/logos/logo.png';

const LoginAdminOnly = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();

  const handleLogin = () => {
    // Set user type in localStorage
    localStorage.setItem('userType', 'admin');
    localStorage.setItem('isAuthenticated', 'true');
    
    // Navigate to admin dashboard
    navigate('/admin/orders');
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword((v) => !v)}
                          sx={{ color: palette.secondary.main }}
                        >
                          {showPassword
                            ? <VisibilityOff fontSize="small" />
                            : <Visibility fontSize="small" />}
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
                variant="contained"
                color="primary"
                size="large"
                onClick={handleLogin}
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
                }}
              >
                Login
              </Button>

            </Box>
          </Card>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default LoginAdminOnly;