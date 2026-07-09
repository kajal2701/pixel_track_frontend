import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, Checkbox, 
  List, ListItem, ListItemIcon, ListItemText, CircularProgress, Chip
} from '@mui/material';
import toast from 'react-hot-toast';
import productService from 'src/services/productService';

const ColorGroupDialog = ({ open, group, allProducts, onClose }) => {
  const isEdit = !!group;
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState(group?.group_name || '');
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isEdit) {
      setSelectedIds(group.products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  }, [group, isEdit]);

  const handleToggle = (id) => {
    const currentIndex = selectedIds.indexOf(id);
    const newSelected = [...selectedIds];
    if (currentIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setSelectedIds(newSelected);
  };

  const handleSave = async () => {
    if (selectedIds.length < 2 && selectedIds.length > 0) {
      toast.error('A group must contain at least 2 products, or be empty to clear.');
      return;
    }
    
    setLoading(true);
    try {
      const payload = { group_name: groupName, product_ids: selectedIds };
      if (isEdit) {
        await productService.updateLinkGroup(group.id, payload);
        toast.success('Group updated successfully');
      } else {
        await productService.createLinkGroup(payload);
        toast.success('Group created successfully');
      }
      onClose(true);
    } catch (err) {
      toast.error(err.message || 'Failed to save group');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = allProducts.filter(p => {
    const term = search.toLowerCase();
    return (
      (p.color || '').toLowerCase().includes(term) ||
      (p.manufacturer || '').toLowerCase().includes(term) ||
      (p.color_code || '').toLowerCase().includes(term)
    );
  });

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Color Group' : 'Create Color Group'}</DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <TextField
            fullWidth
            label="Group Name (e.g., Pebble Family)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Optional descriptive name"
          />
        </Box>

        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Select Products (Minimum 2)
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <List sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, maxHeight: 300, overflow: 'auto' }}>
          {filteredProducts.map((p) => {
            const isSelected = selectedIds.indexOf(p.id) !== -1;
            const isInAnotherGroup = p.link_group_id && (!isEdit || p.link_group_id !== group.id);
            const labelId = `checkbox-list-label-${p.id}`;

            return (
              <ListItem
                key={p.id}
                role={undefined}
                dense
                button
                onClick={() => handleToggle(p.id)}
                sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Checkbox
                    edge="start"
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight={500}>
                        {p.color} {p.color_code ? `(${p.color_code})` : ''}
                      </Typography>
                      {isInAnotherGroup && !isSelected && (
                        <Chip label="In another group" size="small" color="warning" sx={{ height: 20, fontSize: '0.65rem' }} />
                      )}
                    </Box>
                  }
                  secondary={p.manufacturer}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading || selectedIds.length === 1}>
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorGroupDialog;
