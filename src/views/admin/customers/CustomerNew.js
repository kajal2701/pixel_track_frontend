import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../../components/container/PageContainer';
import customerService from 'src/services/customerService';
import CustomerForm from './CustomerForm';

const CustomerNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ── Submit → POST /api/customers ──
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await customerService.createCustomer(data);
      toast.success('Customer created successfully!');
      navigate('/admin/customers');
    } catch (err) {
      // Handle specific backend errors
      if (err.message?.includes('already exists')) {
        toast.error('Customer number or email already exists.');
      } else {
        toast.error(err.message || 'Failed to create customer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/customers');
  };

  return (
    <PageContainer title="Add New Customer" description="Create a new customer account">
      <Box>
        {/* ── Header ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleCancel}
            sx={{ mr: 2, borderRadius: '8px' }}
            disabled={loading}
          >
            Back to Customers
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Add New Customer
          </Typography>
        </Box>

        {/* ── Form ── */}
        <CustomerForm
          customer={null}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={false}
          onCancel={handleCancel}
        />
      </Box>
    </PageContainer>
  );
};

export default CustomerNew;