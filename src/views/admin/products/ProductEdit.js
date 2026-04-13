import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import productService from 'src/services/productService';
import ProductForm from './ProductForm';

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setFetchLoading(true);
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data);
      } catch (err) {
        if (err.message?.includes('not found')) {
          toast.error('Product not found');
        } else {
          toast.error(err.message || 'Failed to fetch product');
        }
        navigate('/admin/products');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await productService.updateProduct(id, data);
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (fetchLoading) {
    return (
      <PageContainer title="Edit Product" description="Update product information">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Product" description="Update product information">
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
            Edit Product - {product?.product_name}
          </Typography>
        </Box>

        <ProductForm
          product={product}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={true}
          onCancel={handleCancel}
        />
      </Box>
    </PageContainer>
  );
};

export default ProductEdit;
