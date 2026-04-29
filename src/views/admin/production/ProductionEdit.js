import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import ProductionForm from './ProductionForm';
import productionService from '../../../services/productionService';
import { mapToChannelLengthLabel, getPieceLength } from '../../../utils/helpers';

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
        const res = await productionService.getProductionById(id);
        const p = res.data;

        // Map channel_length number to label string for the dropdown
        const channelLengthLabel = mapToChannelLengthLabel(p.channel_length);

        setProduction({
          id: p.id,
          productionType: p.production_type || 'General Inventory',
          orderNumber: p.order_id || '',
          rawMaterial: p.raw_material_id || '',
          targetState: p.target_state || 'Ready Channel',
          qty: p.qty || '',
          size: p.size || '',
          channelLength: channelLengthLabel ? String(channelLengthLabel) : '',
          wasteQty: p.waste_qty || 0,
          assignee: p.assignee || '',
          notes: p.notes || '',
          status: p.status || 'Pending',
        });
      } catch (err) {
        toast.error(err.message || 'Failed to fetch production record.');
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
      // channel_length stores feet
      let channelLengthNum = null;
      if (data.targetState === 'Ready Channel' && data.channelLength) {
        channelLengthNum = getPieceLength(data.channelLength);
      }

      await productionService.updateProduction(id, {
        production_type: data.productionType,
        order_id: data.productionType === 'Specific Order' ? data.orderNumber : null,
        raw_material_id: data.rawMaterial,
        target_state: data.targetState,
        qty: data.qty,
        size: data.size,
        channel_length: channelLengthNum,
        waste_qty: data.wasteQty || 0,
        assignee: data.assignee || '',
        notes: data.notes || '',
      });
      toast.success('Production record updated successfully!');
      navigate('/admin/production');
    } catch (err) {
      toast.error(err.message || 'Failed to update production record.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/admin/production');

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
          <Typography variant="h4" fontWeight={700}>Edit Production</Typography>
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
