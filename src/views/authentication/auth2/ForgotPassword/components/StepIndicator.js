import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * Displays a 3-step progress indicator bar.
 * @param {{ currentStep: number }} props
 */
const StepIndicator = ({ currentStep }) => {
    const { palette } = useTheme();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            {[1, 2, 3].map((s) => (
                <Box
                    key={s}
                    sx={{
                        width: currentStep >= s ? 32 : 24,
                        height: 4,
                        borderRadius: '4px',
                        backgroundColor: currentStep >= s ? palette.primary.main : palette.grey[300],
                        transition: 'all 0.3s ease',
                    }}
                />
            ))}
        </Box>
    );
};

export default StepIndicator;