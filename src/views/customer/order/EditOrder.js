import React from 'react';
import {
  Box,
  Button,
  Stack,
  CircularProgress

} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import PageContainer from '../../../components/container/PageContainer';
import orderService from 'src/services/orderService';
import productService from 'src/services/productService';
import {
  calculateTotalPieces,
  calculateFinalLength,
  generateColorOptions,
  getEstimatedDeliveryDate,
  getPieceLength,
} from 'src/utils/helpers';
import OrderConfiguration from './OrderConfiguration';
import DeliveryOptions from './DeliveryOptions';
import { format, parseISO } from 'date-fns';

const EditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);
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
    reset
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
      setInitialLoading(true);
      setProductsLoading(true);
      try {
        const [orderRes, productsRes, customerRes] = await Promise.all([
          orderService.getOrderById(id),
          productService.getAllProducts(),
          storedCustomer?.id ? import('src/services/customerService').then(m => m.default.getCustomerById(storedCustomer.id)) : Promise.resolve(null)
        ]);

        const order = orderRes.data;

        if (order.order_status !== 'Pending') {
          toast.error('Order can only be edited while Pending.');
          navigate('/order/history');
          return;
        }

        setProducts(productsRes.data || []);

        if (customerRes?.data) {
          const updatedCustomer = { ...storedCustomer, ...customerRes.data };
          setLiveCustomer(updatedCustomer);
          localStorage.setItem('customerData', JSON.stringify(updatedCustomer));
        }

        // Initialize form with order data
        let pickupDateValue = null;
        let estimatedDeliveryDateValue = new Date(getEstimatedDeliveryDate());

        if (order.pickup_date) {
          const parsedDate = parseISO(order.pickup_date);
          if (order.delivery_method === 'pickup') {
            pickupDateValue = parsedDate;
          } else if (order.delivery_method === 'delivery') {
            estimatedDeliveryDateValue = parsedDate;
          }
        }

        reset({
          channelType: order.channel_type || '',
          color: order.color || '',
          channelLength: order.hole_distance || '', // Map hole_distance to channelLength form field
          totalLength: order.total_length || '',
          deliveryMethod: order.delivery_method || '',
          pickupLocation: order.pickup_location || '',
          estimatedDeliveryDate: estimatedDeliveryDateValue,
          pickupDate: pickupDateValue,
          deliveryAddress: order.delivery_address || '',
          notes: order.customer_notes || '',
        });

      } catch (err) {
        toast.error(err.message || 'Failed to fetch data.');
        navigate('/order/history');
      } finally {
        setProductsLoading(false);
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [id, navigate, reset]);

  const colorOptions = React.useMemo(() => generateColorOptions(products), [products]);

  // ── Calculations ──
  const totalPieces = calculateTotalPieces(totalLength, channelLength);
  const finalLength = calculateFinalLength(totalLength, channelLength);

  // ── Submit → PATCH /api/orders/:id/edit ──
  const onSubmit = async (data) => {
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
        channel_type: data.channelType,
        color: data.color,
        hole_distance: data.channelLength,
        channel_length: getPieceLength(data.channelLength),
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

      await orderService.editOrder(id, payload);

      // Auto-update stored customer delivery address if they provided a new one
      if (deliveryMethodValue === 'delivery' && data.deliveryAddress) {
        const updatedCustomer = { ...liveCustomer, delivery_address: data.deliveryAddress };
        localStorage.setItem('customerData', JSON.stringify(updatedCustomer));
      }

      toast.success('Order updated successfully!');
      navigate('/order/history');
    } catch (err) {
      toast.error(err.message || 'Failed to update order.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <PageContainer title="Edit Order" description="Edit an existing pixel track order">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Order" description="Edit an existing pixel track order">
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
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </Box>
        </Stack>
      </form>
    </PageContainer>
  );
};

export default EditOrder;
