import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  IconButton, Stack, CircularProgress, Chip,
} from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';
import adminUserService from 'src/services/adminUserService';
import DeleteUserDialog from './DeleteUserDialog';
import { formatDate, getRoleChipColor } from 'src/utils/helpers';



const columns = [
  { field: 'username', label: 'Username', bold: true, width: '160px', minWidth: '160px' },
  { field: 'email', label: 'Email', width: '220px', minWidth: '220px' },
  { field: 'role_chip', label: 'Role', width: '160px', minWidth: '160px' },
  { field: 'status_chip', label: 'Status', width: '120px', minWidth: '120px' },
  { field: 'created_at', label: 'Created', width: '160px', minWidth: '160px' },
  { field: 'actions', label: 'Actions', width: '120px', minWidth: '120px' },
];

const UserList = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  // Get current logged-in admin ID
  const currentAdmin = JSON.parse(localStorage.getItem('adminData') || '{}');
  const currentAdminId = currentAdmin.id;

  // ── Fetch users on mount ──
  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminUserService.getAll();
      const formatted = (response.data || []).map((user) => ({
        ...user,
        created_at: formatDate(user.created_at),
      }));
      setAllUsers(formatted);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // ── Local search filter ──
  const filteredUsers = allUsers.filter((user) => {
    const q = searchTerm.toLowerCase();
    return [user.username, user.email, user.role, user.status]
      .some((f) => f?.toLowerCase().includes(q));
  });

  // ── Delete handlers ──
  const openDeleteDialog = (user) => setDeleteDialog({ open: true, user });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, user: null });

  const handleDeleteConfirm = async (user) => {
    setActionLoading(true);
    try {
      await adminUserService.delete(user.id);
      toast.success(`User "${user.username}" deleted successfully.`);
      await fetchUsers();
      closeDeleteDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to deactivate user.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Edit handler ──
  const handleEdit = (user) => {
    navigate(`/admin/users/edit/${user.id}`);
  };

  // ── Build rows ──
  const rows = filteredUsers.map((user) => ({
    ...user,
    role_chip: (
      <Chip
        label={user.role}
        color={getRoleChipColor(user.role)}
        size="small"
        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
      />
    ),
    status_chip: (
      <Chip
        label={user.status}
        color={user.status === 'active' ? 'success' : 'error'}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
      />
    ),
    actions: (
      <Stack direction="row" gap={0.5}>
        <IconButton
          size="small"
          sx={{ color: palette.info.main }}
          onClick={() => handleEdit(user)}
          title="Edit"
        >
          <Edit fontSize="small" />
        </IconButton>
        {user.status === 'active' && (
          <IconButton
            size="small"
            sx={{ color: palette.error.main }}
            onClick={() => openDeleteDialog(user)}
            title="Deactivate"
          >
            <Delete fontSize="small" />
          </IconButton>
        )}
      </Stack>
    ),
  }));

  return (
    <PageContainer title="User Management" description="Manage admin users">
      {/* ── Header ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/users/new')}
          sx={{ borderRadius: '8px' }}
        >
          Add User
        </Button>
      </Stack>

      {/* ── Search ── */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by username, email, role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
      </Box>

      {/* ── Table ── */}
      <ParentCard title="All Users">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataTable rows={rows} columns={columns} defaultRows={10} />
        )}
      </ParentCard>

      {/* ── Delete Dialog ── */}
      <DeleteUserDialog
        open={deleteDialog.open}
        user={deleteDialog.user}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </PageContainer>
  );
};

export default UserList;
