import React from 'react';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../components/shared/ParentCard';
import DataTable from '../../../components/shared/DataTable';

import img1 from '../../../assets/images/profile/user-1.jpg';
import img2 from '../../../assets/images/profile/user-2.jpg';
import img3 from '../../../assets/images/profile/user-3.jpg';
import img4 from '../../../assets/images/profile/user-4.jpg';
import img5 from '../../../assets/images/profile/user-5.jpg';

// ── Column definitions ─────────────────────────────────────────
const columns = [
  {
    field: 'orderno',
    label: 'Order No.',
    bold: true,
  },
  {
    field: 'customer',
    label: 'Customer',
    type: 'avatar',
    avatarField: 'imgsrc',   // row key that holds the avatar src
  },
  {
    field: 'items',
    label: 'Items',
    muted: true,
  },
  {
    field: 'total',
    label: 'Total',
    prefix: '$',
    muted: true,
  },
  {
    field: 'date',
    label: 'Date',
  },
  {
    field: 'status',
    label: 'Status',
    type: 'chip',
    chipColor: (value) => {
      if (value === 'Completed') return 'success';
      if (value === 'Pending')   return 'warning';
      if (value === 'Cancel')    return 'error';
      return 'default';
    },
  },
];

// ── Data ───────────────────────────────────────────────────────
const rows = [
  { id: 1,  orderno: 'ORD-0120145', customer: 'Sunil Joshi',        imgsrc: img1, items: '5',  total: '550,000', status: 'Completed', date: '10 Jun, 2021 09:51:40' },
  { id: 2,  orderno: 'ORD-0120146', customer: 'John Deo',           imgsrc: img2, items: '1',  total: '45,000',  status: 'Pending',   date: '10 Jun, 2021 07:46:00' },
  { id: 3,  orderno: 'ORD-0120460', customer: 'Mily Peter',         imgsrc: img3, items: '3',  total: '57,000',  status: 'Cancel',    date: '10 Jun, 2021 04:19:38' },
  { id: 4,  orderno: 'ORD-0124060', customer: 'Andrew McDownland',  imgsrc: img4, items: '11', total: '457,000', status: 'Completed', date: '10 Jun, 2021 04:12:29' },
  { id: 5,  orderno: 'ORD-0124568', customer: 'Christopher Jamil',  imgsrc: img5, items: '4',  total: '120,000', status: 'Pending',   date: '15 Apr, 2021 04:12:50' },
  { id: 6,  orderno: 'ORD-0120147', customer: 'John Deo',           imgsrc: img2, items: '1',  total: '45,000',  status: 'Pending',   date: '10 Jun, 2021 07:46:00' },
  { id: 7,  orderno: 'ORD-0120461', customer: 'Mily Peter',         imgsrc: img3, items: '3',  total: '57,000',  status: 'Cancel',    date: '10 Jun, 2021 04:19:38' },
  { id: 8,  orderno: 'ORD-0124061', customer: 'Andrew McDownland',  imgsrc: img4, items: '11', total: '457,000', status: 'Completed', date: '10 Jun, 2021 04:12:29' },
  { id: 9,  orderno: 'ORD-0124569', customer: 'Christopher Jamil',  imgsrc: img5, items: '4',  total: '120,000', status: 'Pending',   date: '15 Apr, 2021 04:12:50' },
  { id: 10, orderno: 'ORD-0120148', customer: 'Sunil Joshi',        imgsrc: img1, items: '5',  total: '550,000', status: 'Completed', date: '10 Jun, 2021 09:51:40' },
  { id: 11, orderno: 'ORD-0124062', customer: 'Andrew McDownland',  imgsrc: img4, items: '11', total: '457,000', status: 'Completed', date: '10 Jun, 2021 04:12:29' },
  { id: 12, orderno: 'ORD-0124570', customer: 'Christopher Jamil',  imgsrc: img5, items: '4',  total: '120,000', status: 'Pending',   date: '15 Apr, 2021 04:12:50' },
];

const BCrumb = [
  { to: '/admin/dashboard', title: 'Home' },
  { title: 'Orders' },
];

const Orders = () => (
  <PageContainer title="Orders" description="Admin orders list">
    <Breadcrumb title="Orders" items={BCrumb} />
    <ParentCard title="All Orders">
      <DataTable rows={rows} columns={columns} defaultRows={5} />
    </ParentCard>
  </PageContainer>
);

export default Orders;