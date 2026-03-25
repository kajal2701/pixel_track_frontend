// Status chip color mapping for order statuses
export const STATUS_CHIP_COLOR = (status) =>
  ({ Confirmed: 'success', Pending: 'warning', Ready: 'info', Cancelled: 'error' }[status] || 'default');

// Format date string to DD-MM-YYYY HH:MM format
export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear());
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yy} ${hh}:${min}`;
};

// Available color options for orders
export const AVAILABLE_COLORS = [
  'IRON ORE (TKGM670)',
  'WHITE', 'BLACK', 'RED', 'BLUE', 'GRAY',
];

// Calculate piece length based on channel length
export const getPieceLength = (channelLength) => 
  channelLength === '6 Hole (4 Feet)' ? 4 : 6.67;

// Calculate total pieces from total length and channel length
export const calculateTotalPieces = (totalLength, channelLength) => {
  const pieceLength = getPieceLength(channelLength);
  return totalLength > 0 ? Math.ceil(totalLength / pieceLength) : 0;
};

// Calculate final length from total pieces and channel length
export const calculateFinalLength = (totalLength, channelLength) => {
  const totalPieces = calculateTotalPieces(totalLength, channelLength);
  const pieceLength = getPieceLength(channelLength);
  return totalLength > 0 ? Number((totalPieces * pieceLength).toFixed(2)) : 0;
};
