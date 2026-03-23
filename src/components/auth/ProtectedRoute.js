import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedUserType }) => {
  const userType = localStorage.getItem('userType');
  
  // If no user type, redirect to login
  if (!userType) {
    return <Navigate to="/login" replace />;
  }
  
  // If user type doesn't match allowed type, redirect to appropriate dashboard
  if (userType !== allowedUserType) {
    if (userType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userType === 'customer') {
      return <Navigate to="/order/history" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  
  // User type matches, allow access
  return children;
};

export default ProtectedRoute;
