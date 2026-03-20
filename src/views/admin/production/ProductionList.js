import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, TextField, InputAdornment, LinearProgress } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList, PlayArrow, Pause } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';

const ProductionList = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const production = [
    { 
      id: 'PROD-001', 
      product: 'LED Strip Light 5m', 
      quantity: 500, 
      progress: 75, 
      startDate: '2024-01-10', 
      endDate: '2024-01-20', 
      status: 'in-progress',
      priority: 'high'
    },
    { 
      id: 'PROD-002', 
      product: 'Smart Bulb RGB', 
      quantity: 1000, 
      progress: 100, 
      startDate: '2024-01-05', 
      endDate: '2024-01-15', 
      status: 'completed',
      priority: 'medium'
    },
    { 
      id: 'PROD-003', 
      product: 'Track Connector', 
      quantity: 200, 
      progress: 0, 
      startDate: '2024-01-20', 
      endDate: '2024-01-25', 
      status: 'pending',
      priority: 'low'
    },
    { 
      id: 'PROD-004', 
      product: 'Power Supply 12V', 
      quantity: 150, 
      progress: 45, 
      startDate: '2024-01-12', 
      endDate: '2024-01-22', 
      status: 'in-progress',
      priority: 'high'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in-progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return palette.success.main;
    if (progress >= 50) return palette.info.main;
    return palette.warning.main;
  };

  const filteredProduction = production.filter(item =>
    item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer title="Production Management" description="Manage production orders and schedules">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Production
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ borderRadius: '8px' }}
            >
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              href="/admin/production/new"
              sx={{ borderRadius: '8px' }}
            >
              New Production
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search production by product or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: palette.background.paper,
              }
            }}
          />
        </Box>

        {/* Production Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Production ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Progress</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: palette.text.primary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProduction.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{item.id}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{item.quantity}</TableCell>
                  <TableCell sx={{ width: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={item.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProgressColor(item.progress),
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, minWidth: '35px' }}>
                        {item.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      color={getPriorityColor(item.priority)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status.replace('-', ' ').charAt(0).toUpperCase() + item.status.replace('-', ' ').slice(1)}
                      color={getStatusColor(item.status)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: palette.info.main }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: palette.primary.main }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      {item.status === 'in-progress' ? (
                        <IconButton size="small" sx={{ color: palette.warning.main }}>
                          <Pause fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton size="small" sx={{ color: palette.success.main }}>
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton size="small" sx={{ color: palette.error.main }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </PageContainer>
  );
};

export default ProductionList;
