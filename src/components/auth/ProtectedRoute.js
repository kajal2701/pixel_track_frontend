import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedUserType, allowedRoles }) => {
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

  // Check specific admin roles if provided
  if (userType === 'admin' && allowedRoles && allowedRoles.length > 0) {
    try {
      const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
      if (adminData.role && !allowedRoles.includes(adminData.role)) {
        // If production tech tries to access unauthorized page, send them to production list
        if (adminData.role === 'production tech') {
          return <Navigate to="/admin/production" replace />;
        }
        return <Navigate to="/admin/dashboard" replace />;
      }
    } catch (e) {
      // JSON parse error, ignore and let them through or redirect?
      // Best to redirect to dashboard if we can't verify role when roles are required
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  // User type (and role) matches, allow access
  return children;
};

export default ProtectedRoute;
