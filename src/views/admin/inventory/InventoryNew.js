import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, Select, MenuItem, FormControl, InputLabel, InputAdornment, TextareaAutosize } from '@mui/material';
import { Save, Cancel, ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';

const InventoryNew = () => {
  const theme = useTheme();
  const { palette } = theme;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Search by color
    color: '',
    supplier: '',
    colorCode: '',
    price: '',
    state: 'Available',
    
    // Inventory Types
    type: 'Full Roll', // Full Roll, Slitted, Ready Channel
    
    // Full Roll fields
    size: '',
    quantity: '',
    possibleFeet: '',
    
    // Slitted fields
    slittedQuantity: '',
    slittedSize: '',
    slittedPossibleFeet: '',
    
    // Ready Channel fields
    readyChannelHoleDistance: '8 inches', // 8/9 inches
    readyChannelPieces: '',
    readyChannelLength: '',
    
    // Additional info
    notes: ''
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New inventory item:', formData);
    // Handle form submission here
    navigate('/admin/inventory');
  };

  return (
    <PageContainer title="Add New Inventory Item" description="Create a new inventory item">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/inventory')}
            sx={{ mr: 2, borderRadius: '8px' }}
          >
            Back to Inventory
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, color: palette.text.primary }}>
            Add New Inventory Item
          </Typography>
        </Box>

        {/* Form */}
        <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: palette.primary.main, fontWeight: 600 }}>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Color"
                  value={formData.color}
                  onChange={handleInputChange('color')}
                  placeholder="e.g., White, Black, Red"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Supplier"
                  value={formData.supplier}
                  onChange={handleInputChange('supplier')}
                  placeholder="e.g., Supplier A"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Color Code"
                  value={formData.colorCode}
                  onChange={handleInputChange('colorCode')}
                  placeholder="e.g., WH001, BK002"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Price per Foot ($)"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange('price')}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={formData.state}
                    onChange={handleInputChange('state')}
                    label="State"
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Low Stock">Low Stock</MenuItem>
                    <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Inventory Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleInputChange('type')}
                    label="Inventory Type"
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="Full Roll">Full Roll</MenuItem>
                    <MenuItem value="Slitted">Slitted</MenuItem>
                    <MenuItem value="Ready Channel">Ready Channel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Full Roll Information */}
              {formData.type === 'Full Roll' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 2, color: palette.primary.main, fontWeight: 600 }}>
                      Full Roll Information
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Size"
                      value={formData.size}
                      onChange={handleInputChange('size')}
                      placeholder="e.g., 100ft"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange('quantity')}
                      placeholder="Number of rolls"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Possible Feet"
                      type="number"
                      value={formData.possibleFeet}
                      onChange={handleInputChange('possibleFeet')}
                      placeholder="Total feet available"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                </>
              )}

              {/* Slitted Information */}
              {formData.type === 'Slitted' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 2, color: palette.primary.main, fontWeight: 600 }}>
                      Slitted Roll Information
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={formData.slittedQuantity}
                      onChange={handleInputChange('slittedQuantity')}
                      placeholder="Number of slitted pieces"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Size"
                      value={formData.slittedSize}
                      onChange={handleInputChange('slittedSize')}
                      placeholder="e.g., 50ft, 25ft"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Possible Feet"
                      type="number"
                      value={formData.slittedPossibleFeet}
                      onChange={handleInputChange('slittedPossibleFeet')}
                      placeholder="Total feet available"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                </>
              )}

              {/* Ready Channel Information */}
              {formData.type === 'Ready Channel' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 2, color: palette.primary.main, fontWeight: 600 }}>
                      Ready Channel Information
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Hole Distance</InputLabel>
                      <Select
                        value={formData.readyChannelHoleDistance}
                        onChange={handleInputChange('readyChannelHoleDistance')}
                        label="Hole Distance"
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      >
                        <MenuItem value="8 inches">8 inches center-to-center</MenuItem>
                        <MenuItem value="9 inches">9 inches center-to-center</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Pieces"
                      type="number"
                      value={formData.readyChannelPieces}
                      onChange={handleInputChange('readyChannelPieces')}
                      placeholder="Number of pieces"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Length (feet)"
                      type="number"
                      value={formData.readyChannelLength}
                      onChange={handleInputChange('readyChannelLength')}
                      placeholder="Total length in feet"
                      required
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                </>
              )}

              {/* Additional Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 2, color: palette.primary.main, fontWeight: 600 }}>
                  Additional Information
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange('notes')}
                  placeholder="Additional notes about this inventory item..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => navigate('/admin/inventory')}
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
                    Save Inventory Item
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

export default InventoryNew;
