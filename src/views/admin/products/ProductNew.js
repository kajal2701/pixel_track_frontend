import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import productService from 'src/services/productService';
import ProductForm from './ProductForm';

const ProductNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await productService.createProduct(data);
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  return (
    <PageContainer title="Add New Product" description="Create a new product">
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleCancel}
            sx={{ mr: 2, borderRadius: '8px' }}
            disabled={loading}
          >
            Back to Products
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Add New Product
          </Typography>
        </Box>

        <ProductForm
          product={null}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={false}
          onCancel={handleCancel}
        />
      </Box>
    </PageContainer>
  );
};

export default ProductNew;
