import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Loadable from '../layouts/full/shared/loadable/Loadable';

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
const ProductionList = Loadable(lazy(() => import('../views/admin/production/ProductionList')));
const ProductionNew  = Loadable(lazy(() => import('../views/admin/production/ProductionNew')));
const CustomerList  = Loadable(lazy(() => import('../views/admin/customers/CustomerList')));
const CustomerNew   = Loadable(lazy(() => import('../views/admin/customers/CustomerNew')));
const Invoices      = Loadable(lazy(() => import('../views/admin/invoices/Invoices')));
const Reports       = Loadable(lazy(() => import('../views/admin/reports/Reports')));

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
      { path: '/admin/dashboard',      element: <Dashboard /> },
      { path: '/admin/orders',         element: <Orders /> },
      { path: '/admin/inventory',      element: <InventoryList /> },
      { path: '/admin/inventory/new',  element: <InventoryNew /> },
      { path: '/admin/production',     element: <ProductionList /> },
      { path: '/admin/production/new', element: <ProductionNew /> },
      { path: '/admin/customers',      element: <CustomerList /> },
      { path: '/admin/customers/new',  element: <CustomerNew /> },
      { path: '/admin/invoices',       element: <Invoices /> },
      { path: '/admin/reports',        element: <Reports /> },

      // ── NEW: Customer order portal routes ──────────────────────────────
      { path: '/order/new',            element: <PlaceOrder /> },
      { path: '/order/history',        element: <OrderHistory /> },

      // ── EXISTING: kept exactly as before ──────────────────────────────
      { path: '/user-profile',      element: <UserProfile /> },
      { path: '/pages/account-settings', element: <AccountSetting /> },
   

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;