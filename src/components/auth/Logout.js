import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Get user type before clearing data
    const userType = localStorage.getItem('userType');
    
    // Clear all user data from localStorage
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminData');
    localStorage.removeItem('customerData');
    localStorage.removeItem('userRole');
    
    // Redirect based on user type
    if (userType === 'admin') {
      navigate('/admin-login');
    } else {
      navigate('/login');
    }
  };

  return handleLogout;
};

export default Logout;
