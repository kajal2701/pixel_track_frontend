import React, { useState } from 'react';
import {
  TableRow, TableCell, IconButton, Typography, Stack, Chip,
  Collapse, Box, Grid, Paper
} from '@mui/material';
import {
  KeyboardArrowDown, KeyboardArrowUp, Edit, Delete
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getStatusInfo } from './helperFunction';
import { calculateProductionDetails } from 'src/utils/helpers';

const CollapsibleRow = ({ row, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const { palette } = useTheme();

  // Build detail sections for the expanded area
  const stages = [
    {
      label: 'Full Roll',
      chipColor: 'primary',
      qty: row.fullRoll_qty,
      state: row.fullRoll_state,
      itemId: row.fullRoll_id,
      details: [
        { label: 'Quantity', value: row.fullRoll_qty },
        { label: 'Size', value: row.fullRoll_size || '—' },
        { label: 'Possible Production', value: calculateProductionDetails(row.fullRoll_size, row.fullRoll_qty) },
      ],
    },
    {
      label: 'Slitted',
      chipColor: 'warning',
      qty: row.slitted_qty,
      state: row.slitted_state,
      itemId: row.slitted_id,
      details: [
        { label: 'Quantity', value: row.slitted_qty },
        { label: 'Size', value: row.slitted_size || '—' },
        { label: 'Possible Production', value: calculateProductionDetails(row.slitted_size, row.slitted_qty) },
      ],
    },
    {
      label: 'Ready Channel',
      chipColor: 'success',
      qty: row.ready_pieces,
      state: row.ready_state,
      itemId: null,
      details: [
        { label: 'Total Pieces', value: row.ready_pieces },
      ],
    },
  ];

  return (
    <>
      {/* ── Main Row ── */}
      <TableRow
        hover
        sx={{
          cursor: 'pointer',
          '& > td': { borderBottom: open ? 'none' : undefined },
        }}
        onClick={() => setOpen(!open)}
      >
        {/* Expand arrow */}
        <TableCell sx={{ width: 48, px: 1 }}>
          <IconButton size="small">
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        {/* Supplier */}
        <TableCell>
          <Typography variant="h6" fontWeight={600}>{row.supplier}</Typography>
        </TableCell>

        {/* Color Name */}
        <TableCell>
          <Typography variant="h6" fontWeight={600}>{row.color_name}</Typography>
        </TableCell>

        {/* Color Code */}
        <TableCell>
          <Typography variant="h6" fontWeight={400}>{row.color_code}</Typography>
        </TableCell>

        {/* Quick summary chips */}
        <TableCell>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {stages.map((s) => {
              const status = getStatusInfo(s.state, s.qty);
              let displayValue = s.qty;
              
              // Show total feet for Full Roll and Slitted
              if (s.label === 'Full Roll' && row.fullRoll_size && row.fullRoll_qty) {
                const totalFeet = (parseFloat(row.fullRoll_size) * parseFloat(row.fullRoll_qty)).toFixed(1);
                displayValue = `${totalFeet} ft`;
              } else if (s.label === 'Slitted' && row.slitted_size && row.slitted_qty) {
                const totalFeet = (parseFloat(row.slitted_size) * parseFloat(row.slitted_qty)).toFixed(1);
                displayValue = `${totalFeet} ft`;
              }
              
              return (
                <Chip
                  key={s.label}
                  label={`${s.label}: ${displayValue}`}
                  color={status.color}
                  variant={s.qty > 0 ? 'filled' : 'outlined'}
                  size="small"
                  sx={{ borderRadius: '8px', fontWeight: 500 }}
                />
              );
            })}
          </Stack>
        </TableCell>

      </TableRow>

      {/* ── Expanded Detail Row ── */}
      <TableRow>
        <TableCell colSpan={5} sx={{ py: 0, px: 0, borderBottom: open ? undefined : 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2.5, backgroundColor: palette.action.hover, borderRadius: 0 }}>
              <Grid container spacing={2}>
                {stages.map((stage) => {
                  const status = getStatusInfo(stage.state, stage.qty);
                  return (
                    <Grid item xs={12} md={4} key={stage.label}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: 'divider',
                          backgroundColor: palette.background.paper,
                          height: '100%',
                        }}
                      >
                        {/* Stage header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={stage.label}
                              color={stage.chipColor}
                              size="small"
                              sx={{ borderRadius: '6px', fontWeight: 600 }}
                            />
                            <Chip
                              label={status.label}
                              color={status.color}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: '6px', fontWeight: 500, fontSize: '0.7rem', height: 22 }}
                            />
                          </Stack>
                          {/* Edit / Delete buttons per stage */}
                          {stage.itemId && (
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                size="small"
                                sx={{ color: palette.info.main }}
                                onClick={(e) => { e.stopPropagation(); onEdit(stage.itemId); }}
                                title={`Edit ${stage.label}`}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ color: palette.error.main }}
                                onClick={(e) => { e.stopPropagation(); onDelete(stage.itemId, stage.label); }}
                                title={`Delete ${stage.label}`}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Stack>
                          )}
                        </Stack>

                        {/* Detail fields */}
                        {stage.details.map((d) => (
                          <Stack
                            key={d.label}
                            direction="row"
                            justifyContent="space-between"
                            sx={{
                              py: 0.75,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                              '&:last-child': { borderBottom: 'none' },
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {d.label}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {d.value}
                            </Typography>
                          </Stack>
                        ))}

                        {stage.label === 'Ready Channel' && (
                          <Box sx={{ mt: 1.5 }}>
                            {(row.ready_variants || []).length === 0 ? (
                              <Typography variant="body2" color="text.secondary">
                                No ready-channel variants found.
                              </Typography>
                            ) : (
                              (row.ready_variants || []).map((variant) => (
                                <Stack
                                  key={variant.id}
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  sx={{
                                    py: 0.75,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': { borderBottom: 'none' },
                                  }}
                                >
                                  <Typography variant="body2" color="text.secondary">
                                    {`${variant.length ?? '—'} ft | ${variant.pieces} pcs | Hole ${variant.hole_distance}`}
                                  </Typography>
                                  <Stack direction="row" spacing={0.5}>
                                    <IconButton
                                      size="small"
                                      sx={{ color: palette.info.main }}
                                      onClick={(e) => { e.stopPropagation(); onEdit(variant.id); }}
                                      title={`Edit Ready Channel ${variant.length ?? ''}ft`}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      sx={{ color: palette.error.main }}
                                      onClick={(e) => { e.stopPropagation(); onDelete(variant.id, `Ready Channel ${variant.length ?? ''}ft`); }}
                                      title={`Delete Ready Channel ${variant.length ?? ''}ft`}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Stack>
                                </Stack>
                              ))
                            )}
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapsibleRow;
