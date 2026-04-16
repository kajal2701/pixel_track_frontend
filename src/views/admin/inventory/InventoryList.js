import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  CircularProgress, Grid, Card,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TablePagination, TableFooter,

} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import inventoryService from 'src/services/inventoryService';
import DeleteInventoryDialog from './DeleteInventoryDialog';
import { SUMMARY_CARDS, groupBySupplierColor } from './helperFunction';
import PaginationActions from './PaginationActions';
import CollapsibleRow from './CollapsibleRow';

// ═══════════════════════════════════════════════════════════════════
// InventoryList — Accordion table grouped by Supplier + Color
// ═══════════════════════════════════════════════════════════════════
const InventoryList = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  const [allInventory, setAllInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });

  // ── Fetch inventory on mount ──
  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await inventoryService.getAllInventory();
      setAllInventory(response.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  };

  // ── Group data ──
  const grouped = useMemo(() => groupBySupplierColor(allInventory), [allInventory]);

  // ── Local search filter ──
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return grouped;
    return grouped.filter((row) =>
      [
        row.supplier,
        row.color_name,
        row.color_code,
        row.channel_length,
        row.hole_distance,
        String(row.fullRoll_qty),
        String(row.slitted_qty),
        String(row.ready_pieces),
        String(row.possible_feet),
      ].some((f) => f?.toLowerCase().includes(q)),
    );
  }, [grouped, searchTerm]);

  // ── Summary counts ──
  const counts = useMemo(() => ({
    total: filtered.length,
    fullRolls: filtered.reduce((s, r) => s + (r.fullRoll_qty || 0), 0),
    slitted: filtered.reduce((s, r) => s + (r.slitted_qty || 0), 0),
    readyPieces: filtered.reduce((s, r) => s + (r.ready_pieces || 0), 0),
  }), [filtered]);

  // ── Paginated rows ──
  const visibleRows = rowsPerPage > 0
    ? filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filtered;

  // ── Edit handler — navigate to edit page ──
  const handleEdit = (itemId) => {
    navigate(`/admin/inventory/edit/${itemId}`);
  };

  // ── Delete handlers ──
  const handleDeleteClick = (itemId, stageLabel) => {
    // Find the raw item from allInventory to pass to the dialog
    const item = allInventory.find((i) => i.id === itemId);
    if (item) {
      setDeleteDialog({ open: true, item: { ...item, _stageLabel: stageLabel } });
    }
  };

  const handleDeleteConfirm = async (item) => {
    setActionLoading(true);
    try {
      await inventoryService.deleteInventory(item.id);
      toast.success(`${item._stageLabel || 'Item'} (${item.color_code}) deleted successfully.`);
      await fetchInventory();
      setDeleteDialog({ open: false, item: null });
    } catch (err) {
      toast.error(err.message || 'Failed to delete inventory item.');
    } finally {
      setActionLoading(false);
    }
  };

  const closeDeleteDialog = () => setDeleteDialog({ open: false, item: null });

  return (
    <PageContainer title="Inventory Management" description="Manage product inventory">
      <Box>
        {/* ── Header ── */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Inventory
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/inventory/new')}
            sx={{ borderRadius: '8px' }}
          >
            Add Item
          </Button>
        </Box>

        {/* ── Search Bar ── */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by supplier, color name, color code..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: palette.background.paper,
              },
            }}
          />
        </Box>

        {/* ── Summary Cards ── */}
        <Grid container spacing={3} mb={3}>
          {SUMMARY_CARDS(counts).map((s) => (
            <Grid item xs={12} sm={6} md={3} key={s.title}>
              <Card
                elevation={0}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', overflow: 'hidden' }}
              >
                <Box sx={{ height: '4px', backgroundColor: s.accent }} />
                <Box sx={{ p: '18px 20px 16px' }}>
                  <Typography variant="h3" fontWeight={700} sx={{ lineHeight: 1, mb: '4px' }}>
                    {loading ? <CircularProgress size={20} /> : s.count}
                  </Typography>
                  <Typography variant="body1" fontWeight={500} sx={{ mb: '4px' }}>
                    {s.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.dot, flexShrink: 0 }} />
                    <Typography variant="caption" color="text.secondary">{s.sub}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ── Accordion Table ── */}
        <ParentCard title="All Inventory — Grouped by Supplier + Color Code">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <Box sx={{ mx: -3, mb: -3 }}>
              <TableContainer>
                <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 48, px: 1 }} />
                      <TableCell sx={{ width: '15%' }}><Typography variant="h6">Supplier</Typography></TableCell>
                      <TableCell sx={{ width: '15%' }}><Typography variant="h6">Color Name</Typography></TableCell>
                      <TableCell sx={{ width: '12%' }}><Typography variant="h6">Color Code</Typography></TableCell>
                      <TableCell><Typography variant="h6">Stock Summary</Typography></TableCell>
                                          </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <Typography color="text.secondary">No inventory items found.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      visibleRows.map((row, idx) => (
                        <CollapsibleRow
                          key={row.ids?.[0] ?? idx}
                          row={row}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
                        />
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={5}
                        count={filtered.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{ native: true }}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                          setRowsPerPage(parseInt(e.target.value, 10));
                          setPage(0);
                        }}
                        ActionsComponent={PaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          )}
        </ParentCard>

        {/* ── Delete Dialog ── */}
        <DeleteInventoryDialog
          open={deleteDialog.open}
          onClose={closeDeleteDialog}
          onConfirm={handleDeleteConfirm}
          item={deleteDialog.item}
          loading={actionLoading}
        />
      </Box>
    </PageContainer>
  );
};

export default InventoryList;
