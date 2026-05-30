/**
 * Shared MUI sx styles for ForgotPassword form inputs.
 * Pass `palette` from useTheme().palette.
 */
export const getInputSx = (palette) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        background: palette.grey[100],
        fontSize: '0.92rem',
        '& fieldset': { borderColor: palette.grey[300] },
        '&:hover fieldset': { borderColor: palette.secondary.main },
        '&.Mui-focused fieldset': { borderColor: palette.primary.main, borderWidth: '2px' },
    },
    '& input': { py: '11px', px: '14px' },
});

/**
 * Shared MUI sx styles for the primary action button.
 * Pass `palette` from useTheme().palette.
 */
export const getButtonSx = (palette) => ({
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
    '&.Mui-disabled': { backgroundColor: palette.primary.main, color: '#ffffff', opacity: 0.7 },
});

/**
 * Shared label caption sx.
 */
export const labelSx = {
    fontWeight: 600,
    color: 'grey.500',
    mb: 0.8,
    display: 'block',
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};