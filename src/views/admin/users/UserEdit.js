import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import UserForm from './UserForm';
import adminUserService from 'src/services/adminUserService';

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminUserService.getById(id);
        setUser(response.data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch user.');
        navigate('/admin/users');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      await adminUserService.update(id, payload);
      toast.success('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <PageContainer title="Edit User" description="Edit admin user">
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit User" description="Edit admin user">
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Edit User
        </Typography>
      </Box>
      <UserForm
        user={user}
        onSubmit={handleSubmit}
        loading={loading}
        isEdit
        onCancel={() => navigate('/admin/users')}
      />
    </PageContainer>
  );
};

export default UserEdit;
