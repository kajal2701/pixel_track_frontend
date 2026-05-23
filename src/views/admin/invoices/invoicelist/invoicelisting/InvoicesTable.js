import React from 'react';
import PropTypes from 'prop-types';
import { Stack, IconButton, Chip } from '@mui/material';
import { Edit, Send, Visibility } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import DataTable from '../../../../../components/shared/DataTable';
import { getInvoiceStatusColor, formatDate } from '../../../../../utils/helpers';

const InvoicesTable = ({
  filteredInvoices,
  onEdit,
  onView,
  onSend,
}) => {
  const theme = useTheme();
  const { palette } = theme;

  const columns = [
    {
      field: 'invoice_number',
      label: 'Invoice #',
      bold: true,
      width: '18%',
    },

    {
      field: 'company_name',
      label: 'Company Name',
      width: '16%',
    },
    {
      field: 'contact_name',
      label: 'Contact Person',
      muted: true,
      width: '14%',
    },
    {
      field: 'created_at',
      label: 'Date',
      width: '10%',
    },
    {
      field: 'total_amount',
      label: 'Total',
      bold: true,
      width: '10%',
    },
    {
      field: 'status',
      label: 'Status',
      type: 'chip',
      chipColor: getInvoiceStatusColor,
      width: '10%',
    },
    {
      field: 'actions',
      label: 'Actions',
      width: '10%',
    },
  ];

  const rows = filteredInvoices.map((invoice) => ({
    ...invoice,
    created_at: formatDate(invoice.created_at),
    total_amount: `$${parseFloat(invoice.total_amount || 0).toFixed(2)}`,
    actions: (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        <IconButton
          id={`btn-edit-invoice-${invoice.id}`}
          size="small"
          sx={{ color: palette.warning.main }}
          onClick={() => onEdit(invoice)}
          title="Edit Invoice"
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          id={`btn-view-invoice-${invoice.id}`}
          size="small"
          sx={{ color: palette.info.main }}
          onClick={() => onView(invoice)}
          title="View Invoice"
        >
          <Visibility fontSize="small" />
        </IconButton>
        {invoice.status === 'Draft' && (
          <IconButton
            id={`btn-send-invoice-${invoice.id}`}
            size="small"
            sx={{ color: palette.success.main }}
            onClick={() => onSend(invoice)}
            title="Send to Customer"
          >
            <Send fontSize="small" />
          </IconButton>
        )}
      </Stack>
    ),
  }));

  return <DataTable rows={rows} columns={columns} defaultRows={10} emptyMessage="No invoices found." />;
};

InvoicesTable.propTypes = {
  filteredInvoices: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default InvoicesTable;
