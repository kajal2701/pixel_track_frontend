import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import ProductionForm from './ProductionForm';

const ProductionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [production, setProduction] = useState(null);

  useEffect(() => {
    const fetchProduction = async () => {
      setFetchLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await productionService.getProductionById(id);
        // setProduction(response.data);
        
        // Mock data for now
        setFetchLoading(false);
      } catch (err) {
        if (err.message?.includes('not found')) {
          toast.error('Production record not found');
        } else {
          toast.error(err.message || 'Failed to fetch production record');
        }
        navigate('/admin/production');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduction();
  }, [id, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Update Production record:', data);
      toast.success('Production record updated successfully!');
      navigate('/admin/production');
    } catch (err) {
      toast.error(err.message || 'Failed to update production record.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/production');
  };

  if (fetchLoading) {
    return (
      <PageContainer title="Edit Production" description="Update production information">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Production" description="Update production information">
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
            Edit Production
          </Typography>
        </Box>

        <ProductionForm
          production={production}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={true}
          onCancel={handleCancel}
        />
      </Box>
    </PageContainer>
  );
};

export default ProductionEdit;
