import React from 'react';
import {
  Box, Typography, Stack, Chip, Alert, LinearProgress,
} from '@mui/material';
import { CheckCircleOutline, Warning, ErrorOutline } from '@mui/icons-material';

const InventoryBreakdown = ({ result }) => {
  const {
    orderQty, readyUsed, readyAvailable,
    slittedUsed, slittedTotalFeet, slittedPossiblePieces,
    fullRollUsed, fullRollTotalFeet, fullRollPossiblePieces,
    totalSatisfied, shortage, isFullySatisfied,
  } = result;

  const progress = orderQty > 0 ? Math.min((totalSatisfied / orderQty) * 100, 100) : 0;

  const stages = [
    {
      label: 'Ready Channel',
      used: readyUsed,
      detail: `${readyAvailable} pcs in stock`,
      icon: <CheckCircleOutline fontSize="small" />,
      chipColor: readyUsed > 0 ? 'success' : 'default',
      show: true,
    },
    {
      label: 'Slitted',
      used: slittedUsed,
      detail: `${slittedPossiblePieces} pcs producible (${slittedTotalFeet} ft material)`,
      icon: <Warning fontSize="small" />,
      chipColor: slittedUsed > 0 ? 'warning' : 'default',
      show: true,
    },
    {
      label: 'Full Roll',
      used: fullRollUsed,
      detail: `${fullRollPossiblePieces} pcs producible (${fullRollTotalFeet} ft material)`,
      icon: <Warning fontSize="small" />,
      chipColor: fullRollUsed > 0 ? 'warning' : 'default',
      show: true,
    },
  ];

  return (
    <Box>
      {/* Order requirement */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="body2" color="text.secondary">
          Order requires
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          {orderQty} pieces
        </Typography>
      </Stack>

      {/* Progress bar */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={isFullySatisfied ? 'success' : shortage > 0 ? 'error' : 'warning'}
          sx={{ height: 8, borderRadius: 4, backgroundColor: 'grey.200' }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
          {totalSatisfied} / {orderQty} pieces fulfilled
        </Typography>
      </Box>

      {/* Stage breakdown */}
      <Stack spacing={1}>
        {stages.map((s) => (
          <Box
            key={s.label}
            sx={{
              p: 1.5,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: s.used > 0 ? `${s.chipColor}.main` : 'divider',
              backgroundColor: s.used > 0 ? `${s.chipColor}.lighter` : 'transparent',
              opacity: s.used > 0 ? 1 : 0.7,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                {s.icon}
                <Typography variant="body2" fontWeight={600}>
                  {s.label}
                </Typography>
              </Stack>
              <Chip
                label={`${s.used} pcs used`}
                size="small"
                color={s.chipColor}
                variant={s.used > 0 ? 'filled' : 'outlined'}
                sx={{ borderRadius: '6px', fontWeight: 600, fontSize: '0.7rem' }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', ml: 3.5 }}>
              Available: {s.detail}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Result alert */}
      {isFullySatisfied ? (
        <Alert
          severity="success"
          icon={<CheckCircleOutline fontSize="small" />}
          sx={{ mt: 2, borderRadius: '8px' }}
        >
          Inventory is <strong>sufficient</strong> to fulfill this order.
        </Alert>
      ) : (
        <Alert
          severity="error"
          icon={<ErrorOutline fontSize="small" />}
          sx={{ mt: 2, borderRadius: '8px' }}
        >
          <strong>{shortage} pieces</strong> insufficient in inventory.
        </Alert>
      )}
    </Box>
  );
};

export default InventoryBreakdown;
