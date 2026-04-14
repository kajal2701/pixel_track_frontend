import React from 'react';
import {
  Box,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import PageContainer from '../../../components/container/PageContainer';
import orderService from 'src/services/orderService';
import productService from 'src/services/productService';
import {
  calculateTotalPieces,
  calculateFinalLength,
  generateColorOptions,
} from 'src/utils/helpers';
import OrderConfiguration from './OrderConfiguration';
import DeliveryOptions from './DeliveryOptions';
import { addDays, format } from 'date-fns';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);

  const customer = JSON.parse(localStorage.getItem('customerData'));

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm({
    defaultValues: {
      channelType: '',
      color: '',
      holeDistance: '',
      channelLength: '',
      totalLength: '',
      deliveryMethod: '',
      pickupLocation: '',
      pickupDate: addDays(new Date(), 1),
      deliveryAddress: '',
      notes: '',
    },
  });

  const channelLength = watch('channelLength');
  const totalLength = watch('totalLength');
  const deliveryMethod = watch('deliveryMethod');

  React.useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await productService.getAllProducts();
        setProducts(response.data || []);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch products.');
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const colorOptions = React.useMemo(() => generateColorOptions(products), [products]);

  // ── Calculations ──
  const totalPieces = calculateTotalPieces(totalLength, channelLength);
  const finalLength = calculateFinalLength(totalLength, channelLength);

  // ── Submit → POST /api/orders ──
  const onSubmit = async (data) => {
    if (!customer?.id) {
      toast.error('Please login to place an order.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const deliveryMethodValue = data.deliveryMethod;
      const pickupDateValue =
        deliveryMethodValue === 'pickup' && data.pickupDate
          ? format(new Date(data.pickupDate), 'yyyy-MM-dd')
          : null;

      const payload = {
        customer_id: customer.id,
        channel_type: data.channelType,
        color: data.color,
        hole_distance: Number(data.holeDistance),
        channel_length: data.channelLength,
        total_length: Number(data.totalLength),
        total_pieces: totalPieces,
        final_length: finalLength,
        delivery_method: deliveryMethodValue,
        pickup_location:
          deliveryMethodValue === 'pickup' ? data.pickupLocation?.trim() || null : null,
        pickup_date: pickupDateValue,
        delivery_address:
          deliveryMethodValue === 'delivery' ? data.deliveryAddress?.trim() || null : null,
        notes: data.notes?.trim() || null,
      };
      await orderService.createOrder(payload);
      toast.success('Order placed successfully!');
      navigate('/order/history');
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Place Order" description="Create a new pixel track order">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <OrderConfiguration
            control={control}
            errors={errors}
            register={register}
            productsLoading={productsLoading}
            colorOptions={colorOptions}
            totalPieces={totalPieces}
            finalLength={finalLength}
          />

          <DeliveryOptions
            control={control}
            errors={errors}
            register={register}
            deliveryMethod={deliveryMethod}
          />

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Cancel />}
              onClick={() => navigate('/order/history')}
              sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
              disabled={loading}
              sx={{ borderRadius: '8px', px: 4, py: 1.5 }}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Box>
        </Stack>
      </form>
    </PageContainer>
  );
};

export default PlaceOrder;
