import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import InventoryForm from './InventoryForm';

const InventoryEdit = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  const location = useLocation();

  // Grab the data passed from the navigation state
  const editData = location.state?.editData || null;

  const handleUpdate = (data) => {
    console.log('Updated inventory item:', data);
    navigate('/admin/inventory');
  };

  const handleCancel = () => {
    navigate('/admin/inventory');
  };

  return (
    <PageContainer title="Edit Inventory" description="Edit an existing inventory item">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/inventory')}
            sx={{ mr: 2, borderRadius: '8px' }}
          >
            Back to Inventory
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Edit Inventory
          </Typography>
        </Box>

        {/* Reusable Form conditionally rendering if we have edit data */}
        {editData ? (
          <InventoryForm 
            initialValues={editData}
            onSubmit={handleUpdate} 
            onCancel={handleCancel} 
            isEditing={true} 
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
