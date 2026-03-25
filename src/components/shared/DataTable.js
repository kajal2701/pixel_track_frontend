import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Typography, TableHead, Chip, Box, Table, TableBody,
  TableCell, TablePagination, TableRow, TableFooter,
  IconButton, Paper, TableContainer, Avatar, Stack, CircularProgress,
} from '@mui/material';
import Spinner from '../../views/spinner/Spinner';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';

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

const DataTable = ({ rows = [], columns = [], defaultRows = 5, loading = false }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRows);
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  // Handle sorting
  const handleSort = (field) => {
    // Don't sort actions column
    if (field === 'actions') return;
    
    let direction = 'asc';
    if (sortConfig.key === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: field, direction });
  };

  // Sort rows based on sortConfig
  const sortedRows = React.useMemo(() => {
    let sortableRows = [...rows];
    if (sortConfig.key) {
      sortableRows.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle null/undefined values
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        // Convert to string for comparison
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (aStr < bStr) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aStr > bStr) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRows;
  }, [rows, sortConfig]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedRows.length) : 0;
  const visibleRows = rowsPerPage > 0
    ? sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedRows;

  // Calculate total minWidth from columns
  const totalMinWidth = columns.reduce((sum, col) => {
    if (col.minWidth) {
      const width = typeof col.minWidth === 'string' 
        ? parseInt(col.minWidth) 
        : col.minWidth;
      return sum + width;
    }
    return sum;
  }, 0);

  return (
    <Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden', minWidth: 0 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table 
            sx={{ 
              minWidth: totalMinWidth || 'auto',
              tableLayout: totalMinWidth ? 'fixed' : 'auto',
              width: '100%'
            }} 
            aria-label="data table"
          >
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell 
                    key={col.field} 
                    sx={{
                      width: col.width || col.minWidth,
                      minWidth: col.minWidth,
                      cursor: col.field !== 'actions' ? 'pointer' : 'default',
                      '&:hover': col.field !== 'actions' ? {
                        backgroundColor: 'action.hover',
                      } : {},
                    }}
                    onClick={() => handleSort(col.field)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{col.label}</Typography>
                      {col.field !== 'actions' && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {sortConfig.key === col.field ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUpwardIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            ) : (
                              <ArrowDownwardIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                            )
                          ) : (
                            <SortIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          )}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, rowIdx) => (
                <TableRow key={row.id ?? rowIdx} hover>
                  {columns.map((col) => (
                    <TableCell key={col.field} sx={{
                      width: col.width || col.minWidth,
                      minWidth: col.minWidth,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
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
      )}
    </Paper>
  );
};

DataTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'avatar', 'chip']),
      render: PropTypes.func,
      avatarField: PropTypes.string,
      chipColor: PropTypes.func,
      prefix: PropTypes.string,
      bold: PropTypes.bool,
      muted: PropTypes.bool,
      width: PropTypes.string,
      minWidth: PropTypes.string,
      align: PropTypes.string,
    })
  ).isRequired,
  defaultRows: PropTypes.number,
  loading: PropTypes.bool,
};

export default DataTable;