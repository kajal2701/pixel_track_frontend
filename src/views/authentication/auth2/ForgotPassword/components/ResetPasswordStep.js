import React, { useState } from 'react';
import {
    Box, TextField, Button, Alert, CircularProgress,
    Typography, Fade, InputAdornment, IconButton,
} from '@mui/material';
import { Lock as LockIcon, CheckCircleOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import StepHeader from './StepHeader';
import { getInputSx, getButtonSx, labelSx } from '../utils/styles';

/**
 * Step 3 — Set and confirm new password.
 * @param {{ email: string, otpString: string, onResetPassword: Function, onSuccess: () => void }} props
 */
const ResetPasswordStep = ({ email, otpString, onResetPassword, onSuccess }) => {
    const { palette } = useTheme();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const validate = () => {
        let valid = true;
        setPasswordError('');
        setConfirmError('');
        if (!newPassword) { setPasswordError('Password is required'); valid = false; }
        else if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters'); valid = false; }
        if (!confirmPassword) { setConfirmError('Please confirm your password'); valid = false; }
        else if (newPassword !== confirmPassword) { setConfirmError('Passwords do not match'); valid = false; }
        return valid;
    };

    const handleReset = async () => {
        setError('');
        if (!validate()) return;
        setLoading(true);
        try {
            await onResetPassword(email, otpString, newPassword);
            setDone(true);
            setTimeout(onSuccess, 2000);
        } catch (err) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const PasswordToggle = ({ show, onToggle }) => (
        <InputAdornment position="end">
            <IconButton size="small" onClick={onToggle} sx={{ color: palette.secondary.main }}>
                {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
        </InputAdornment>
    );

    if (done) {
        return (
            <Fade in timeout={400}>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CheckCircleOutline sx={{ fontSize: 64, color: palette.success.main, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                        Password Reset!
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Password reset successful! Redirecting to login...
                    </Typography>
                </Box>
            </Fade>
        );
    }

    return (
        <Fade in timeout={400}>
            <Box>
                <StepHeader
                    icon={<LockIcon sx={{ fontSize: 28, color: palette.success.main }} />}
                    iconBg={`${palette.success.main}15`}
                    title="Set New Password"
                    subtitle="Create a strong password for your account"
                />

                {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

                <Box sx={{ mb: 2.5 }}>
                    <Typography variant="caption" sx={labelSx}>New Password</Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter new password (min 6 characters)"
                        type={showNew ? 'text' : 'password'}
                        variant="outlined"
                        size="small"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                        error={!!passwordError}
                        helperText={passwordError}
                        InputProps={{ endAdornment: <PasswordToggle show={showNew} onToggle={() => setShowNew((v) => !v)} /> }}
                        sx={getInputSx(palette)}
                    />
                </Box>

                <Box sx={{ mb: 3.5 }}>
                    <Typography variant="caption" sx={labelSx}>Confirm Password</Typography>
                    <TextField
                        fullWidth
                        placeholder="Re-enter your new password"
                        type={showConfirm ? 'text' : 'password'}
                        variant="outlined"
                        size="small"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(''); }}
                        error={!!confirmError}
                        helperText={confirmError}
                        InputProps={{ endAdornment: <PasswordToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} /> }}
                        sx={getInputSx(palette)}
                    />
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    onClick={handleReset}
                    sx={getButtonSx(palette)}
                >
                    {loading ? <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />Resetting...</> : 'Reset Password'}
                </Button>
            </Box>
        </Fade>
    );
};

export default ResetPasswordStep;