import React from 'react';
import { Button } from '@mui/material';
import { FileDownload } from '@mui/icons-material';

const ExportButton = ({ onClick, loading, label = 'Export', ...props }) => (
  <Button
    variant="outlined"
    color="primary"
    startIcon={<FileDownload />}
    onClick={onClick}
    disabled={loading}
    sx={{ textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
    {...props}
  >
    {label}
  </Button>
);

export default ExportButton;
