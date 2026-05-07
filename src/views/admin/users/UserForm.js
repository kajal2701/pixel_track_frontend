import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, CircularProgress, Divider, MenuItem, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import { Save, Cancel, Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { ROLE_OPTIONS, STATUS_OPTIONS } from '../../../utils/helpers';
import CustomSelect from '../../../components/forms/theme-elements/CustomSelect';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

const UserForm = ({ user, onSubmit, loading, isEdit = false, onCancel }) => {
  const { palette } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (user && isEdit) {
      reset({
        username: user.username || '',
        email: user.email || '',
        password: '',
        role: user.role || '',
        status: user.status || 'active',
      });
      return;
    }

    if (!isEdit) {
      reset({
        username: '',
        email: '',
        password: '',
        role: '',
        status: 'active',
      });
    }
  }, [user, isEdit, reset]);

  const onFormSubmit = (data) => {
    const payload = {
      username: data.username?.trim(),
      email: data.email?.trim(),
      role: data.role,
      status: data.status,
    };

    // Only include password if provided
    if (data.password) {
      payload.password = data.password;
    }

    onSubmit(payload);
  };

  // Section heading helper
  const SectionHeading = ({ title }) => (
    <Grid item xs={12}>
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 0.5, color: palette.primary.main, fontWeight: 700, letterSpacing: 0.3 }}>
        {title}
      </Typography>
      <Divider />
    </Grid>
  );

  return (
    <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 0, color: palette.primary.main, fontWeight: 600 }}>
              {isEdit ? 'Edit User' : 'Create New User'}
            </Typography>
          </Grid>

          {/* ── Account Details ── */}
          <SectionHeading title="Account Details" />

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Username *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Email *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Password {isEdit ? '' : '*'}
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
              {...register('password', {
                ...(!isEdit && { required: 'Password is required' }),
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              error={!!errors.password}
              helperText={errors.password?.message || (isEdit ? 'Leave blank to keep current password' : '')}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* ── Role & Status ── */}
          <SectionHeading title="Role & Status" />

          <Grid item xs={12} md={6}>
            <Controller
              name="role"
              control={control}
              rules={{ required: 'Role is required' }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <CustomFormLabel htmlFor="role">Select Role *</CustomFormLabel>
                  <CustomSelect
                    {...field}
                    id="role"
                    fullWidth
                    displayEmpty
                    error={!!error}
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="" disabled>Select Role</MenuItem>
                    {ROLE_OPTIONS.filter((opt) => opt.value !== '').map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {error && <FormHelperText error>{error.message}</FormHelperText>}
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <CustomFormLabel htmlFor="status">Status *</CustomFormLabel>
                  <CustomSelect
                    {...field}
                    id="status"
                    fullWidth
                    displayEmpty
                    error={!!error}
                    sx={{ borderRadius: '8px' }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {error && <FormHelperText error>{error.message}</FormHelperText>}
                </Box>
              )}
            />
          </Grid>

          {/* ── Actions ── */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={onCancel}
                disabled={loading}
                sx={{ borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save />}
                sx={{ borderRadius: '8px', minWidth: 150 }}
              >
                {loading
                  ? isEdit ? 'Updating...' : 'Creating...'
                  : isEdit ? 'Update User' : 'Create User'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default UserForm;
