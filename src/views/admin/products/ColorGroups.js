import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Stack, CircularProgress, Card,
  IconButton, Grid, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@mui/material';
import { Add, Edit, Delete, ArrowBack } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import productService from 'src/services/productService';
import ColorGroupDialog from './ColorGroupDialog';

const ColorGroups = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, productsRes] = await Promise.all([
        productService.getLinkGroups(),
        productService.getAllProducts()
      ]);
      setGroups(groupsRes.data || []);
      setAllProducts(productsRes.data || []);
    } catch (err) {
      toast.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setDialogOpen(true);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setGroupToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await productService.deleteLinkGroup(groupToDelete);
      toast.success('Group deleted.');
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete group.');
    }
  };

  const cancelDeleteGroup = () => {
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  };

  const handleDialogClose = (saved) => {
    setDialogOpen(false);
    if (saved) fetchData();
  };

  return (
    <PageContainer description="Manage color groups">
      <Stack direction="row" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate('/admin/products')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" fontWeight={700}>
          Color Groups
        </Typography>
        <Box flex={1} />
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateGroup}>
          Create Group
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {groups.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No color groups found. Create one to link products together.</Typography>
            </Grid>
          ) : (
            groups.map(g => (
              <Grid item xs={12} md={6} lg={4} key={g.id}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      🎨 {g.group_name || 'Unnamed Group'}
                    </Typography>
                    <Stack direction="row" gap={1}>
                      <IconButton size="small" onClick={() => handleEditGroup(g)} color="info"><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(g.id)} color="error"><Delete fontSize="small" /></IconButton>
                    </Stack>
                  </Stack>

                  <Stack spacing={1}>
                    {g.products.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No products</Typography>
                    ) : (
                      g.products.map(p => (
                        <Box key={p.id} sx={{ p: 1, bgcolor: alpha(palette.primary.main, 0.05), borderRadius: '8px' }}>
                          <Typography variant="body2" fontWeight={500}>
                            {p.color} {p.color_code ? `(${p.color_code})` : ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.manufacturer}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Stack>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {dialogOpen && (
        <ColorGroupDialog
          open={dialogOpen}
          group={selectedGroup}
          allProducts={allProducts}
          onClose={handleDialogClose}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteGroup}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteGroup} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDeleteGroup} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ColorGroups;
