import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import ChildCard from '../../../../../components/shared/ChildCard';

const InvoiceStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Invoices',
      amount: stats.total,
      count: stats.totalCount,
      color: 'primary.main',
    },
    {
      title: 'Paid',
      amount: stats.paid,
      count: stats.paidCount,
      color: 'success.main',
    },
    {
      title: 'Sent',
      amount: stats.sent,
      count: stats.sentCount,
      color: 'info.main',
    },
    {
      title: 'Payment Submitted',
      amount: stats.paymentSubmitted,
      count: stats.paymentSubmittedCount,
      color: 'primary.main',
    },
    {
      title: stats.draftLabel,
      amount: stats.draftVal,
      count: stats.draftCount,
      color: stats.draftColor,
    },
  ];

  return (
    <Grid container spacing={3} mb={3}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md key={index}>
          <ChildCard title={card.title}>
            <Typography variant="h4" fontWeight="600" color={card.color}>
              ${card.amount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {card.count} invoices
            </Typography>
          </ChildCard>
        </Grid>
      ))}
    </Grid>
  );
};

InvoiceStats.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    paid: PropTypes.number.isRequired,
    paidCount: PropTypes.number.isRequired,
    sent: PropTypes.number.isRequired,
    sentCount: PropTypes.number.isRequired,
    paymentSubmitted: PropTypes.number.isRequired,
    paymentSubmittedCount: PropTypes.number.isRequired,
    draftLabel: PropTypes.string.isRequired,
    draftColor: PropTypes.string.isRequired,
    draftVal: PropTypes.number.isRequired,
    draftCount: PropTypes.number.isRequired,
  }).isRequired,
};

export default InvoiceStats;
