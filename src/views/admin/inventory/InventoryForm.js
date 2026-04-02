import React, { useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, MenuItem, InputAdornment, FormHelperText } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';
import { AVAILABLE_COLORS } from '../../../utils/helpers';

const InventoryForm = ({ initialValues, onSubmit, onCancel, isEditing }) => {
  const theme = useTheme();
  const { palette } = theme;

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: initialValues || {
      color: '',
      supplier: '',
      colorCode: '',
      price: 0,
      type: 'Full Roll',
      fullRollSize: '',
      fullRollQuantity: '',
      fullRollPossibleFeet: '',
      slittedQuantity: '',
      slittedSize: '',
      slittedPossibleFeet: '',
      readyChannelHole: '8 inches',
      readyChannelPieces: '',
      readyChannelLength: '',
    }
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (initialValues) {
      reset({ ...initialValues });
    }
  }, [initialValues, reset]);

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container columnSpacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
              Inventory Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="color"
              control={control}
              rules={{ required: 'Color is required' }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <CustomFormLabel htmlFor="color-name">Color Name *</CustomFormLabel>
                  <CustomSelect
                    {...field}
                    id="color-name"
                    fullWidth
                    displayEmpty
                    error={!!error}
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="" disabled>Select Color</MenuItem>
                    {AVAILABLE_COLORS.map((color) => (
                      <MenuItem key={color} value={color}>{color}</MenuItem>
                    ))}
                  </CustomSelect>
                  {error && <FormHelperText error>{error.message}</FormHelperText>}
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Box>
              <CustomFormLabel htmlFor="supplier">Supplier *</CustomFormLabel>
              <Controller
                name="supplier"
                control={control}
                rules={{ required: 'Supplier is required' }}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    id="supplier"
                    fullWidth
                    placeholder="Enter supplier name"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="colorCode"
              control={control}
              rules={{ required: 'Color Code is required' }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <CustomFormLabel htmlFor="color-code">Color Code *</CustomFormLabel>
                  <CustomTextField
                    {...field}
                    id="color-code"
                    fullWidth
                    placeholder="e.g., WH-001, BK-002"
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
              name="price"
              control={control}
              rules={{ required: 'Price per Foot is required', min: { value: 0.01, message: 'Price must be greater than 0' } }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <CustomFormLabel htmlFor="price-per-foot">Price per Foot *</CustomFormLabel>
                  <CustomTextField
                    {...field}
                    id="price-per-foot"
                    fullWidth
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    error={!!error}
                    helperText={error?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
              )}
            />
          </Grid>

          {/* Inventory State Toggle Equivalent */}
          <Grid item xs={12} md={4}>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Inventory State is required' }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <CustomFormLabel htmlFor="inventory-state">Inventory State *</CustomFormLabel>
                  <CustomSelect
                    {...field}
                    id="inventory-state"
                    fullWidth
                    error={!!error}
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="Full Roll">Full Roll</MenuItem>
                    <MenuItem value="Slitted">Slitted</MenuItem>
                    <MenuItem value="Ready Channel">Ready Channel</MenuItem>
                  </CustomSelect>
                  {error && <FormHelperText error>{error.message}</FormHelperText>}
                </Box>
              )}
            />
          </Grid>

          {/* Full Roll Information */}
          {selectedType === 'Full Roll' && (
            <>
              <Grid item xs={12} md={4}>
                <Controller
                  name="fullRollSize"
                  control={control}
                  rules={{ required: 'Size is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="full-roll-size">Size *</CustomFormLabel>
                      <CustomTextField
                        {...field}
                        id="full-roll-size"
                        fullWidth
                        placeholder="e.g., 200ft"
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
                  name="fullRollQuantity"
                  control={control}
                  rules={{ required: 'Quantity is required', min: { value: 1, message: 'Quantity must be greater than 0' } }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="full-roll-quantity">Quantity *</CustomFormLabel>
                      <CustomTextField
                        {...field}
                        id="full-roll-quantity"
                        fullWidth
                        type="number"
                        placeholder="Number of rolls"
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
                  name="fullRollPossibleFeet"
                  control={control}
                  rules={{ required: 'Possible Feet is required', min: { value: 0.01, message: 'Possible feet must be greater than 0' } }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="full-roll-possible-feet">Possible Feet in Production *</CustomFormLabel>
                      <CustomTextField
                        {...field}
                        id="full-roll-possible-feet"
                        fullWidth
                        type="number"
                        placeholder="Total feet that can be produced"
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

          {/* Slitted Information */}
          {selectedType === 'Slitted' && (
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
                        placeholder="e.g., 50ft, 25ft"
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
                  name="slittedPossibleFeet"
                  control={control}
                  rules={{ required: 'Possible Feet is required', min: { value: 0.01, message: 'Possible feet must be greater than 0' } }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="slitted-possible-feet">Possible Feet in Production *</CustomFormLabel>
                      <CustomTextField
                        {...field}
                        id="slitted-possible-feet"
                        fullWidth
                        type="number"
                        placeholder="Remaining feet for production"
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
          {selectedType === 'Ready Channel' && (
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
                        placeholder="Number of finished channel pieces"
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
                  rules={{ required: 'Length per Piece is required', min: { value: 0.01, message: 'Length must be greater than 0' } }}
                  render={({ field, fieldState: { error } }) => (
                    <Box>
                      <CustomFormLabel htmlFor="ready-channel-length">Length per Piece *</CustomFormLabel>
                      <CustomTextField
                        {...field}
                        id="ready-channel-length"
                        fullWidth
                        type="number"
                        placeholder="Length of each piece in feet"
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

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={onCancel}
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
                {isEditing ? "Update Inventory Item" : "Save Inventory Item"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default InventoryForm;
