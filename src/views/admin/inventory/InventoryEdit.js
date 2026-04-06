import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../../components/container/PageContainer';
import inventoryService from 'src/services/inventoryService';
import InventoryForm from './InventoryForm';

const InventoryEdit = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [inventoryItem, setInventoryItem] = useState(null);

  // ── Fetch inventory item data ──
  useEffect(() => {
    fetchInventoryItem();
  }, [id]);

  const fetchInventoryItem = async () => {
    setFetchLoading(true);
    try {
      const response = await inventoryService.getInventoryById(id);
      setInventoryItem(response.data);
    } catch (err) {
      if (err.message?.includes('not found')) {
        toast.error('Inventory item not found');
      } else {
        toast.error(err.message || 'Failed to fetch inventory item');
      }
      navigate('/admin/inventory');
    } finally {
      setFetchLoading(false);
    }
  };

  // ── Submit → PUT /api/inventory/:id ──
  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await inventoryService.updateInventory(id, data);
      toast.success('Inventory item updated successfully!');
      navigate('/admin/inventory');
    } catch (err) {
      toast.error(err.message || 'Failed to update inventory item.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/inventory');
  };

  if (fetchLoading) {
    return (
      <PageContainer title="Edit Inventory" description="Update inventory item">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Inventory" description="Update inventory item">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleCancel}
            disabled={loading}
            sx={{ mr: 2, borderRadius: '8px' }}
          >
            Back to Inventory
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Edit Inventory - {inventoryItem?.color_code}
          </Typography>
        </Box>

        {/* Reusable Form */}
        {inventoryItem ? (
          <InventoryForm
            initialValues={inventoryItem}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            isEditing={true}
            loading={loading}
          />
        ) : (
          <Typography variant="body1" color="error">
            No inventory data found to edit. Please return to the inventory list.
          </Typography>
        )}
      </Box>
    </PageContainer>
  );
};

export default InventoryEdit;
