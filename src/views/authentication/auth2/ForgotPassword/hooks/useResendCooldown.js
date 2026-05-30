import { useEffect, useState } from 'react';

/**
 * Provides a countdown timer for OTP resend cooldown.
 * @param {number} initialSeconds - seconds to count down from (default 60)
 */
const useResendCooldown = (initialSeconds = 60) => {
    const [cooldown, setCooldown] = useState(0);

    const startCooldown = () => setCooldown(initialSeconds);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    return { cooldown, startCooldown };
};

export default useResendCooldown;