import {
  IconPoint,
  IconAlertCircle,
  IconCalendar,
  IconMail,
  IconTicket,
  IconEdit,
  IconGitMerge,
  IconCurrencyDollar,
  IconApps,
  IconFileDescription,
  IconFileDots,
  IconFiles,
  IconBorderAll,
  IconBorderHorizontal,
  IconBorderInner,
  IconBorderVertical,
  IconBorderTop,
  IconUserCircle,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconBox,
  IconAperture,
  IconHelp,
  IconBoxAlignBottom,
  IconBoxAlignLeft,
  IconLayout,
  IconBorderStyle2,
  IconLockAccess,
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [


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

export default Menuitems;
