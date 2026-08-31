import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, CircularProgress, Box, IconButton,
  Stack, Divider, Alert, TextField, Select, MenuItem, FormControl
} from '@mui/material';
import {
  Check, Delete, CheckCircle, Close, Inventory2, Edit,
} from '@mui/icons-material';
import orderService from 'src/services/orderService';
import OrderDetailsCard from './OrderDetailsCard';
import InventoryBreakdown from './InventoryBreakdown';
import { formatDateToYYYYMMDD } from 'src/utils/helpers';
import toast from 'react-hot-toast';

// Config per dialog type
const DIALOG_CONFIG = {
  CONFIRM: {
    title: 'Confirm Order',
    icon: <Check sx={{ color: 'success.main', fontSize: 40 }} />,
    message: (order) => `Are you sure you want to confirm order ${order?.order_id}?`,
    sub: 'Customer will be notified.',
    confirmLabel: 'Confirm Order',
    confirmColor: 'success',
  },
  CANCEL: {
    title: 'Cancel Order',
    icon: <Close sx={{ color: 'error.main', fontSize: 40 }} />,
    message: (order) => `Are you sure you want to cancel order ${order?.order_id}?`,
    sub: 'This action will notify the customer.',
    confirmLabel: 'Cancel Order',
    confirmColor: 'error',
  },
  READY: {
    title: 'Mark as Ready',
    icon: <CheckCircle sx={{ color: 'info.main', fontSize: 40 }} />,
    message: (order) => `Mark order ${order?.order_id} as Ready?`,
    sub: 'Product will be stored in warehouse. Inventory holds remain active.',
    confirmLabel: 'Mark Ready',
    confirmColor: 'info',
  },
  DELETE: {
    title: 'Delete Order',
    icon: <Delete sx={{ color: 'error.main', fontSize: 40 }} />,
    message: (order) => `Permanently delete order ${order?.order_id}?`,
    sub: 'This cannot be undone.',
    confirmLabel: 'Delete',
    confirmColor: 'error',
  },
  COMPLETE: {
    title: 'Complete Order',
    icon: <CheckCircle sx={{ color: 'success.main', fontSize: 40 }} />,
    message: (order) => `Mark order ${order?.order_id} as completed?`,
    sub: 'This confirms the customer has received the order. Inventory will be permanently deducted.',
    confirmLabel: 'Complete Order',
    confirmColor: 'success',
  },
};

// ═══════════════════════════════════════════════════════════════════
// StatusDialog
// ═══════════════════════════════════════════════════════════════════
const StatusDialog = ({ open, type, order, onClose, onConfirm, onOverrideModification, loading }) => {
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [productUpdated, setProductUpdated] = useState(false);
  const config = DIALOG_CONFIG[type];

  const [inventoryResult, setInventoryResult] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [selectedColorLabel, setSelectedColorLabel] = useState('');
  const [modificationNotes, setModificationNotes] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [modStatus, setModStatus] = useState(null);

  // Fetch inventory and run check when CONFIRM dialog opens
  useEffect(() => {
    if (open && type === 'CONFIRM' && order) {
      const fetchAndCheck = async () => {
        setInventoryLoading(true);
        try {
          const res = await orderService.checkInventory(order.id);
          setInventoryResult(res || {});
          setSelectedColorLabel(order.color);
          setProductUpdated(false);
        } catch (err) {
          setInventoryResult({ error: err.message || 'Failed to check inventory availability.' });
        } finally {
          setInventoryLoading(false);
        }
      };
      fetchAndCheck();
      let modNote = order.modification_notes || '';
      let pLocation = order.pickup_location || '';
      let pDate = order.pickup_date ? formatDateToYYYYMMDD(order.pickup_date) : '';
      let mStatus = null;

      try {
        if (order.modification_notes) {
          const parsed = JSON.parse(order.modification_notes);
          if (parsed && parsed.status) {
            modNote = parsed.note || '';
            if (parsed.pickup_location) pLocation = parsed.pickup_location;
            if (parsed.pickup_date) pDate = formatDateToYYYYMMDD(parsed.pickup_date);
            mStatus = parsed.status; // pending, approved, or cancelled
          }
        }
      } catch (e) {
        // Not JSON, ignore
      }

      setModificationNotes(modNote);
      setPickupLocation(pLocation);
      setPickupDate(pDate);
      setModStatus(mStatus);
    } else {
      setInventoryResult(null);
      setModificationNotes('');
      setPickupLocation('');
      setPickupDate('');
      setModStatus(null);
    }
  }, [open, type, order]);

  if (!config) return null;

  const isConfirm = type === 'CONFIRM';
  const allResults = inventoryResult
    ? [inventoryResult.data, ...(inventoryResult.linkedResults || [])].filter(Boolean)
    : [];
  const activeResult = allResults.find(r =>
    (r.originalColor === selectedColorLabel) || (r.color_label === selectedColorLabel)
  ) || inventoryResult?.data;

  const hasShortage = isConfirm && activeResult && !activeResult.error && Number(activeResult.shortage || 0) > 0;
  const needsProduction = isConfirm && activeResult && !activeResult.error &&
    (Number(activeResult.slittedUsed || 0) > 0 || (Number(activeResult.fullRollUsed || 0) > 0 && !activeResult.skipStep1Production));

  const isColorChanged = isConfirm && selectedColorLabel !== order?.color;
  const hasGroupColors = allResults.length > 1;
  const needsProductUpdate = hasGroupColors && !productUpdated;

  const handleUpdateProduct = async () => {
    setUpdatingProduct(true);
    try {
      const updatedOrder = await orderService.updateOrderDetails(order.id, { color: selectedColorLabel });
      toast.success('Product color updated successfully!');
      setProductUpdated(true);
    } catch (err) {
      toast.error(err.message || 'Failed to update product color.');
      console.error('Failed to update product color:', err);
    } finally {
      setUpdatingProduct(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={isConfirm ? 'sm' : 'xs'} fullWidth>
      <DialogTitle sx={{
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {config.title}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1, gap: 1.5 }}>
          {config.icon}
          <Typography variant="body1" textAlign="center" fontWeight={500}>
            {config.message(order)}
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            {config.sub}
          </Typography>
          <OrderDetailsCard order={order} />
        </Box>

        {/* ── Inventory Check Panel (CONFIRM only) ── */}
        {isConfirm && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />

            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Inventory2 sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={700}>
                Inventory Availability Check
              </Typography>
            </Stack>

            {inventoryLoading ? (
              <Box display="flex" flexDirection="column" alignItems="center" py={3} gap={1}>
                <CircularProgress size={28} />
                <Typography variant="caption" color="text.secondary">
                  Checking inventory...
                </Typography>
              </Box>
            ) : activeResult ? (
              <>
                {allResults.length > 1 && (
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 500 }}>
                      Fulfill from Group (Linked Products)
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Select
                        fullWidth
                        value={selectedColorLabel}
                        onChange={(e) => {
                          setSelectedColorLabel(e.target.value);
                          setProductUpdated(false);
                        }}
                        sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' } }}
                      >
                        {allResults.map((res) => {
                          const label = res.color_label || res.originalColor;
                          return (
                            <MenuItem key={label} value={label}>
                              {label} — {res.isFullySatisfied ? '✓ Fully in stock' : `${res.shortage} pcs shortage`}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateProduct}
                        disabled={updatingProduct}
                        sx={{ borderRadius: '8px', whiteSpace: 'nowrap' }}
                      >
                        {updatingProduct ? <CircularProgress size={20} color="inherit" /> : 'Update Product'}
                      </Button>
                    </Stack>
                  </FormControl>
                )}
                {needsProductUpdate && (
                  <Alert severity="warning" sx={{ borderRadius: '8px', mb: 2 }}>
                    Please click <strong>"Update Product"</strong> before proceeding.
                  </Alert>
                )}
                {activeResult.error && !activeResult.orderQty ? (
                  <Alert severity="warning" sx={{ borderRadius: '8px' }}>
                    {activeResult.error}
                  </Alert>
                ) : (
                  <InventoryBreakdown result={activeResult} />
                )}
              </>
            ) : null}
          </Box>
        )}

        {/* ── Modification Request (CONFIRM only) ── */}
        {isConfirm && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <Edit sx={{ color: 'warning.main', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={700}>
                Request Modification
              </Typography>
            </Stack>

            {modStatus === 'pending' && (
              <Alert
                severity="info"
                sx={{ mb: 2, borderRadius: '8px' }}
                action={
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    disabled={loading}
                    onClick={() => onOverrideModification(order)}
                    sx={{ borderRadius: '6px', whiteSpace: 'nowrap', fontSize: '0.75rem' }}
                  >
                    Override Approval
                  </Button>
                }
              >
                A modification request is currently <strong>awaiting customer approval.</strong>
              </Alert>
            )}
            {modStatus === 'approved' && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
                The modification request was <strong>approved</strong> by the customer.
              </Alert>
            )}
            {modStatus === 'cancelled' && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                The modification request was <strong>cancelled</strong> by the customer.
              </Alert>
            )}

            <Stack spacing={2}>
              {order.delivery_method === 'pickup' && (
                <FormControl fullWidth size="small">
                  <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 500 }}>Pickup Location</Typography>
                  <Select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="4783 CAWSEY Terrace SW, Edmonton AB T6W 5M7">
                      4783 CAWSEY Terrace SW, Edmonton AB T6W 5M7
                    </MenuItem>
                    <MenuItem value="2322 chokecherry close sw Edmonton, AB T6X2M7">
                      2322 chokecherry close sw Edmonton, AB T6X2M7
                    </MenuItem>
                  </Select>
                </FormControl>
              )}

              <FormControl fullWidth size="small">
                <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 500 }}>
                  {order.delivery_method === 'pickup' ? 'Pickup Date' : 'Delivery Date'}
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </FormControl>

              <FormControl fullWidth size="small">
                <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 500 }}>Modification Notes</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="e.g., Admin wants to change pickup location..."
                  value={modificationNotes}
                  onChange={(e) => setModificationNotes(e.target.value)}
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </FormControl>
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexWrap: 'wrap' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        {isConfirm && (
          <Button
            onClick={() => onConfirm(type, order, {
              action: 'request-modification',
              payload: {
                modification_notes: modificationNotes.trim(),
                pickup_location: pickupLocation,
                pickup_date: pickupDate,
              }
            })}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ borderRadius: '8px', minWidth: 180 }}
          >
            {loading
              ? <CircularProgress size={18} color="inherit" />
              : 'Request Modification'}
          </Button>
        )}
        {!hasShortage && !needsProduction && (
          <Button
            onClick={() => onConfirm(type, order, {
              inventoryResult: activeResult,
              action: 'confirm',
            })}
            variant="contained"
            color={config.confirmColor}
            disabled={loading || needsProductUpdate}
            sx={{ borderRadius: '8px', minWidth: 110 }}
          >
            {loading
              ? <CircularProgress size={18} color="inherit" />
              : config.confirmLabel}
          </Button>
        )}
        {/* Confirm & Request for Production */}
        {needsProduction && !hasShortage && (
          <Button
            onClick={() => onConfirm(type, order, {
              inventoryResult: activeResult,
              action: 'request-production',
            })}
            variant="contained"
            color="primary"
            disabled={loading || needsProductUpdate}
            sx={{ borderRadius: '8px', minWidth: 200 }}
          >
            {loading
              ? <CircularProgress size={18} color="inherit" />
              : 'Confirm & Request for Production'}
          </Button>
        )}
        {hasShortage && (
          <Button
            onClick={() => onConfirm(type, order, {
              inventoryResult: activeResult,
              action: 'awaiting-material',
            })}
            variant="outlined"
            color="warning"
            disabled={loading || needsProductUpdate}
            sx={{ borderRadius: '8px', minWidth: 150 }}
          >
            {loading
              ? <CircularProgress size={18} color="inherit" />
              : 'Awaiting Inventory'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;