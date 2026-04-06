import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../../components/container/PageContainer';
import inventoryService from 'src/services/inventoryService';
import InventoryForm from './InventoryForm';

const InventoryNew = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ── Submit → POST /api/inventory ──
  const handleCreate = async (data) => {
    setLoading(true);
    try {
      await inventoryService.createInventory(data);
      toast.success('Inventory item created successfully!');
      navigate('/admin/inventory');
    } catch (err) {
      toast.error(err.message || 'Failed to create inventory item.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/inventory');
  };

  return (
    <PageContainer title="Add New Inventory" description="Create a new inventory item">
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
            Add New Inventory
          </Typography>
        </Box>

        {/* Reusable Form */}
        <InventoryForm
          onSubmit={handleCreate}
          onCancel={handleCancel}
          isEditing={false}
          loading={loading}
        />
      </Box>
    </PageContainer>
  );
};

export default InventoryNew;
