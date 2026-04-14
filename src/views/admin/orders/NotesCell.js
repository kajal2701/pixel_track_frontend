import React from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { NoteAdd } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const NotesCell = ({ order, onOpenNotes }) => {
  const { palette } = useTheme();
  const hasNotes = order.additional_notes && order.additional_notes.trim() !== '';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      {hasNotes ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={order.additional_notes} placement="top" arrow>
            <Typography
              variant="caption"
              sx={{
                color: palette.text.secondary,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxWidth: '150px',
              }}
            >
              {order.additional_notes}
            </Typography>
          </Tooltip>
        </Box>
      ) : (
        <Tooltip title="Add notes" placement="top">
          <IconButton
            size="small"
            onClick={() => onOpenNotes(order)}
            sx={{ color: palette.grey[400], '&:hover': { color: palette.primary.main } }}
          >
            <NoteAdd fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default NotesCell;