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
  getMinPickupDate,
  getEstimatedDeliveryDate,
  getPieceLength,
} from 'src/utils/helpers';
import OrderConfiguration from './OrderConfiguration';
import DeliveryOptions from './DeliveryOptions';
import { addDays, format } from 'date-fns';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [productsLoading, setProductsLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);

  const storedCustomer = JSON.parse(localStorage.getItem('customerData'));
  const [liveCustomer, setLiveCustomer] = React.useState(storedCustomer);

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
      channelLength: '',
      totalLength: '',
      deliveryMethod: '',
      pickupLocation: '',
      estimatedDeliveryDate: new Date(getEstimatedDeliveryDate()),
      pickupDate: null,
      deliveryAddress: '',
      notes: '',
    },
  });

  const channelLength = watch('channelLength');
  const totalLength = watch('totalLength');
  const deliveryMethod = watch('deliveryMethod');
  const channelType = watch('channelType');

  React.useEffect(() => {
    const fetchInitialData = async () => {
      setProductsLoading(true);
      try {
        // Fetch products and latest customer data in parallel
        const [productsRes, customerRes] = await Promise.all([
          productService.getAllProducts(),
          storedCustomer?.id ? import('src/services/customerService').then(m => m.default.getCustomerById(storedCustomer.id)) : Promise.resolve(null)
        ]);

        setProducts(productsRes.data || []);

        if (customerRes?.data) {
          const updatedCustomer = { ...storedCustomer, ...customerRes.data };
          setLiveCustomer(updatedCustomer);
          localStorage.setItem('customerData', JSON.stringify(updatedCustomer));
        }
      } catch (err) {
        toast.error(err.message || 'Failed to fetch data.');
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const colorOptions = React.useMemo(() => generateColorOptions(products), [products]);

  // ── Calculations ──
  const totalPieces = calculateTotalPieces(totalLength, channelLength);
  const finalLength = calculateFinalLength(totalLength, channelLength);

  // ── Submit → POST /api/orders ──
  const onSubmit = async (data) => {
    if (!liveCustomer?.id) {
      toast.error('Please login to place an order.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const deliveryMethodValue = data.deliveryMethod;
      let pickupDateValue = null;
      if (deliveryMethodValue === 'pickup' && data.pickupDate) {
        pickupDateValue = format(new Date(data.pickupDate), 'yyyy-MM-dd');
      } else if (deliveryMethodValue === 'delivery') {
        pickupDateValue = data.estimatedDeliveryDate
          ? format(new Date(data.estimatedDeliveryDate), 'yyyy-MM-dd')
          : getEstimatedDeliveryDate();
      }

      const payload = {
        customer_id: liveCustomer.id,
        channel_type: data.channelType,
        color: data.color,
        hole_distance: data.channelLength,  // channelLength now stores hole count (8, 9, 10)
        channel_length: getPieceLength(data.channelLength), // Store feet value in DB
        total_length: Number(data.totalLength),
        total_pieces: totalPieces,
        final_length: finalLength,
        delivery_method: deliveryMethodValue,
        pickup_location:
          deliveryMethodValue === 'pickup' ? data.pickupLocation?.trim() || null : null,
        pickup_date: pickupDateValue,
        delivery_address:
          deliveryMethodValue === 'delivery' ? data.deliveryAddress?.trim() || null : null,
        customer_notes: data.notes?.trim() || null,
      };
      await orderService.createOrder(payload);

      // Auto-update stored customer delivery address if they provided a new one
      if (deliveryMethodValue === 'delivery' && data.deliveryAddress) {
        const updatedCustomer = { ...liveCustomer, delivery_address: data.deliveryAddress };
        localStorage.setItem('customerData', JSON.stringify(updatedCustomer));
      }

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
            channelPricing={liveCustomer?.channel_pricing}
            channelType={channelType}
            setValue={setValue}
          />

          <DeliveryOptions
            control={control}
            errors={errors}
            register={register}
            deliveryMethod={deliveryMethod}
            totalPieces={totalPieces}
            setValue={setValue}
            customerAddress={liveCustomer?.delivery_address}
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
