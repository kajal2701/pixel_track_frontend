import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Tab, Tabs, CircularProgress, Stack
} from '@mui/material';
import { ReceiptLong } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../../../components/container/PageContainer';
import ParentCard from '../../../../components/shared/ParentCard';
import invoiceService from '../../../../services/invoiceService';
import orderService from '../../../../services/orderService';
import { encodeInvoiceId } from '../../../../utils/helpers';

import InvoiceFilters from './invoicelisting/InvoiceFilters';
import InvoiceStats from './invoicelisting/InvoiceStats';
import CompletedOrdersTable from './completedorders/CompletedOrdersTable';
import InvoicesTable from './invoicelisting/InvoicesTable';
import SendInvoiceDialog from './invoicelisting/SendInvoiceDialog';
import GenerateInvoiceDialog from './completedorders/GenerateInvoiceDialog';

const Invoices = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // ── Data state ─────────────────────────────────────────────
  const [completedOrders, setCompletedOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');

  // Tab control: 0 = Completed Orders, 1 = Invoices
  const [activeTab, setActiveTab] = useState(0);

  // Checkbox selection for completed orders
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Generate invoice dialog
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);

  // Send invoice confirmation dialog state
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [invoiceToSend, setInvoiceToSend] = useState(null);

  // ── Fetch data ──────────────────────────────────────────────
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchCompletedOrders(), fetchInvoices()]);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedOrders = async () => {
    try {
      const res = await orderService.getAllOrders();
      const completed = (res.data || []).filter(o => o.order_status === 'Completed' && !o.invoice_id);
      setCompletedOrders(completed);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch completed orders.');
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await invoiceService.getAll();
      setInvoices(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch invoices.');
    }
  };

  // Customers list built from both lists
  const uniqueCustomers = Array.from(
    new Set([
      ...completedOrders.map((o) => o.company_name),
      ...invoices.map((inv) => inv.company_name),
    ].filter(Boolean))
  );
  uniqueCustomers.sort();

  // ── Filter + Search ─────────────────────────────────────────
  const filteredOrders = completedOrders.filter((order) => {
    // Customer filter
    if (filterCustomer !== 'all' && order.company_name !== filterCustomer) return false;

    // Search filter
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return [
      order.order_id,
      order.company_name,
      order.contact_name,
      order.color,
      order.channel_type,
    ].some((f) => f?.toString().toLowerCase().includes(term));
  });

  const filteredInvoices = invoices.filter((inv) => {
    // Status filter
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false;

    // Customer filter
    if (filterCustomer !== 'all' && inv.company_name !== filterCustomer) return false;

    // Search filter
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return [
      inv.invoice_number,
      inv.order_number,
      inv.company_name,
      inv.contact_name,
      inv.color,
      inv.status,
    ].some((f) => f?.toString().toLowerCase().includes(term));
  });

  // ── Summary stats ───────────────────────────────────────────
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
  const paidAmount = filteredInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
  const sentAmount = filteredInvoices
    .filter((inv) => inv.status === 'Sent')
    .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
  const draftAmount = filteredInvoices
    .filter((inv) => inv.status === 'Draft')
    .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
  const paymentSubmittedAmount = filteredInvoices
    .filter((inv) => inv.status === 'Payment Submitted')
    .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);

  const stats = activeTab === 0
    ? {
      total: 0,
      totalCount: filteredOrders.length,
      paid: 0,
      paidCount: 0,
      sent: 0,
      sentCount: 0,
      paymentSubmitted: 0,
      paymentSubmittedCount: 0,
      draftColor: 'info.main',
      draftLabel: 'Completed',
      draftVal: 0,
      draftCount: filteredOrders.length,
    }
    : {
      total: totalAmount,
      totalCount: filteredInvoices.length,
      paid: paidAmount,
      paidCount: filteredInvoices.filter((inv) => inv.status === 'Paid').length,
      sent: sentAmount,
      sentCount: filteredInvoices.filter((inv) => inv.status === 'Sent').length,
      paymentSubmitted: paymentSubmittedAmount,
      paymentSubmittedCount: filteredInvoices.filter((inv) => inv.status === 'Payment Submitted').length,
      draftColor: 'warning.main',
      draftLabel: 'Draft',
      draftVal: draftAmount,
      draftCount: filteredInvoices.filter((inv) => inv.status === 'Draft').length,
    };

  // ── Action handlers (Invoices) ──────────────────────────────
  const handleEditInvoice = (invoice) => {
    navigate(`/admin/invoices/edit/${invoice.id}`);
  };

  const handleViewInvoice = (invoice) => {
    const encodedToken = encodeInvoiceId(invoice.id);
    navigate(`/view-invoice/${encodedToken}`);
  };

  const handleSendInvoice = async (invoiceId) => {
    try {
      await invoiceService.updateStatus(invoiceId, 'Sent');
      toast.success('Invoice sent to customer successfully');
      fetchInvoices();
    } catch (err) {
      toast.error(err.message || 'Failed to send invoice.');
    }
  };

  const handleOpenSendDialog = (item) => {
    setInvoiceToSend(item);
    setOpenSendDialog(true);
  };

  const handleCloseSendDialog = () => {
    setOpenSendDialog(false);
    setInvoiceToSend(null);
  };

  const handleConfirmSend = async () => {
    if (!invoiceToSend) return;
    const targetId = invoiceToSend.id;
    handleCloseSendDialog();
    await handleSendInvoice(targetId);
  };

  // ── Generate Invoice ──
  const handleOpenGenerateDialog = () => {
    if (selectedOrderIds.length > 1) {
      const selectedCustomerIds = new Set();
      selectedOrderIds.forEach(id => {
        const order = completedOrders.find(o => o.id === id);
        if (order && order.customer_id) {
          selectedCustomerIds.add(order.customer_id);
        }
      });
      if (selectedCustomerIds.size > 1) {
        toast.error('Cannot generate an invoice for multiple customers. Please select orders from the same customer.');
        return;
      }
    }
    setOpenGenerateDialog(true);
  };

  const handleCloseGenerateDialog = () => {
    setOpenGenerateDialog(false);
  };

  const handleConfirmGenerate = async () => {
    setOpenGenerateDialog(false);
    try {
      await invoiceService.generate(selectedOrderIds);
      toast.success(`Invoice generated for ${selectedOrderIds.length} order(s)`);
      setSelectedOrderIds([]);
      // Refresh both tabs
      await Promise.all([fetchCompletedOrders(), fetchInvoices()]);
    } catch (err) {
      toast.error(err.message || 'Failed to generate invoice.');
    }
  };

  return (
    <PageContainer title="Invoice Management" description="Manage customer invoices and payments">
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>Invoice Management</Typography>
      </Stack>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          id="invoice-tabs"
          value={activeTab}
          onChange={(e, val) => {
            setActiveTab(val);
            setSelectedOrderIds([]);
            setSearchTerm('');
            setFilterCustomer('all');
            setFilterStatus('all');
          }}
          aria-label="invoice tabs"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              minWidth: 160
            }
          }}
        >
          <Tab id="tab-completed-orders" label={`Completed Orders (${completedOrders.length})`} />
          <Tab id="tab-invoices" label={`Invoices (${invoices.length})`} />
        </Tabs>
      </Box>

      {/* Search and Filter Bar */}
      <InvoiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCustomer={filterCustomer}
        onCustomerChange={setFilterCustomer}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        customers={uniqueCustomers}
        activeTab={activeTab}
      />

      {/* Invoice Summary Cards — only show on Invoices tab */}
      {activeTab === 1 && (
        <InvoiceStats stats={stats} />
      )}

      {/* Table */}
      <ParentCard title={activeTab === 0 ? "Completed Orders" : "Invoices"}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : activeTab === 0 ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                id="btn-generate-invoice"
                variant="contained"
                color="secondary"
                disabled={selectedOrderIds.length === 0}
                onClick={handleOpenGenerateDialog}
                startIcon={<ReceiptLong />}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  boxShadow: selectedOrderIds.length > 0 ? theme.shadows[4] : 'none',
                  '&:hover': {
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                Generate Invoice {selectedOrderIds.length > 0 ? `(${selectedOrderIds.length})` : ''}
              </Button>
            </Box>
            <CompletedOrdersTable
              filteredOrders={filteredOrders}
              selectedOrderIds={selectedOrderIds}
              setSelectedOrderIds={setSelectedOrderIds}
            />
          </>
        ) : (
          <InvoicesTable
            filteredInvoices={filteredInvoices}
            onEdit={handleEditInvoice}
            onView={handleViewInvoice}
            onSend={(invoice) => handleOpenSendDialog(invoice)}
          />
        )}
      </ParentCard>

      {/* Send Confirmation Dialog */}
      <SendInvoiceDialog
        open={openSendDialog}
        onClose={handleCloseSendDialog}
        onConfirm={handleConfirmSend}
        invoiceNumber={invoiceToSend?.invoice_number || ''}
        companyName={invoiceToSend?.company_name || ''}
        totalAmount={invoiceToSend ? `$${parseFloat(invoiceToSend.total_amount || 0).toFixed(2)}` : ''}
        isCombo={false}
      />
      {/* Generate Invoice Confirmation Dialog */}
      <GenerateInvoiceDialog
        open={openGenerateDialog}
        onClose={handleCloseGenerateDialog}
        selectedOrders={completedOrders.filter(o => selectedOrderIds.includes(o.id))}
        onConfirm={handleConfirmGenerate}
      />
    </PageContainer>
  );
};

export default Invoices;
