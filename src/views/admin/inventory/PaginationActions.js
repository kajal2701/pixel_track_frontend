import React from 'react';
import { Box, IconButton } from '@mui/material';
import {
  FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight
} from '@mui/icons-material';

const PaginationActions = ({ count, page, rowsPerPage, onPageChange }) => (
  <Box sx={{ flexShrink: 0, ml: 2.5 }}>
    <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
      <FirstPage />
    </IconButton>
    <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
      <KeyboardArrowLeft />
    </IconButton>
    <IconButton onClick={(e) => onPageChange(e, page + 1)} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
      <KeyboardArrowRight />
    </IconButton>
    <IconButton onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
      <LastPage />
    </IconButton>
  </Box>
);

export default PaginationActions;
