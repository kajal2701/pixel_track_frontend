import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Typography,
  TableHead,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableFooter,
  IconButton,
  Paper,
  TableContainer,
  Avatar,
  Stack,
} from '@mui/material';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

// ── Pagination actions ─────────────────────────────────────────
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

// ── Column cell renderer ───────────────────────────────────────
const renderCell = (col, row) => {
  const value = row[col.field];

  // avatar + label combo
  if (col.type === 'avatar') {
    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={row[col.avatarField]} alt={value} sx={{ width: 32, height: 32 }} />
        <Typography variant="h6" fontWeight="600">{value}</Typography>
      </Stack>
    );
  }

  // chip / status
  if (col.type === 'chip') {
    const color = col.chipColor
      ? col.chipColor(value)
      : 'default';
    return (
      <Chip
        label={value}
        color={color}
        size="small"
        sx={{ borderRadius: '6px' }}
      />
    );
  }

  // prefix (e.g. currency symbol)
  if (col.prefix) {
    return (
      <Typography color="textSecondary" variant="h6" fontWeight="400">
        {col.prefix}{value}
      </Typography>
    );
  }

  // default text
  return (
    <Typography variant="h6" fontWeight={col.bold ? '600' : '400'} color={col.muted ? 'textSecondary' : 'inherit'}>
      {value}
    </Typography>
  );
};

// ── Main DataTable component ───────────────────────────────────
/**
 * DataTable — generic paginated table
 *
 * Props:
 *  rows        {Array}   — array of data objects
 *  columns     {Array}   — column definitions (see below)
 *  defaultRows {number}  — rows per page default (default: 5)
 *
 * Column definition:
 *  {
 *    field:       string,           // key in row object
 *    label:       string,           // header label
 *    type:        'text'            // plain text (default)
 *               | 'avatar'         // Avatar + text  (needs avatarField)
 *               | 'chip',          // MUI Chip       (needs chipColor fn)
 *    avatarField: string,           // row key for avatar src (type=avatar)
 *    chipColor:   (value) => color, // returns MUI color string (type=chip)
 *    prefix:      string,           // prepend string e.g. '$'
 *    bold:        boolean,          // bold text
 *    muted:       boolean,          // secondary text color
 *    width:       string,           // optional column width e.g. '120px'
 *  }
 */
const DataTable = ({ rows = [], columns = [], defaultRows = 5 }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRows);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = rowsPerPage > 0
    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rows;

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table sx={{ whiteSpace: 'nowrap' }} aria-label="data table">

          {/* Header */}
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ width: col.width }}>
                  <Typography variant="h6">{col.label}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {visibleRows.map((row, rowIdx) => (
              <TableRow key={row.id ?? rowIdx}>
                {columns.map((col) => (
                  <TableCell key={col.field}>
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

          {/* Pagination */}
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
      avatarField: PropTypes.string,
      chipColor:   PropTypes.func,
      prefix:      PropTypes.string,
      bold:        PropTypes.bool,
      muted:       PropTypes.bool,
      width:       PropTypes.string,
    })
  ).isRequired,
  defaultRows: PropTypes.number,
};

export default DataTable;