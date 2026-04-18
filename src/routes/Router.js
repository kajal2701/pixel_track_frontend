import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));


const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));



const AccountSetting = Loadable(
  lazy(() => import('../views/pages/account-setting/AccountSetting')),
);







// ── Authentication ─────────────────────────────────────────────────────────
const LoginAdminOnly = Loadable(lazy(() => import('../views/authentication/auth2/LoginAdminOnly')));
const LoginCustomerOrderPortal = Loadable(lazy(() => import('../views/authentication/auth2/LoginCustomerOrderPortal')));

const Error = Loadable(lazy(() => import('../views/authentication/Error')));

// ── NEW: Admin pages ───────────────────────────────────────────────────────

const Dashboard     = Loadable(lazy(() => import('../views/admin/dashboard/Dashboard')));
const Orders        = Loadable(lazy(() => import('../views/admin/orders/Orders')));
const InventoryList = Loadable(lazy(() => import('../views/admin/inventory/InventoryList')));
const InventoryNew  = Loadable(lazy(() => import('../views/admin/inventory/InventoryNew')));
const InventoryEdit  = Loadable(lazy(() => import('../views/admin/inventory/InventoryEdit')));
const ProductionList = Loadable(lazy(() => import('../views/admin/production/ProductionList')));
const ProductionNew  = Loadable(lazy(() => import('../views/admin/production/ProductionNew')));
const ProductionEdit = Loadable(lazy(() => import('../views/admin/production/ProductionEdit')));
const CustomerList  = Loadable(lazy(() => import('../views/admin/customers/CustomerList')));
const CustomerNew   = Loadable(lazy(() => import('../views/admin/customers/CustomerNew')));
const CustomerEdit  = Loadable(lazy(() => import('../views/admin/customers/CustomerEdit')));
const Invoices      = Loadable(lazy(() => import('../views/admin/invoices/Invoices')));
const Reports       = Loadable(lazy(() => import('../views/admin/reports/Reports')));
const ProductList   = Loadable(lazy(() => import('../views/admin/products/ProductList')));
const ProductNew    = Loadable(lazy(() => import('../views/admin/products/ProductNew')));
const ProductEdit   = Loadable(lazy(() => import('../views/admin/products/ProductEdit')));

// ── NEW: Customer order portal pages ──────────────────────────────────────
const PlaceOrder    = Loadable(lazy(() => import('../views/customer/order/PlaceOrder')));
const OrderHistory  = Loadable(lazy(() => import('../views/customer/order/OrderHistory')));


const Router = [
  // ── Blank layout: auth pages ────────────────────────────────────────────
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/',              element: <LoginAdminOnly /> },
      { path: '/admin-login',   element: <LoginAdminOnly /> },
      { path: '/login',         element: <LoginCustomerOrderPortal /> },
      { path: '/auth/404',      element: <Error /> },
      { path: '*',              element: <Navigate to="/auth/404" /> },
    ],
  },

  // ── Full layout: all dashboard + NEW admin + order routes ────────────────
  {
    path: '/',
    element: <FullLayout />,
    children: [

      // ── NEW: Admin routes ──────────────────────────────────────────────
      { path: '/admin/dashboard',      element: <ProtectedRoute allowedUserType="admin"><Dashboard /></ProtectedRoute> },
      { path: '/admin/orders',         element: <ProtectedRoute allowedUserType="admin"><Orders /></ProtectedRoute> },
      { path: '/admin/inventory',      element: <ProtectedRoute allowedUserType="admin"><InventoryList /></ProtectedRoute> },
      { path: '/admin/inventory/new',  element: <ProtectedRoute allowedUserType="admin"><InventoryNew /></ProtectedRoute> },
      { path: '/admin/inventory/edit/:id', element: <ProtectedRoute allowedUserType="admin"><InventoryEdit /></ProtectedRoute> },
      { path: '/admin/production',        element: <ProtectedRoute allowedUserType="admin"><ProductionList /></ProtectedRoute> },
      { path: '/admin/production/new',    element: <ProtectedRoute allowedUserType="admin"><ProductionNew /></ProtectedRoute> },
      { path: '/admin/production/edit/:id', element: <ProtectedRoute allowedUserType="admin"><ProductionEdit /></ProtectedRoute> },
      { path: '/admin/customers',      element: <ProtectedRoute allowedUserType="admin"><CustomerList /></ProtectedRoute> },
      { path: '/admin/customers/new',  element: <ProtectedRoute allowedUserType="admin"><CustomerNew /></ProtectedRoute> },
      { path: '/admin/customers/edit/:id', element: <ProtectedRoute allowedUserType="admin"><CustomerEdit /></ProtectedRoute> },
      { path: '/admin/products',       element: <ProtectedRoute allowedUserType="admin"><ProductList /></ProtectedRoute> },
      { path: '/admin/products/new',   element: <ProtectedRoute allowedUserType="admin"><ProductNew /></ProtectedRoute> },
      { path: '/admin/products/edit/:id', element: <ProtectedRoute allowedUserType="admin"><ProductEdit /></ProtectedRoute> },
      { path: '/admin/invoices',       element: <ProtectedRoute allowedUserType="admin"><Invoices /></ProtectedRoute> },
      { path: '/admin/reports',        element: <ProtectedRoute allowedUserType="admin"><Reports /></ProtectedRoute> },

      // ── NEW: Customer order portal routes ──────────────────────────────
      { path: '/order/new',            element: <ProtectedRoute allowedUserType="customer"><PlaceOrder /></ProtectedRoute> },
      { path: '/order/history',        element: <ProtectedRoute allowedUserType="customer"><OrderHistory /></ProtectedRoute> },

      // ── EXISTING: kept exactly as before ──────────────────────────────
      { path: '/user-profile',      element: <UserProfile /> },
      { path: '/pages/account-settings', element: <AccountSetting /> },
   

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];


export default Router;
