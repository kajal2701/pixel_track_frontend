import React from 'react';
import { Box, IconButton, Typography, Tooltip, Stack } from '@mui/material';
import { NoteAdd, Edit, Person, AdminPanelSettings } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const NotesCell = ({ order, onOpenNotes }) => {
  const { palette } = useTheme();
  const hasCustomerNotes = order.customer_notes && order.customer_notes.trim() !== '';
  const hasAdminNotes = order.additional_notes && order.additional_notes.trim() !== '';
  const hasAnyNotes = hasCustomerNotes || hasAdminNotes;

  // Build tooltip content
  const tooltipContent = hasAnyNotes ? (
    <Box sx={{ maxWidth: 280 }}>
      {hasCustomerNotes && (
        <Box sx={{ mb: hasAdminNotes ? 1 : 0 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Customer:</Typography>
          <Typography variant="caption">{order.customer_notes}</Typography>
        </Box>
      )}
      {hasAdminNotes && (
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Admin:</Typography>
          <Typography variant="caption">{order.additional_notes}</Typography>
        </Box>
      )}
      {!hasAdminNotes && (
        <Box sx={{ mt: 0.5, borderTop: '1px solid rgba(255,255,255,0.2)', pt: 0.5 }}>
          <Typography variant="caption" sx={{ fontStyle: 'italic', opacity: 0.8 }}>Click ✏️ to add admin notes</Typography>
        </Box>
      )}
    </Box>
  ) : 'Add notes';

  // Determine edit icon color
  const editIconColor = !hasAdminNotes ? palette.warning.main : palette.grey[400];

  // No notes at all — show add icon
  if (!hasAnyNotes) {
    return (
      <Tooltip title="Add notes" placement="top">
        <IconButton
          size="small"
          onClick={() => onOpenNotes(order)}
          sx={{ color: palette.grey[400], '&:hover': { color: palette.primary.main } }}
        >
          <NoteAdd fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  // Has notes — show text preview + edit icon
  return (
    <Tooltip title={tooltipContent} placement="top" arrow>
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}
      >
        {/* Note type icons */}
        <Stack direction="row" spacing={0} alignItems="center" sx={{ flexShrink: 0 }}>
          {hasCustomerNotes && (
            <Person sx={{ fontSize: 14, color: palette.info.main }} />
          )}
          {hasAdminNotes && (
            <AdminPanelSettings sx={{ fontSize: 14, color: palette.warning.main }} />
          )}
        </Stack>

        {/* Truncated text */}
        <Typography
          variant="caption"
          sx={{
            color: palette.text.secondary,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
            minWidth: 0,
          }}
        >
          {hasAdminNotes ? order.additional_notes : order.customer_notes}
        </Typography>

        {/* Edit button — orange when admin notes missing, grey when present */}
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onOpenNotes(order); }}
          sx={{
            flexShrink: 0,
            color: editIconColor,
            '&:hover': { color: palette.primary.main },
            ...((!hasAdminNotes) && {
              animation: 'pulse-glow 2s ease-in-out infinite',
              '@keyframes pulse-glow': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }),
          }}
          title={hasAdminNotes ? 'Edit notes' : 'Add admin notes'}
        >
          <Edit sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default NotesCell;