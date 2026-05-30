import React, { useState } from 'react';
import { Box, TextField, Button, Alert, CircularProgress, Typography, Fade } from '@mui/material';
import { Lock as LockIcon, ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import StepHeader from './StepHeader';
import useOtp from '../hooks/useOtp';

import { getButtonSx } from '../utils/styles';
import { maskEmail } from '../utils/maskEmail';

/**
 * Step 2 — 6-digit OTP entry and verification.
 * @param {{ email: string, onSuccess: () => void, onVerifyOtp: Function, onResendOtp: Function }} props
 */
const OtpStep = ({ email, onSuccess, onVerifyOtp, onResendOtp }) => {
    const { palette } = useTheme();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { otp, otpRefs, otpString, isComplete, resetOtp, handleChange, handleKeyDown, handlePaste } = useOtp();


    const handleVerify = async () => {
        setError('');
        if (!isComplete) return setError('Please enter the complete 6-digit OTP.');
        setLoading(true);
        try {
            await onVerifyOtp(email, otpString);
            onSuccess(otpString); // ← pass the verified OTP string up to parent
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setLoading(true);
        try {
            await onResendOtp(email);
            resetOtp();
        } catch (err) {
            setError(err.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fade in timeout={400}>
            <Box>
                <StepHeader
                    icon={<LockIcon sx={{ fontSize: 28, color: palette.warning.main }} />}
                    iconBg={`${palette.warning.main}15`}
                    title="Enter Verification Code"
                    subtitle={<>We sent a 6-digit code to <strong>{maskEmail(email)}</strong></>}
                />

                {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

                {/* OTP Input Boxes */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.2, mb: 3 }} onPaste={handlePaste}>
                    {otp.map((digit, idx) => (
                        <TextField
                            key={idx}
                            inputRef={(el) => (otpRefs.current[idx] = el)}
                            value={digit}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            variant="outlined"
                            inputProps={{
                                maxLength: 1,
                                style: {
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    padding: '12px 0',
                                    width: '44px',
                                    fontFamily: "'Courier New', monospace",
                                },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: digit ? `${palette.primary.main}08` : palette.grey[100],
                                    '& fieldset': {
                                        borderColor: digit ? palette.primary.main : palette.grey[300],
                                        borderWidth: digit ? '2px' : '1px',
                                    },
                                    '&.Mui-focused fieldset': { borderColor: palette.primary.main, borderWidth: '2px' },
                                },
                            }}
                        />
                    ))}
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading || !isComplete}
                    onClick={handleVerify}
                    sx={getButtonSx(palette)}
                >
                    {loading ? <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />Verifying...</> : 'Verify OTP'}
                </Button>

                {/* Resend OTP */}
                <Box sx={{ textAlign: 'center', mt: 2.5 }}>
                    <Typography
                        variant="body2"
                        onClick={handleResend}
                        sx={{
                            color: palette.primary.main, cursor: 'pointer', fontWeight: 600,
                            fontSize: '0.85rem', '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        Resend OTP
                    </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mt: 1.5 }}>
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

export default OtpStep;