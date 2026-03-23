import {
  IconPoint,
  IconTicket,
  IconEdit,
  IconCurrencyDollar,
  IconFiles,
  IconBorderAll,
  IconUserCircle,
  IconBox,
  IconAperture,

} from '@tabler/icons';

import { uniqueId } from 'lodash';

// Get user type from localStorage
const getUserType = () => localStorage.getItem('userType');

// Admin menu items
const adminMenuItems = [
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconAperture,
    href: '/admin/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Orders',
    icon: IconBorderAll,
    href: '/admin/orders',
  },
  {
    id: uniqueId(),
    title: 'Inventory',
    icon: IconBox,
    href: '/admin/inventory',
    children: [
      {
        id: uniqueId(),
        title: 'Inventory List',
        icon: IconPoint,
        href: '/admin/inventory',
      },
      {
        id: uniqueId(),
        title: 'Add New',
        icon: IconPoint,
        href: '/admin/inventory/new',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Production',
    icon: IconFiles,
    href: '/admin/production',
    children: [
      {
        id: uniqueId(),
        title: 'Production List',
        icon: IconPoint,
        href: '/admin/production',
      },
      {
        id: uniqueId(),
        title: 'New Production',
        icon: IconPoint,
        href: '/admin/production/new',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Customers',
    icon: IconUserCircle,
    href: '/admin/customers',
    children: [
      {
        id: uniqueId(),
        title: 'Customer List',
        icon: IconPoint,
        href: '/admin/customers',
      },
      {
        id: uniqueId(),
        title: 'Add Customer',
        icon: IconPoint,
        href: '/admin/customers/new',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Invoices',
    icon: IconCurrencyDollar,
    href: '/admin/invoices',
  },
  {
    id: uniqueId(),
    title: 'Reports',
    icon: IconCurrencyDollar,
    href: '/admin/reports',
  },
];

// Customer menu items
const customerMenuItems = [
  {
    id: uniqueId(),
    title: 'Place New Order',
    icon: IconEdit,
    href: '/order/new',
  },
  {
    id: uniqueId(),
    title: 'My Orders',
    icon: IconTicket,
    href: '/order/history',
  },
];

// Function to get menu items based on user type
const getMenuItemsFunction = () => {
  const userType = getUserType();
  
  switch (userType) {
    case 'admin':
      return adminMenuItems;
    case 'customer':
      return customerMenuItems;
    default:
      // If no user type, return empty array or default items
      return [];
  }
};

// Export function to get menu items dynamically
export const getMenuItems = getMenuItemsFunction;

// For backward compatibility, export the current menu items
const Menuitems = getMenuItems();
export default Menuitems;
