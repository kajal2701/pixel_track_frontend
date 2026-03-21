import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Typography, TableHead, Chip, Box, Table, TableBody,
  TableCell, TablePagination, TableRow, TableFooter,
  IconButton, Paper, TableContainer, Avatar, Stack,
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const theme = useTheme();
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const renderCell = (col, row) => {
  // Custom render function — highest priority
  if (col.render) return col.render(row);

  const value = row[col.field];

  if (col.type === 'avatar') {
    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={row[col.avatarField]} alt={value} sx={{ width: 32, height: 32 }} />
        <Typography variant="h6" fontWeight="600">{value}</Typography>
      </Stack>
    );
  }

  if (col.type === 'chip') {
    const color = col.chipColor ? col.chipColor(value) : 'default';
    return <Chip label={value} color={color} size="small" sx={{ borderRadius: '6px' }} />;
  }

  if (col.prefix) {
    return (
      <Typography color="textSecondary" variant="h6" fontWeight="400">
        {col.prefix}{value}
      </Typography>
    );
  }

  // If value is already a React element (e.g. actions passed as JSX), render directly
  if (React.isValidElement(value)) return value;

  return (
    <Typography
      variant="h6"
      fontWeight={col.bold ? '600' : '400'}
      color={col.muted ? 'textSecondary' : 'inherit'}
    >
      {value}
    </Typography>
  );
};

const DataTable = ({ rows = [], columns = [], defaultRows = 5 }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRows);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const visibleRows = rowsPerPage > 0
    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rows;

  return (
    <Paper variant="outlined">
      {/* ↓ No minWidth, no whiteSpace:nowrap — table stays within container */}
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }} aria-label="data table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ width: col.width, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Typography variant="h6">{col.label}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, rowIdx) => (
              <TableRow key={row.id ?? rowIdx} hover>
                {columns.map((col) => (
                  <TableCell key={col.field} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {renderCell(col, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={columns.length}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{ native: true }}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
};

DataTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field:       PropTypes.string.isRequired,
      label:       PropTypes.string.isRequired,
      type:        PropTypes.oneOf(['text', 'avatar', 'chip']),
      render:      PropTypes.func,
      avatarField: PropTypes.string,
      chipColor:   PropTypes.func,
      prefix:      PropTypes.string,
      bold:        PropTypes.bool,
      muted:       PropTypes.bool,
      width:       PropTypes.string,
      align:       PropTypes.string,
    })
  ).isRequired,
  defaultRows: PropTypes.number,
};

export default DataTable;