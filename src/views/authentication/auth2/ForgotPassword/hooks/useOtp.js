import { useRef, useState } from 'react';

/**
 * Manages 6-digit OTP state: values, refs, and input handlers.
 */
const useOtp = () => {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const otpRefs = useRef([]);

    const resetOtp = () => setOtp(Array(6).fill(''));

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const updated = [...otp];
        updated[index] = value.slice(-1);
        setOtp(updated);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const updated = Array(6).fill('');
        for (let i = 0; i < pasted.length; i++) updated[i] = pasted[i];
        setOtp(updated);
        otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    return {
        otp,
        otpRefs,
        otpString: otp.join(''),
        isComplete: otp.join('').length === 6,
        resetOtp,
        handleChange,
        handleKeyDown,
        handlePaste,
    };
};

export default useOtp;