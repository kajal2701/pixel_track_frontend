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
  
  // Get user type for display
  const userType = localStorage.getItem('userType');
  const userName = userType === 'admin' ? 'Admin User' : 'Customer User';
  const userRole = userType === 'admin' ? 'Administrator' : 'Customer';

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    
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
