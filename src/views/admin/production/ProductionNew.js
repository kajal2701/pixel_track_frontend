import React from 'react';
import { Box, Typography, Button, Paper, Grid, MenuItem, InputAdornment, FormHelperText, RadioGroup, FormControlLabel, Radio, FormControl } from '@mui/material';
import { Save, Cancel, ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import PageContainer from '../../../components/container/PageContainer';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';

const DUMMY_MATERIALS = [
  'INV-001 - White Full Roll (100ft)',
  'INV-002 - Black Full Roll (100ft)',
  'INV-003 - Red Slitted (50ft)',
  'INV-004 - Blue Full Roll (250ft)'
];

const ProductionNew = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      productionType: 'Order',
      orderNumber: '',
      rawMaterial: '',
      targetState: 'Slitted',
      slittedQuantity: 0,
      slittedSize: '',
      slittedLength: 0,
      readyChannelHole: '8 inches',
      readyChannelPieces: 0,
      readyChannelLength: 0,
      wasteQuantity: 0
    }
  });

  const selectedType = watch('productionType');
  const targetState = watch('targetState');

  const onSubmit = (data) => {
    console.log('Add New Production record:', data);
    navigate('/admin/production');
  };

  return (
    <PageContainer title="Add New Production" description="Process inventory for production">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/production')}
            sx={{ mr: 2, borderRadius: '8px' }}
          >
            Back to Production
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Add New Production
          </Typography>
        </Box>

        {/* Form */}
        <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container columnSpacing={3}>
              {/* Production Basis */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
                  Production Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={12}>
                <Controller
                  name="productionType"
                  control={control}
                  rules={{ required: 'Production Type is required' }}
                  render={({ field }) => (
                    <Box sx={{ mb: 2 }}>
                      <CustomFormLabel htmlFor="production-type" sx={{ mt: 0 }}>Production For</CustomFormLabel>
                      <FormControl component="fieldset">
                        <RadioGroup row {...field} id="production-type">
                          <FormControlLabel value="Order" control={<Radio />} label="Specific Order" />
                          <FormControlLabel value="Inventory" control={<Radio />} label="General Inventory" />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  )}
                />
              </Grid>

              {selectedType === 'Order' && (
                <Grid item xs={12} md={4}>
                  <Controller
                    name="orderNumber"
                    control={control}
                    rules={{ required: 'Order Number is required' }}
                    render={({ field, fieldState: { error } }) => (
                      <Box>
                        <CustomFormLabel htmlFor="order-number">Order Number *</CustomFormLabel>
                        <CustomTextField
                          {...field}
                          id="order-number"
                          fullWidth
                          placeholder="e.g., ORD-1025"
                          error={!!error}
                          helperText={error?.message}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Box>
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={selectedType === 'Order' ? 4 : 6}>
                <Controller
                  name="rawMaterial"
                  control={control}
                  rules={{ required: 'Raw Material is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="raw-material">Select Raw Material *</CustomFormLabel>
                      <CustomSelect
                        {...field}
                        id="raw-material"
                        fullWidth
                        displayEmpty
                        error={!!error}
                        sx={{ borderRadius: '8px' }}
                      >
                        <MenuItem value="" disabled>Select Material</MenuItem>
                        {DUMMY_MATERIALS.map((material) => (
                          <MenuItem key={material} value={material}>{material}</MenuItem>
                        ))}
                      </CustomSelect>
                      {error && <FormHelperText error>{error.message}</FormHelperText>}
                    </Box>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={selectedType === 'Order' ? 4 : 6}>
                <Controller
                  name="targetState"
                  control={control}
                  rules={{ required: 'Target State is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="target-state">Change State To *</CustomFormLabel>
                      <CustomSelect
                        {...field}
                        id="target-state"
                        fullWidth
                        error={!!error}
                        sx={{ borderRadius: '8px' }}
                      >
                        <MenuItem value="Slitted">Slitted</MenuItem>
                        <MenuItem value="Ready Channel">Ready Channel</MenuItem>
                      </CustomSelect>
                      {error && <FormHelperText error>{error.message}</FormHelperText>}
                    </Box>
                  )}
                />
              </Grid>

              {/* Slitted Information */}
              {targetState === 'Slitted' && (
                <>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="slittedQuantity"
                      control={control}
                      rules={{ required: 'Quantity is required', min: { value: 1, message: 'Quantity must be greater than 0' } }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="slitted-quantity">Quantity *</CustomFormLabel>
                          <CustomTextField
                            {...field}
                            id="slitted-quantity"
                            fullWidth
                            type="number"
                            placeholder="Number of slitted pieces"
                            error={!!error}
                            helperText={error?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="slittedSize"
                      control={control}
                      rules={{ required: 'Size is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="slitted-size">Size *</CustomFormLabel>
                          <CustomTextField
                            {...field}
                            id="slitted-size"
                            fullWidth
                            placeholder="e.g., 50ft"
                            error={!!error}
                            helperText={error?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="slittedLength"
                      control={control}
                      rules={{ required: 'Length is required', min: { value: 0.01, message: 'Length must be greater than 0' } }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="slitted-length">Length in feet *</CustomFormLabel>
                          <CustomTextField
                            {...field}
                            id="slitted-length"
                            fullWidth
                            type="number"
                            placeholder="Length in feet"
                            error={!!error}
                            helperText={error?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                </>
              )}

              {/* Ready Channel Information */}
              {targetState === 'Ready Channel' && (
                <>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="readyChannelHole"
                      control={control}
                      rules={{ required: 'Hole Distance is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="ready-channel-hole">Hole Distance *</CustomFormLabel>
                          <CustomSelect
                            {...field}
                            id="ready-channel-hole"
                            fullWidth
                            error={!!error}
                            sx={{ borderRadius: '8px' }}
                          >
                            <MenuItem value="8 inches">8 inches</MenuItem>
                            <MenuItem value="9 inches">9 inches</MenuItem>
                          </CustomSelect>
                          {error && <FormHelperText error>{error.message}</FormHelperText>}
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="readyChannelPieces"
                      control={control}
                      rules={{ required: 'Pieces is required', min: { value: 1, message: 'Pieces must be greater than 0' } }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="ready-channel-pieces">Pieces *</CustomFormLabel>
                          <CustomTextField
                            {...field}
                            id="ready-channel-pieces"
                            fullWidth
                            type="number"
                            placeholder="Number of finished pieces"
                            error={!!error}
                            helperText={error?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="readyChannelLength"
                      control={control}
                      rules={{ required: 'Length is required', min: { value: 0.01, message: 'Length must be greater than 0' } }}
                      render={({ field, fieldState: { error } }) => (
                        <Box>
                          <CustomFormLabel htmlFor="ready-channel-length">Length in feet *</CustomFormLabel>
                          <CustomTextField
                            {...field}
                            id="ready-channel-length"
                            fullWidth
                            type="number"
                            placeholder="Total length converted"
                            error={!!error}
                            helperText={error?.message}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                </>
              )}

              {/* Waste Tracking */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: palette.error.main, fontWeight: 600 }}>
                  Waste Tracking
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="wasteQuantity"
                  control={control}
                  rules={{ min: { value: 0, message: 'Cannot be negative' } }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="waste-quantity">Waste Quantity</CustomFormLabel>
                      <CustomTextField
                        {...field}
                        id="waste-quantity"
                        fullWidth
                        type="number"
                        placeholder="Quantity of waste"
                        error={!!error}
                        helperText={error?.message}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Box>
                  )}
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => navigate('/admin/production')}
                    sx={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    sx={{ borderRadius: '8px' }}
                  >
                    Confirm Production
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default ProductionNew;
