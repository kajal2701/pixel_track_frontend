import React, { useState, useCallback } from 'react';
import { Box, TextField, Button, Alert, CircularProgress, Typography, Fade } from '@mui/material';
import { Email as EmailIcon, ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import StepHeader from './StepHeader';
import { getInputSx, getButtonSx, labelSx } from '../utils/styles';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Step 1 — Email entry and OTP dispatch.
 * @param {{ onSuccess: (email: string) => void }} props
 */
const EmailStep = ({ onSuccess, onSendOtp }) => {
    const { palette } = useTheme();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = useCallback(async () => {
        setError('');
        setEmailError('');

        if (!email) return setEmailError('Email is required');
        if (!EMAIL_REGEX.test(email)) return setEmailError('Enter a valid email address');

        setLoading(true);
        try {
            await onSendOtp(email);
            onSuccess(email);
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [email, onSendOtp, onSuccess]);

    return (
        <Fade in timeout={400}>
            <Box>
                <StepHeader
                    icon={<EmailIcon sx={{ fontSize: 28, color: palette.primary.main }} />}
                    iconBg={`${palette.primary.main}15`}
                    title="Forgot Password?"
                    subtitle="Enter your email address and we'll send you a verification code"
                />

                {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

                <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={labelSx}>Email Address</Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter your email address"
                        type="email"
                        variant="outlined"
                        size="small"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        error={!!emailError}
                        helperText={emailError}
                        sx={getInputSx(palette)}
                    />
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    onClick={handleSend}
                    sx={getButtonSx(palette)}
                >
                    {loading ? <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />Sending OTP...</> : 'Send OTP'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2.5 }}>
                    <Typography
                        component={Link}
                        to="/login"
                        variant="body2"
                        sx={{
                            color: 'text.secondary', textDecoration: 'none', fontSize: '0.85rem',
                            display: 'inline-flex', alignItems: 'center', gap: 0.5,
                            '&:hover': { color: palette.primary.main },
                        }}
                    >
                        <ArrowBack sx={{ fontSize: 16 }} /> Back to Login
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
};

export default EmailStep;