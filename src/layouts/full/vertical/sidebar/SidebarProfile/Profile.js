import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import img1 from 'src/assets/images/profile/user-1.jpg';
import { IconPower } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const navigate = useNavigate();
  
  // Get user type and data for display
  const userType = localStorage.getItem('userType');
  
  let userName = 'User';
  let userRole = userType === 'admin' ? 'Administrator' : 'Customer';
  
  if (userType === 'admin') {
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    userName = adminData.username || 'Admin User';
  } else if (userType === 'customer') {
    const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
    userName = customerData.contact_name || customerData.company_name || 'Customer User';
  }

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminData');
    localStorage.removeItem('customerData');
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    navigate('/login');
  };
  
  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="User" src={img1} />

          <Box>
            <Typography variant="h6" color="textPrimary">{userName}</Typography>
            <Typography variant="caption" color="textSecondary">{userRole}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton 
                color="primary" 
                onClick={handleLogout} 
                aria-label="logout" 
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
