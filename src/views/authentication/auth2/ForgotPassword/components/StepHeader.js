import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Reusable step header with icon circle, title, and subtitle.
 * @param {{ icon: React.ReactNode, iconBg: string, title: string, subtitle: React.ReactNode }} props
 */
const StepHeader = ({ icon, iconBg, title, subtitle }) => (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
            sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
            }}
        >
            {icon}
        </Box>
        <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5, letterSpacing: '-0.3px' }}
        >
            {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
            {subtitle}
        </Typography>
    </Box>
);

export default StepHeader;