import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));

/* ****Apps***** */
const Calendar = Loadable(lazy(() => import('../views/apps/calendar/BigCalendar')));
const Email = Loadable(lazy(() => import('../views/apps/email/Email')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));

// Pages
const RollbaseCASL = Loadable(lazy(() => import('../views/pages/rollbaseCASL/RollbaseCASL')));
const Treeview = Loadable(lazy(() => import('../views/pages/treeview/Treeview')));
const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing')));
const AccountSetting = Loadable(
  lazy(() => import('../views/pages/account-setting/AccountSetting')),
);
const Faq = Loadable(lazy(() => import('../views/pages/faq/Faq')));

// widget
const WidgetCards = Loadable(lazy(() => import('../views/widgets/cards/WidgetCards')));
const WidgetBanners = Loadable(lazy(() => import('../views/widgets/banners/WidgetBanners')));
const WidgetCharts = Loadable(lazy(() => import('../views/widgets/charts/WidgetCharts')));

// form elements
const MuiAutoComplete = Loadable(
  lazy(() => import('../views/forms/form-elements/MuiAutoComplete')),
);
const MuiButton = Loadable(lazy(() => import('../views/forms/form-elements/MuiButton')));
const MuiCheckbox = Loadable(lazy(() => import('../views/forms/form-elements/MuiCheckbox')));
const MuiRadio = Loadable(lazy(() => import('../views/forms/form-elements/MuiRadio')));
const MuiSlider = Loadable(lazy(() => import('../views/forms/form-elements/MuiSlider')));
const MuiDateTime = Loadable(lazy(() => import('../views/forms/form-elements/MuiDateTime')));
const MuiSwitch = Loadable(lazy(() => import('../views/forms/form-elements/MuiSwitch')));

// form layout
const FormLayouts = Loadable(lazy(() => import('../views/forms/FormLayouts')));
const FormCustom = Loadable(lazy(() => import('../views/forms/FormCustom')));
const FormWizard = Loadable(lazy(() => import('../views/forms/FormWizard')));
const FormValidation = Loadable(lazy(() => import('../views/forms/FormValidation')));
const QuillEditor = Loadable(lazy(() => import('../views/forms/quill-editor/QuillEditor')));
const FormHorizontal = Loadable(lazy(() => import('../views/forms/FormHorizontal')));
const FormVertical = Loadable(lazy(() => import('../views/forms/FormVertical')));

// tables
const BasicTable = Loadable(lazy(() => import('../views/tables/BasicTable')));
const CollapsibleTable = Loadable(lazy(() => import('../views/tables/CollapsibleTable')));
const EnhancedTable = Loadable(lazy(() => import('../views/tables/EnhancedTable')));
const FixedHeaderTable = Loadable(lazy(() => import('../views/tables/FixedHeaderTable')));
const PaginationTable = Loadable(lazy(() => import('../views/tables/PaginationTable')));
const SearchTable = Loadable(lazy(() => import('../views/tables/SearchTable')));

// ui
const MuiAlert = Loadable(lazy(() => import('../views/ui-components/MuiAlert')));
const MuiAccordion = Loadable(lazy(() => import('../views/ui-components/MuiAccordion')));
const MuiAvatar = Loadable(lazy(() => import('../views/ui-components/MuiAvatar')));
const MuiChip = Loadable(lazy(() => import('../views/ui-components/MuiChip')));
const MuiDialog = Loadable(lazy(() => import('../views/ui-components/MuiDialog')));
const MuiList = Loadable(lazy(() => import('../views/ui-components/MuiList')));
const MuiPopover = Loadable(lazy(() => import('../views/ui-components/MuiPopover')));
const MuiRating = Loadable(lazy(() => import('../views/ui-components/MuiRating')));
const MuiTabs = Loadable(lazy(() => import('../views/ui-components/MuiTabs')));
const MuiTooltip = Loadable(lazy(() => import('../views/ui-components/MuiTooltip')));
const MuiTransferList = Loadable(lazy(() => import('../views/ui-components/MuiTransferList')));
const MuiTypography = Loadable(lazy(() => import('../views/ui-components/MuiTypography')));

// ── Authentication ─────────────────────────────────────────────────────────
const LoginAdminOnly = Loadable(lazy(() => import('../views/authentication/auth2/LoginAdminOnly')));
const LoginCustomerOrderPortal = Loadable(lazy(() => import('../views/authentication/auth2/LoginCustomerOrderPortal')));
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2')),
);
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

// ── NEW: Admin pages ───────────────────────────────────────────────────────

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
const PlaceOrder    = Loadable(lazy(() => import('../views/order/PlaceOrder')));
// const OrderHistory  = Loadable(lazy(() => import('../views/order/OrderHistory')));

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
      // { path: '/admin/dashboard',      element: <Dashboard /> },
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
      // { path: '/order/history',        element: <OrderHistory /> },

      // ── EXISTING: kept exactly as before ──────────────────────────────
      { path: '/dashboards/modern', exact: true, element: <ModernDash /> },
      { path: '/apps/calendar',     element: <Calendar /> },
      { path: '/apps/email',        element: <Email /> },
      { path: '/apps/tickets',      element: <Tickets /> },
      { path: '/user-profile',      element: <UserProfile /> },
      { path: '/pages/casl',        element: <RollbaseCASL /> },
      { path: '/pages/treeview',    element: <Treeview /> },
      { path: '/pages/pricing',     element: <Pricing /> },
      { path: '/pages/account-settings', element: <AccountSetting /> },
      { path: '/pages/faq',         element: <Faq /> },
      { path: '/forms/form-elements/autocomplete', element: <MuiAutoComplete /> },
      { path: '/forms/form-elements/button',       element: <MuiButton /> },
      { path: '/forms/form-elements/checkbox',     element: <MuiCheckbox /> },
      { path: '/forms/form-elements/radio',        element: <MuiRadio /> },
      { path: '/forms/form-elements/slider',       element: <MuiSlider /> },
      { path: '/forms/form-elements/date-time',    element: <MuiDateTime /> },
      { path: '/forms/form-elements/switch',       element: <MuiSwitch /> },
      { path: '/forms/quill-editor',               element: <QuillEditor /> },
      { path: '/forms/form-layouts',               element: <FormLayouts /> },
      { path: '/forms/form-horizontal',            element: <FormHorizontal /> },
      { path: '/forms/form-vertical',              element: <FormVertical /> },
      { path: '/forms/form-custom',                element: <FormCustom /> },
      { path: '/forms/form-wizard',                element: <FormWizard /> },
      { path: '/forms/form-validation',            element: <FormValidation /> },
      { path: '/tables/basic',                     element: <BasicTable /> },
      { path: '/tables/collapsible',               element: <CollapsibleTable /> },
      { path: '/tables/enhanced',                  element: <EnhancedTable /> },
      { path: '/tables/fixed-header',              element: <FixedHeaderTable /> },
      { path: '/tables/pagination',                element: <PaginationTable /> },
      { path: '/tables/search',                    element: <SearchTable /> },
      { path: '/ui-components/alert',              element: <MuiAlert /> },
      { path: '/ui-components/accordion',          element: <MuiAccordion /> },
      { path: '/ui-components/avatar',             element: <MuiAvatar /> },
      { path: '/ui-components/chip',               element: <MuiChip /> },
      { path: '/ui-components/dialog',             element: <MuiDialog /> },
      { path: '/ui-components/list',               element: <MuiList /> },
      { path: '/ui-components/popover',            element: <MuiPopover /> },
      { path: '/ui-components/rating',             element: <MuiRating /> },
      { path: '/ui-components/tabs',               element: <MuiTabs /> },
      { path: '/ui-components/tooltip',            element: <MuiTooltip /> },
      { path: '/ui-components/transfer-list',      element: <MuiTransferList /> },
      { path: '/ui-components/typography',         element: <MuiTypography /> },
      { path: '/widgets/cards',                    element: <WidgetCards /> },
      { path: '/widgets/banners',                  element: <WidgetBanners /> },
      { path: '/widgets/charts',                   element: <WidgetCharts /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;