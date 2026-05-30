import React, { useState } from 'react';
import { Box, Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/assets/images/logos/logo.png';
import authService from 'src/services/authService';

import StepIndicator from './components/StepIndicator';
import EmailStep from './components/EmailStep';
import OtpStep from './components/OtpStep';
import ResetPasswordStep from './components/ResetPasswordStep';

const STEPS = { EMAIL: 1, OTP: 2, RESET: 3 };

const ForgotPassword = () => {
    const [step, setStep] = useState(STEPS.EMAIL);
    const [email, setEmail] = useState('');
    const [otpString, setOtpString] = useState(''); // ← single source of truth
    const { palette } = useTheme();
    const navigate = useNavigate();

    // ── Service wrappers (keep UI components free of service imports) ──
    const handleSendOtp = async (emailValue) => {
        await authService.forgotPassword(emailValue);
        toast.success('OTP sent to your email!');
    };

    const handleVerifyOtp = async (emailValue, otp) => {
        await authService.verifyOtp(emailValue, otp);
        toast.success('OTP verified!');
    };

    const handleResendOtp = async (emailValue) => {
        await authService.forgotPassword(emailValue);
        toast.success('New OTP sent!');
    };

    const handleResetPassword = async (emailValue, otp, newPassword) => {
        await authService.resetPassword(emailValue, otp, newPassword);
        toast.success('Password reset successful!');
    };

    // ── Step transitions ──
    const onEmailSuccess = (emailValue) => {
        setEmail(emailValue);
        setOtpString('');   // clear any previous OTP
        setStep(STEPS.OTP);
    };

    const onOtpSuccess = (verifiedOtp) => {
        setOtpString(verifiedOtp); // ← save the real OTP digits from OtpStep
        setStep(STEPS.RESET);
    };

    const onResetSuccess = () => navigate('/login');

    return (
        <PageContainer title="Forgot Password" description="Reset your password">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
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
                        <img src={Logo} alt="PiXEL Tracks & Lights" style={{ width: '150px', height: 'auto' }} />
                    </Box>

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
                            <StepIndicator currentStep={step} />

                            {step === STEPS.EMAIL && (
                                <EmailStep
                                    onSendOtp={handleSendOtp}
                                    onSuccess={onEmailSuccess}
                                />
                            )}

                            {step === STEPS.OTP && (
                                <OtpStep
                                    email={email}
                                    onVerifyOtp={handleVerifyOtp}
                                    onResendOtp={handleResendOtp}
                                    onSuccess={onOtpSuccess}
                                />
                            )}

                            {step === STEPS.RESET && (
                                <ResetPasswordStep
                                    email={email}
                                    otpString={otpString}
                                    onResetPassword={handleResetPassword}
                                    onSuccess={onResetSuccess}
                                />
                            )}
                        </Box>
                    </Card>
                </Box>
            </Box>
        </PageContainer>
    );
};

export default ForgotPassword;