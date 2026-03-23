import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    
    // Redirect to login page
    navigate('/login');
  };

  return handleLogout;
};

export default Logout;
