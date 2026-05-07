import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import UserForm from './UserForm';
import adminUserService from 'src/services/adminUserService';

const UserNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      await adminUserService.create(payload);
      toast.success('User created successfully!');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Add User" description="Create a new admin user">
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Add New User
        </Typography>
      </Box>
      <UserForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={() => navigate('/admin/users')}
      />
    </PageContainer>
  );
};

export default UserNew;
