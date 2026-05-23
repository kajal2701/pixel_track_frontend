import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Checkbox } from '@mui/material';
import DataTable from '../../../../../components/shared/DataTable';
import { formatDate } from '../../../../../utils/helpers';

const CompletedOrdersTable = ({
  filteredOrders,
  selectedOrderIds,
  setSelectedOrderIds,
}) => {
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredOrders.map((n) => n.id);
      setSelectedOrderIds(newSelecteds);
      return;
    }
    setSelectedOrderIds([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedOrderIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedOrderIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedOrderIds.slice(1));
    } else if (selectedIndex === selectedOrderIds.length - 1) {
      newSelected = newSelected.concat(selectedOrderIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedOrderIds.slice(0, selectedIndex),
        selectedOrderIds.slice(selectedIndex + 1),
      );
    }

    setSelectedOrderIds(newSelected);
  };

  const columns = [
    {
      field: 'checkbox',
      label: (
        <Checkbox
          id="chk-select-all-orders"
          color="primary"
          indeterminate={selectedOrderIds.length > 0 && selectedOrderIds.length < filteredOrders.length}
          checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
          onChange={handleSelectAllClick}
        />
      ),
      width: '5%',
    },
    {
      field: 'order_id',
      label: 'Order ID',
      bold: true,
      width: '12%',
    },
    {
      field: 'company_name',
      label: 'Company Name',
      width: '15%',
    },
    {
      field: 'color',
      label: 'Color',
      width: '12%',
    },
    {
      field: 'channel_type',
      label: 'Channel',
      width: '12%',
    },
    {
      field: 'total_length',
      label: 'Total Length',
      width: '12%',
    },
    {
      field: 'final_length',
      label: 'Final Length',
      bold: true,
      width: '12%',
    },
    {
      field: 'completion_date',
      label: 'Date',
      width: '12%',
    },
    {
      field: 'status',
      label: 'Status',
      width: '8%',
    },
  ];

  const rows = filteredOrders.map((order) => {
    const isSelected = selectedOrderIds.indexOf(order.id) !== -1;
    return {
      ...order,
      checkbox: (
        <Checkbox
          id={`chk-select-order-${order.id}`}
          color="primary"
          checked={isSelected}
          onChange={(event) => handleClick(event, order.id)}
        />
      ),
      order_id: order.order_id,
      company_name: order.company_name || 'N/A',
      color: order.color || '—',
      channel_type: order.channel_type || '—',
      total_length: order.total_length ? `${order.total_length} ft` : '—',
      final_length: order.final_length ? `${order.final_length} ft` : '—',
      completion_date: formatDate(order.updated_at || order.created_at),
      status: (
        <Typography variant="body2" fontWeight={600} color="success.main">
          {order.order_status}
        </Typography>
      ),
    };
  });

  return (
    <DataTable
      rows={rows}
      columns={columns}
      defaultRows={10}
      emptyMessage="No completed orders found waiting for invoice."
    />
  );
};

CompletedOrdersTable.propTypes = {
  filteredOrders: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedOrderIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  setSelectedOrderIds: PropTypes.func.isRequired,
};

export default CompletedOrdersTable;
