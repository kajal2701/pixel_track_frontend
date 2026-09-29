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
      width: '50px',
    },
    {
      field: 'order_id',
      label: 'Order ID',
      bold: true,
      width: '150px',
      minWidth: '150px',
    },
    {
      field: 'customer_tag',
      label: 'Customer Tag',
      width: '150px',
      minWidth: '150px',
    },
    {
      field: 'company_name',
      label: 'Company Name',
      width: '160px',
    },
    {
      field: 'pickup_date',
      label: 'Pick Up Date',
      width: '150px',
      minWidth: '150px',
      sortValue: (row) => row.pickup_date_raw || '',
    },
    { field: 'color', label: 'Color', type: 'chip', chipColor: () => 'info', width: '250px', minWidth: '250px' },
    {
      field: 'channel_type',
      label: 'Channel',
      width: '120px',
    },
    {
      field: 'total_length',
      label: 'Total Length',
      width: '120px',
      sortType: 'numeric',
    },
    {
      field: 'final_length',
      label: 'Final Length',
      bold: true,
      width: '120px',
      sortType: 'numeric',
    },
    {
      field: 'completion_date',
      label: 'Order Complete Date',
      width: '180px',
      minWidth: '180px',
    },
    {
      field: 'status',
      label: 'Status',
      width: '100px',
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
      customer_tag: order.customer_tag || '-',
      company_name: order.company_name || 'N/A',
      color: order.color || '—',
      channel_type: order.channel_type || '—',
      total_length: order.total_length ? `${order.total_length} ft` : '—',
      final_length: order.final_length ? `${order.final_length} ft` : '—',
      completion_date: formatDate(order.updated_at || order.created_at),
      pickup_date: order.pickup_date ? formatDate(order.pickup_date) : '—',
      pickup_date_raw: order.pickup_date || '',
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
