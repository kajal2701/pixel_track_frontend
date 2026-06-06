import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Container, Paper } from '@mui/material';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';
import orderService from 'src/services/orderService';
import LogoImg from 'src/assets/images/logos/logo.png';

const ModificationResolve = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const action = searchParams.get('action');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const resolveMod = async () => {
      if (!orderId || !action) {
        setErrorMsg('Invalid or missing parameters.');
        setLoading(false);
        return;
      }

      try {
        await orderService.resolveModification(orderId, { action });
        setSuccess(true);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to resolve modification.');
      } finally {
        setLoading(false);
      }
    };

    resolveMod();
  }, [orderId, action]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f6f8',
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', borderRadius: 2, width: '100%', maxWidth: 500 }}>
        <Box display="flex" justifyContent="center" mb={4}>
          <img src={LogoImg} alt="PiXEL Tracks & Lights" style={{ height: '64px', objectFit: 'contain' }} />
        </Box>

        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress size={48} />
            <Typography variant="h6" color="text.secondary">
              Processing your request...
            </Typography>
          </Box>
        ) : success ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Success
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {action === 'approve'
                ? 'Modification has been approved and applied to your order.'
                : 'Modification request has been cancelled.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Go to Dashboard
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <ErrorOutline sx={{ fontSize: 64, color: 'error.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Error
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {errorMsg}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Back to Home
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ModificationResolve;
