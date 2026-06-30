import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, TextField, MenuItem,
  Stack, Chip, CircularProgress, IconButton,
} from '@mui/material';
import { LocalShipping, Store, LocationOn, Close, Inventory, InfoOutlined } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { LOCATION_OPTIONS, formatDate } from 'src/utils/helpers';

import orderService from 'src/services/orderService';
import adminUserService from 'src/services/adminUserService';

const DispatchDialog = ({ open, order, onClose, onConfirm, loading }) => {
  const { palette } = useTheme();
  const [destination, setDestination] = useState('');
  const [inventoryLocations, setInventoryLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [techUsers, setTechUsers] = useState([]);
  const [assignedTech, setAssignedTech] = useState(null);
  const [techLoading, setTechLoading] = useState(false);

  // Array of { location, pieces, available }
  const [sourceRows, setSourceRows] = useState([]);

  const isPickup = order?.delivery_method === 'pickup';

  // Pre-fill destination from order's existing location
  useEffect(() => {
    if (order) {
      if (isPickup) {
        setDestination(order.pickup_location || '');
      } else {
        setDestination(order.delivery_address || '');
      }
    }
  }, [order, isPickup]);

  // Fetch inventory locations when dialog opens
  useEffect(() => {
    if (open && order?.id) {
      setLocationsLoading(true);
      setSourceRows([]);
      setInventoryLocations([]);
      setAssignedTech(null);
      orderService.getInventoryLocations(order.id)
        .then((res) => {
          const locs = res.data || [];
          setInventoryLocations(locs);
          const initialRows = locs
            .filter((l) => l.pieces > 0)
            .map((l) => ({ location: l.location, pieces: '', available: l.pieces }));
          setSourceRows(initialRows);
        })
        .catch(() => setInventoryLocations([]))
        .finally(() => setLocationsLoading(false));
    }
  }, [open, order?.id]);

  // Fetch production tech users when dialog opens
  useEffect(() => {
    if (open) {
      setTechLoading(true);
      adminUserService.getProductionTechUsers()
        .then((res) => setTechUsers(res.data || []))
        .catch(() => setTechUsers([]))
        .finally(() => setTechLoading(false));
    }
  }, [open]);

  const handleRowChange = (index, value) => {
    const newRows = [...sourceRows];
    // Allow empty string
    newRows[index].pieces = value === '' ? '' : parseInt(value) || 0;
    setSourceRows(newRows);
  };

  const handleConfirm = () => {
    if (!destination.trim()) return;

    // Filter out rows with 0 pieces and format for backend
    const activeSources = sourceRows
      .filter(r => r.pieces !== '' && parseInt(r.pieces) > 0)
      .map(r => ({ location: r.location, pieces: parseInt(r.pieces) }));

    onConfirm(order, destination.trim(), activeSources, assignedTech?.id || null);
  };

  // ── Stock calculations ──
  const orderQty = parseInt(order?.total_pieces) || 0;

  const firstLoc = inventoryLocations[0];
  const totalPieces = firstLoc ? parseInt(firstLoc.total_pieces) || 0 : 0;
  const totalHeld = firstLoc ? parseInt(firstLoc.held_pieces) || 0 : 0;
  const systemAvailable = Math.max(0, totalPieces - totalHeld);

  // ── Destination stock calculations ──
  const destStock = inventoryLocations.find((l) => l.location === destination);
  const destPhysicalPieces = destStock ? parseInt(destStock.pieces) || 0 : 0;
  const destHeldByOthers = destStock ? parseInt(destStock.held_pieces) || 0 : 0;
  const destAvailable = Math.max(0, destPhysicalPieces - destHeldByOthers);

  const noTransferNeeded = isPickup && destination && destAvailable >= orderQty;
  const needToTransfer = isPickup ? Math.max(0, orderQty - destAvailable) : orderQty;

  const totalAllocated = sourceRows.reduce((sum, r) => sum + (parseInt(r.pieces) || 0), 0);
  const targetAllocation = noTransferNeeded ? 0 : needToTransfer;
  const overAllocatedBy = Math.max(0, totalAllocated - targetAllocation);

  const isExactAllocation = totalAllocated === targetAllocation;
  const isOverAllocation = totalAllocated > targetAllocation;
  const hasRowError = sourceRows.some(r => (parseInt(r.pieces) || 0) > r.available);

  const systemInsufficient = orderQty > 0 && systemAvailable < orderQty;
  const insufficientStock = systemInsufficient;

  // Tech assignment requirement
  // Pickup: show tech dropdown when transfer IS needed (not when destination already has stock)
  // Delivery: always show tech dropdown
  const showTechDropdown = !isPickup || !noTransferNeeded;
  const techAssigned = !showTechDropdown || !!assignedTech;

  const canDispatch = !loading && !!destination.trim() && !insufficientStock && !hasRowError && (noTransferNeeded || isExactAllocation) && techAssigned;

  const showBreakdown = isPickup && destination && orderQty > 0 && !locationsLoading;

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {isPickup
            ? <Store sx={{ color: palette.info.main, fontSize: 28 }} />
            : <LocalShipping sx={{ color: palette.success.main, fontSize: 28 }} />
          }
          <Typography variant="h5" fontWeight={700}>
            {isPickup ? 'Transfer to Pickup Location' : 'Dispatch for Delivery'}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Order summary */}
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: '10px', mb: 2.5 }}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Order: <strong>{order.order_id}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer: <strong>{order.contact_name}</strong> ({order.company_name || '—'})
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Typography variant="body2" color="text.secondary">
                Color: <strong>{order.color || '—'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pieces: <strong>{order.total_pieces ?? '—'}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Final: <strong>{order.final_length ? `${order.final_length}` : '—'}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
              <Chip
                label={order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'}
                color={order.delivery_method === 'pickup' ? 'info' : 'success'}
                size="small"
                icon={order.delivery_method === 'pickup' ? <Store /> : <LocalShipping />}
                sx={{ fontWeight: 600 }}
              />
              {order.pickup_date && (
                <Typography variant="caption" color="text.secondary">
                  {order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'} Date: <strong>{formatDate(order.pickup_date)}</strong>
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Destination (editable) */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
            <LocationOn sx={{ fontSize: 18, color: isPickup ? palette.info.main : palette.success.main }} />
            <Typography variant="subtitle2" fontWeight={600}>
              {isPickup ? 'Transfer To *' : 'Deliver To *'}
            </Typography>
          </Stack>

          {isPickup ? (
            // Pickup: dropdown of predefined locations
            <TextField
              select
              fullWidth
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              size="small"
              placeholder="Select pickup location"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              {LOCATION_OPTIONS.filter(opt => opt.value !== 'Warehouse').map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          ) : (
            // Delivery: editable text field
            <TextField
              fullWidth
              multiline
              rows={2}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              size="small"
              placeholder="Enter delivery address"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          )}
        </Box>

        {/* Pick From Locations (multi-source panel) */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
            <Inventory sx={{ fontSize: 18, color: palette.primary.main }} />
            <Typography variant="subtitle2" fontWeight={600}>Pick From Locations *</Typography>
          </Stack>

          {locationsLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">Loading locations...</Typography>
            </Box>
          ) : inventoryLocations.length > 0 ? (
            <Box sx={{
              border: '1px solid', borderColor: 'divider', borderRadius: '8px', overflow: 'hidden'
            }}>
              {/* Header row */}
              <Box sx={{ display: 'flex', bgcolor: 'grey.50', p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" fontWeight={600} sx={{ flex: 2 }}>Location</Typography>
                <Typography variant="caption" fontWeight={600} sx={{ flex: 1.5 }}>Available</Typography>
                <Typography variant="caption" fontWeight={600} sx={{ flex: 1.5 }}>Pieces to Use</Typography>
              </Box>

              {/* No Transfer Needed state */}
              {noTransferNeeded ? (
                <Box sx={{ p: 2, textAlign: 'center', bgcolor: alpha(palette.info.main, 0.04) }}>
                  <Typography variant="body2" color="info.main" fontWeight={600}>
                    ✓ Destination ({destination}) already has enough stock.
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    No inventory transfer is required from other locations.
                  </Typography>
                </Box>
              ) : (
                /* Source rows */
                sourceRows.map((row, index) => {
                  const rowError = (parseInt(row.pieces) || 0) > row.available;
                  // If pickup and this row's location IS the destination, we disable it and explain
                  const isDestLoc = isPickup && row.location === destination;
                  // How many pieces from the destination are already being used (available there)
                  const destUsedPieces = isDestLoc ? Math.min(destAvailable, orderQty) : 0;

                  return (
                    <Box key={row.location} sx={{
                      display: 'flex', alignItems: 'center', p: 1.5,
                      borderBottom: index < sourceRows.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      bgcolor: isDestLoc ? 'grey.50' : 'transparent',
                    }}>
                      <Typography variant="body2" fontWeight={500} sx={{ flex: 2, color: isDestLoc ? 'text.secondary' : 'text.primary' }}>
                        {row.location} {isDestLoc && <Typography component="span" variant="caption" color="info.main" ml={0.5}>(Dest)</Typography>}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1.5, color: 'text.secondary' }}>
                        {row.available} pcs
                      </Typography>
                      <Box sx={{ flex: 1.5 }}>
                        {isDestLoc ? (
                          // Destination row: show how many pieces are already available there (read-only)
                          <Box sx={{
                            width: '80px',
                            py: 0.5, px: 1,
                            textAlign: 'center',
                            borderRadius: '6px',
                            border: '1px solid',
                            borderColor: destUsedPieces > 0 ? 'info.light' : 'divider',
                            bgcolor: destUsedPieces > 0 ? 'info.lighter' : 'grey.100',
                          }}>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color={destUsedPieces > 0 ? 'info.main' : 'text.disabled'}
                            >
                              {destUsedPieces}
                            </Typography>
                          </Box>
                        ) : (
                          <TextField
                            size="small"
                            type="number"
                            placeholder="0"
                            value={row.pieces}
                            onChange={(e) => handleRowChange(index, e.target.value)}
                            disabled={noTransferNeeded}
                            error={rowError}
                            inputProps={{ min: 0, max: row.available }}
                            sx={{
                              width: '80px',
                              '& .MuiOutlinedInput-root': { borderRadius: '6px' },
                              '& input': { py: 0.5, px: 1, textAlign: 'center' }
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })
              )}

              {/* Footer status */}
              {!noTransferNeeded && (
                <Box sx={{
                  p: 1.5,
                  bgcolor: isExactAllocation ? alpha(palette.success.main, 0.08) : (isOverAllocation || hasRowError ? alpha(palette.error.main, 0.08) : alpha(palette.warning.main, 0.08)),
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <Typography variant="body2" fontWeight={600}
                    color={isExactAllocation ? 'success.dark' : (isOverAllocation || hasRowError ? 'error.main' : 'warning.dark')}
                  >
                    Total allocated: {totalAllocated} / {targetAllocation} pcs
                  </Typography>
                  <Typography variant="caption" fontWeight={600}
                    color={isExactAllocation ? 'success.main' : (isOverAllocation || hasRowError ? 'error.main' : 'warning.main')}
                  >
                    {isExactAllocation ? '✅ Ready' : isOverAllocation ? `✕ Over by ${overAllocatedBy} pcs` : '⚠ Need more pcs'}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              No inventory locations found for this order.
            </Typography>
          )}
        </Box>

        {/* ── Stock Availability Breakdown (only for pickup when destination selected) ── */}
        {showBreakdown && (
          <Box sx={{
            p: 2, mb: 2, borderRadius: '10px',
            bgcolor: insufficientStock
              ? alpha(palette.error.main, 0.04)
              : noTransferNeeded
                ? alpha(palette.info.main, 0.04)
                : alpha(palette.success.main, 0.04),
            border: '1px solid',
            borderColor: insufficientStock
              ? alpha(palette.error.main, 0.2)
              : noTransferNeeded
                ? alpha(palette.info.main, 0.2)
                : alpha(palette.success.main, 0.2),
          }}>
            <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
              <InfoOutlined sx={{
                fontSize: 18,
                color: insufficientStock ? palette.error.main : noTransferNeeded ? palette.info.main : palette.success.main,
              }} />
              <Typography variant="subtitle2" fontWeight={700}
                color={insufficientStock ? 'error.main' : noTransferNeeded ? 'info.main' : 'success.main'}
              >
                Stock Availability for This Order
              </Typography>
            </Stack>

            {/* Stock details grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {/* Row 1: Order Needs | At Destination (physical) */}
              <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary.main">{orderQty}</Typography>
                <Typography variant="caption" color="text.secondary">Order Needs</Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="text.secondary">{destPhysicalPieces}</Typography>
                <Typography variant="caption" color="text.secondary">Stock at Destination</Typography>
              </Box>

              {/* Row 2: Held by Others (at dest) | Available at Destination */}
              <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700}
                  color={destHeldByOthers > 0 ? 'warning.main' : 'text.secondary'}
                >{destHeldByOthers}</Typography>
                <Typography variant="caption" color="text.secondary">Reserved by Others</Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700}
                  color={destAvailable >= orderQty ? 'success.main' : destAvailable > 0 ? 'info.main' : 'text.secondary'}
                >{destAvailable}</Typography>
                <Typography variant="caption" color="text.secondary">Available at Destination</Typography>
              </Box>

              {/* Row 3: Will Transfer */}
              {!noTransferNeeded && (
                <Box sx={{
                  p: 1.5, borderRadius: '8px', textAlign: 'center', gridColumn: '1 / -1',
                  bgcolor: needToTransfer > 0 ? alpha(palette.info.main, 0.08) : 'background.paper',
                  border: needToTransfer > 0 ? `1px solid ${alpha(palette.info.main, 0.2)}` : 'none',
                }}>
                  <Typography variant="h5" fontWeight={700}
                    color={needToTransfer > 0 ? 'info.main' : 'success.main'}
                  >{needToTransfer}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Will Transfer
                  </Typography>
                </Box>
              )}
              {noTransferNeeded && (
                <Box sx={{
                  p: 1.5, borderRadius: '8px', textAlign: 'center', gridColumn: '1 / -1',
                  bgcolor: alpha(palette.success.main, 0.08),
                  border: '1px solid',
                  borderColor: alpha(palette.success.main, 0.2),
                }}>
                  <Typography variant="h5" fontWeight={700}
                    color="success.main"
                  >{destAvailable} / {orderQty}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Available / Needed (no transfer)
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Status message */}
            {insufficientStock && (
              <Box sx={{ mt: 1.5, p: 1, bgcolor: alpha(palette.error.main, 0.08), borderRadius: '6px' }}>
                <Typography variant="caption" color="error.main" fontWeight={600}>
                  ⚠ Insufficient available stock! Only {systemAvailable} pcs available system-wide ({totalHeld} pcs held by other orders).
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Assign Transfer To — Production Tech */}
        {showTechDropdown && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
              <Inventory sx={{ fontSize: 18, color: palette.warning.main }} />
              <Typography variant="subtitle2" fontWeight={600}>Assign Transfer To *</Typography>
            </Stack>
            <TextField
              select
              fullWidth
              value={assignedTech?.id || ''}
              onChange={(e) => {
                const tech = techUsers.find(t => t.id === e.target.value);
                setAssignedTech(tech || null);
              }}
              size="small"
              disabled={techLoading}
              error={!techAssigned}
              helperText={!techAssigned ? 'Please assign a production tech for this transfer' : ''}
              SelectProps={{ displayEmpty: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: '#aaa' }}>— Select a production tech —</em>
              </MenuItem>
              {techLoading ? (
                <MenuItem disabled value="loading"><em>Loading techs...</em></MenuItem>
              ) : techUsers.length === 0 ? (
                <MenuItem disabled value="empty"><em>No production techs available</em></MenuItem>
              ) : (
                techUsers.map((tech) => (
                  <MenuItem key={tech.id} value={tech.id}>
                    {tech.username}
                    {tech.email && (
                      <Typography component="span" variant="caption" color="text.secondary" ml={1}>
                        ({tech.email})
                      </Typography>
                    )}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Box>
        )}

        {/* Warning */}
        <Box sx={{
          p: 1.5, bgcolor: 'warning.lighter', borderRadius: '8px',
          border: '1px solid', borderColor: 'warning.light',
        }}>
          <Typography variant="caption" color="warning.dark" fontWeight={500}>
            {isPickup && noTransferNeeded
              ? '⚠ No inventory transfer needed — destination already has enough stock. Final deduction happens when order is completed.'
              : isPickup && needToTransfer > 0
                ? `⚠ ${totalAllocated} pcs will be transferred from selected sources to ${destination || 'destination'}. Final deduction happens when order is completed.`
                : '⚠ Selected sources will be recorded for delivery. Final deduction happens when the order is completed.'}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={isPickup ? 'info' : 'success'}
          disabled={!canDispatch}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : (isPickup ? <Store /> : <LocalShipping />)}
          sx={{ borderRadius: '8px', minWidth: 180 }}
        >
          {loading
            ? 'Dispatching...'
            : isPickup
              ? (noTransferNeeded ? 'Dispatch (No Transfer)' : `Transfer ${totalAllocated} pcs & Dispatch`)
              : 'Ship & Dispatch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DispatchDialog;
