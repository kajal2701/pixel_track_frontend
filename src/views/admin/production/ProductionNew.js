import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import ProductionForm from './ProductionForm';

const ProductionNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Add New Production record:', data);
      toast.success('Production record created successfully!');
      navigate('/admin/production');
    } catch (err) {
      toast.error(err.message || 'Failed to create production record.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/production');
  };

  return (
    <PageContainer title="Add New Production" description="Process inventory for production">
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleCancel}
            sx={{ mr: 2, borderRadius: '8px' }}
            disabled={loading}
          >
            Back to Production
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Add New Production
          </Typography>
        </Box>

        <ProductionForm
          production={null}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={false}
          onCancel={handleCancel}
        />
      </Box>
    </PageContainer>
  );
};

export default ProductionNew;
