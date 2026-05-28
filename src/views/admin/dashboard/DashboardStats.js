import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ShoppingCart,
  CheckCircle,
  LocalShipping,
  Warning,
} from '@mui/icons-material';

const DashboardStats = ({ stats }) => {
  const { palette } = useTheme();

  const cards = [
    { title: 'Total Orders', value: stats.totalOrders, color: palette.primary.main, icon: ShoppingCart },
    { title: 'Completed Orders', value: stats.completedOrders, color: palette.success.main, icon: CheckCircle },
    { title: 'Processing Orders', value: stats.processingOrders, color: palette.info.main, icon: LocalShipping },
    { title: 'Pending Orders', value: stats.pendingOrders, color: palette.warning.main, icon: Warning },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ backgroundColor: card.color, color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <card.icon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {card.value}
              </Typography>
              <Typography variant="body2">{card.title}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;
