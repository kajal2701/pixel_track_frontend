import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, Chip, IconButton, FormControl, InputLabel, Select, MenuItem, Stack, Grid } from '@mui/material';
import { Search, Add, Edit, Delete, Visibility, FilterList, PlayArrow, Pause } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../components/container/PageContainer';
import ParentCard from '../../../components/shared/ParentCard';
import ChildCard from '../../../components/shared/ChildCard';
import DataTable from '../../../components/shared/DataTable';

const ProductionList = () => {
  const theme = useTheme();
  const { palette } = theme;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample production data matching specifications
  const production = [
    { 
      id: 'PROD-001', 
      orderNumber: 'ORD-2024-001',
      rawMaterial: 'White Full Roll (WH001)',
      state: 'In Production',
      slittedQuantity: 0,
      slittedSize: '',
      slittedLength: 0,
      readyChannelHoleDistance: '',
      readyChannelPieces: 0,
      readyChannelLength: 0,
      waste: 0,
      technician: 'John Smith',
      deadline: '2024-03-25',
      status: 'in-progress',
      priority: 'high'
    },
    { 
      id: 'PROD-002', 
      orderNumber: 'ORD-2024-002',
      rawMaterial: 'Black Full Roll (BK002)',
      state: 'Completed',
      slittedQuantity: 2,
      slittedSize: '50ft',
      slittedLength: 100,
      readyChannelHoleDistance: '8 inches',
      readyChannelPieces: 12,
      readyChannelLength: 96,
      waste: 4,
      technician: 'Mike Johnson',
      deadline: '2024-03-20',
      status: 'completed',
      priority: 'medium'
    },
    { 
      id: 'PROD-003', 
      orderNumber: 'ORD-2024-003',
      rawMaterial: 'Red Full Roll (RD003)',
      state: 'Pending',
      slittedQuantity: 0,
      slittedSize: '',
      slittedLength: 0,
      readyChannelHoleDistance: '',
      readyChannelPieces: 0,
      readyChannelLength: 0,
      waste: 0,
      technician: 'Unassigned',
      deadline: '2024-03-30',
      status: 'pending',
      priority: 'low'
    },
    { 
      id: 'PROD-004', 
      orderNumber: 'PROD-STOCK-001',
      rawMaterial: 'Blue Full Roll (BL004)',
      state: 'In Production',
      slittedQuantity: 1,
      slittedSize: '25ft',
      slittedLength: 25,
      readyChannelHoleDistance: '9 inches',
      readyChannelPieces: 0,
      readyChannelLength: 0,
      waste: 0,
      technician: 'Sarah Wilson',
      deadline: '2024-03-28',
      status: 'in-progress',
      priority: 'medium'
    }
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

  // Filter production based on search and status
  const filteredProduction = production.filter(item => {
    const matchesSearch = 
      item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rawMaterial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // DataTable column definitions
  const columns = [
    { 
      field: 'id', 
      label: 'Production ID', 
      bold: true, 
      width: '15%' 
    },
    { 
      field: 'orderNumber', 
      label: 'Order Number', 
      width: '15%' 
    },
    { 
      field: 'rawMaterial', 
      label: 'Raw Material', 
      width: '20%' 
    },
    { 
      field: 'state', 
      label: 'State', 
      type: 'chip', 
      chipColor: getStatusColor, 
      width: '12%' 
    },
    { 
      field: 'slittedOutput', 
      label: 'Slitted Output', 
      width: '12%' 
    },
    { 
      field: 'readyChannelOutput', 
      label: 'Ready Channel', 
      width: '12%' 
    },
    { 
      field: 'waste', 
      label: 'Waste', 
      width: '8%' 
    },
    { 
      field: 'technician', 
      label: 'Technician', 
      width: '12%' 
    },
    { 
      field: 'actions', 
      label: 'Actions', 
      width: '14%' 
    }
  ];

  // Format rows for DataTable with action buttons
  const rows = filteredProduction.map(item => ({
    ...item,
    slittedOutput: item.slittedQuantity > 0 ? `${item.slittedQuantity}x ${item.slittedSize}` : 'None',
    readyChannelOutput: item.readyChannelPieces > 0 ? `${item.readyChannelPieces}x ${item.readyChannelHoleDistance}` : 'None',
    waste: item.waste > 0 ? `${item.waste}ft` : 'None',
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        <IconButton 
          size="small" 
          sx={{ color: palette.info.main }}
          onClick={() => handleViewProduction(item)}
          title="View Details"
        >
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: palette.primary.main }}
          onClick={() => handleEditProduction(item)}
          title="Edit Production"
        >
          <Edit fontSize="small" />
        </IconButton>
        {item.status === 'in-progress' ? (
          <IconButton 
            size="small" 
            sx={{ color: palette.warning.main }}
            onClick={() => handlePauseProduction(item)}
            title="Pause Production"
          >
            <Pause fontSize="small" />
          </IconButton>
        ) : (
          item.status === 'pending' && (
            <IconButton 
              size="small" 
              sx={{ color: palette.success.main }}
              onClick={() => handleStartProduction(item)}
              title="Start Production"
            >
              <PlayArrow fontSize="small" />
            </IconButton>
          )
        )}
        <IconButton 
          size="small" 
          sx={{ color: palette.error.main }}
          onClick={() => handleDeleteProduction(item)}
          title="Delete Production"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    )
  }));

  const handleViewProduction = (item) => {
    alert(`Production Details:\n\nID: ${item.id}\nOrder: ${item.orderNumber}\nRaw Material: ${item.rawMaterial}\nState: ${item.state}\nTechnician: ${item.technician}\nDeadline: ${item.deadline}\n\nSlitted Output: ${item.slittedQuantity > 0 ? `${item.slittedQuantity}x ${item.slittedSize} (${item.slittedLength}ft)` : 'None'}\nReady Channel: ${item.readyChannelPieces > 0 ? `${item.readyChannelPieces}x ${item.readyChannelHoleDistance} (${item.readyChannelLength}ft)` : 'None'}\nWaste: ${item.waste}ft`);
  };

  const handleEditProduction = (item) => {
    alert(`Edit production: ${item.id}`);
  };

  const handleStartProduction = (item) => {
    if (window.confirm(`Start production for ${item.id}?`)) {
      item.status = 'in-progress';
      alert(`Production ${item.id} started!`);
    }
  };

  const handlePauseProduction = (item) => {
    if (window.confirm(`Pause production for ${item.id}?`)) {
      item.status = 'pending';
      alert(`Production ${item.id} paused!`);
    }
  };

  const handleDeleteProduction = (item) => {
    if (window.confirm(`Delete production ${item.id}?`)) {
      alert(`Production ${item.id} deleted!`);
    }
  };

  return (
    <PageContainer title="Production Management" description="Manage production orders and schedules">
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>Production Management</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: '8px' }}>
            Filter
          </Button>
          <Button variant="contained" startIcon={<Add />} href="/admin/production/new" sx={{ borderRadius: '8px' }}>
            New Production
          </Button>
        </Stack>
      </Stack>

      {/* Search and Filter Bar */}
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} mb={3} alignItems="center">
        <TextField
          fullWidth
          placeholder="Search production by ID, order, raw material, or technician..."
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
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
            size="medium"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Production Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <ChildCard title="Pending Production">
            <Typography variant="h4" fontWeight="600" color="warning.main">
              {production.filter(item => item.status === 'pending').length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Awaiting raw materials
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChildCard title="In Production">
            <Typography variant="h4" fontWeight="600" color="info.main">
              {production.filter(item => item.status === 'in-progress').length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Currently being processed
            </Typography>
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChildCard title="Completed Today">
            <Typography variant="h4" fontWeight="600" color="success.main">
              {production.filter(item => item.status === 'completed').length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Ready for delivery
            </Typography>
          </ChildCard>
        </Grid>
      </Grid>

      {/* Production Table */}
      <ParentCard title="Production Management">
        <DataTable rows={rows} columns={columns} defaultRows={10} />
      </ParentCard>
    </PageContainer>
  );
};

export default ProductionList;