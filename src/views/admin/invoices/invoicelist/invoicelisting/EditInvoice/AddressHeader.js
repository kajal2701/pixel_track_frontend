import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatDate, PIXEL_TRACK } from 'src/utils/helpers';
import Logo from 'src/assets/images/logos/logo.png';
const AddressHeader = ({ invoice }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 4,
      mb: 5,
      alignItems: 'start',
    }}
  >
    {/* FROM — left */}
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" color="text.secondary" mb={0.5} sx={{ fontSize: '0.9rem' }}>
        From,
      </Typography>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.4, fontSize: '0.95rem' }}>
        {PIXEL_TRACK.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>{PIXEL_TRACK.address}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>{PIXEL_TRACK.city}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>{PIXEL_TRACK.province}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>{PIXEL_TRACK.email}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>{PIXEL_TRACK.phone}</Typography>
    </Box>

    {/* TO — right */}
    <Box sx={{ width: '100%', textAlign: 'right' }}>
      <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
        <img src={Logo} alt="Pixel Track" style={{ height: 48, objectFit: 'contain' }} />
      </Box>

      <Typography variant="body2" color="text.secondary" mb={0.5} sx={{ fontSize: '0.9rem' }}>To,</Typography>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.4, fontSize: '0.95rem' }}>
        {invoice.contact_name || '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>{invoice.company_name || '—'}</Typography>
      {invoice.email && (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Email ID : {invoice.email}</Typography>
      )}
      {invoice.phone && (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Phone No : {invoice.phone}</Typography>
      )}
      <Typography variant="body2" color="text.secondary" mt={0.8} sx={{ fontSize: '0.9rem' }}>
        Invoice Date : {formatDate(invoice.created_at)}
      </Typography>
    </Box>
  </Box>
);

export default AddressHeader;
