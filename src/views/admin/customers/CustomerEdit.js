import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../../components/container/PageContainer';
import customerService from 'src/services/customerService';
import CustomerForm from './CustomerForm';

const CustomerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  // ── Fetch customer data ──
  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    setFetchLoading(true);
    try {
      const response = await customerService.getCustomerById(id);
      setCustomer(response.data);
    } catch (err) {
      if (err.message?.includes('not found')) {
        toast.error('Customer not found');
      } else {
        toast.error(err.message || 'Failed to fetch customer');
      }
      navigate('/admin/customers');
    } finally {
      setFetchLoading(false);
    }
  };

  // ── Submit → PUT /api/customers/:id ──
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await customerService.updateCustomer(id, data);
      toast.success('Customer updated successfully!');
      navigate('/admin/customers');
    } catch (err) {
      if (err.message?.includes('already exists')) {
        toast.error('Customer number or email already exists.');
      } else {
        toast.error(err.message || 'Failed to update customer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/customers');
  };

  if (fetchLoading) {
    return (
      <PageContainer title="Edit Customer" description="Update customer information">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Customer" description="Update customer information">
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
            Edit Customer - {customer?.company_name}
          </Typography>
        </Box>

        {/* ── Form ── */}
        <CustomerForm
          customer={customer}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={true}
          onCancel={handleCancel}
        />
      </Box>
    </PageContainer>
  );
};

export default CustomerEdit;
