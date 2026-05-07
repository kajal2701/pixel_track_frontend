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
  IconShoppingCart,
  IconUsers,
} from '@tabler/icons';

import { uniqueId } from 'lodash';

// Get user type from localStorage
const getUserType = () => localStorage.getItem('userType');

// Admin menu items
const buildAdminMenuItems = () => {
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const role = adminData.role;
  const isSuperAdmin = role === 'superadmin';
  const isProductionTech = role === 'production tech';

  // Production Tech gets a restricted menu
  if (isProductionTech) {
    return [
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
            title: 'Add Production',
            icon: IconPoint,
            href: '/admin/production/new',
          },
        ],
      },
    ];
  }

  // Standard Admin / Superadmin gets the full menu
  const items = [
    {
      id: uniqueId(),
      title: 'Orders',
      icon: IconBorderAll,
      href: '/admin/orders',
    },
  ];

  // Users menu — only visible for superadmin
  if (isSuperAdmin) {
    items.push({
      id: uniqueId(),
      title: 'Users',
      icon: IconUsers,
      href: '/admin/users',
      children: [
        {
          id: uniqueId(),
          title: 'User List',
          icon: IconPoint,
          href: '/admin/users',
        },
        {
          id: uniqueId(),
          title: 'Add User',
          icon: IconPoint,
          href: '/admin/users/new',
        },
      ],
    });
  }

  // Add the rest of the standard admin menus
  items.push(
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
          title: 'Add Inventory',
          icon: IconPoint,
          href: '/admin/inventory/new',
        },
      ],
    },
    {
      id: uniqueId(),
      title: 'Products',
      icon: IconShoppingCart,
      href: '/admin/products',
      children: [
        {
          id: uniqueId(),
          title: 'Product List',
          icon: IconPoint,
          href: '/admin/products',
        },
        {
          id: uniqueId(),
          title: 'Add Product',
          icon: IconPoint,
          href: '/admin/products/new',
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
          title: 'Add Production',
          icon: IconPoint,
          href: '/admin/production/new',
        },
      ],
    }
  );



  return items;
};

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
      return buildAdminMenuItems();
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
