// Status chip color mapping for order statuses
export const STATUS_CHIP_COLOR = (status) =>
({ Confirmed: 'success', Pending: 'warning', Ready: 'info', Cancelled: 'error' }[status] ||
  'default');

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


export const generateColorOptions = (products) => {
  const rows = (products || [])
    .filter((p) => p?.color)
    .map((p) => {
      const colorCode = p.color_code ? ` (${p.color_code})` : '';
      const manufacturer = p.manufacturer ? ` (${p.manufacturer})` : '';
      const label = `${p.color}${colorCode}${manufacturer}`;
      return { key: p.id ?? label, value: label, label };
    });

  rows.sort((a, b) => a.label.localeCompare(b.label));
  return rows;
};

// ── Shared Dropdown Options ──────────────────────────────────

export const CHANNEL_LENGTH_OPTIONS = [
  { value: '', label: 'Select Channel Length', disabled: true },
  { value: '4 Feet/48"', label: '4 Feet/48"' },
  { value: '6 Feet/72"', label: '6 Feet/72"' },
  { value: '8 Feet/96"', label: '8 Feet/96"' },
];

export const HOLE_DISTANCE_OPTIONS = [
  { value: '', label: 'Select Hole Distance', disabled: true },
  { value: '8', label: '8" center-to-center' },
];

export const READY_CHANNEL_LENGTH_OPTIONS = [
  { value: '', label: 'Select Length per Piece', disabled: true },
  { value: '4 Feet/48"', label: '4 Feet/48"' },
  { value: '6 Feet/72"', label: '6 Feet/72"' },
  { value: '8 Feet/96"', label: '8 Feet/96"' },
];

export const INVENTORY_TYPE_OPTIONS = [
  { value: 'Full Roll', label: 'Full Roll' },
  { value: 'Slitted', label: 'Slitted' },
  { value: 'Ready Channel', label: 'Ready Channel' },
];

// ── Validation & Input Helpers ───────────────────────────────

// Limits decimal input to 2 places at the onChange level
export const handleDecimalChange = (onChange) => (e) => {
  const val = e.target.value;
  if (!val || /^\d+(\.\d{0,2})?$/.test(val)) {
    onChange(e);
  } else {
    const match = val.match(/^\d*(?:\.\d{0,2})?/);
    if (match) {
      e.target.value = match[0];
      onChange(e);
    }
  }
};

// Blocks non-digit input for integer-only fields
export const handleIntegerInput = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
};

// Standard decimal validation rules
export const decimalRules = (label) => ({
  required: `${label} is required`,
  min: { value: 0.01, message: `${label} must be greater than 0` },
  pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Maximum 2 decimal places allowed' },
});

// Standard integer validation rules
export const integerRules = (label) => ({
  required: `${label} is required`,
  min: { value: 1, message: `${label} must be greater than 0` },
  pattern: { value: /^\d+$/, message: 'Only whole numbers allowed' },
});

// Map numeric channel length value to its display label
export const mapToChannelLengthLabel = (value) => {
  if (!value) return value;
  const num = parseFloat(value);
  if (num === 4) return '4 Feet/48"';
  if (num === 6) return '6 Feet/72"';
  if (num === 8) return '8 Feet/96"';
  return value;
};

// Calculate piece length based on channel length string
export const getPieceLength = (channelLength) => {
  if (channelLength === '4 Feet/48"') return 4;
  if (channelLength === '6 Feet/72"') return 6;
  if (channelLength === '8 Feet/96"') return 8;
  // Fallback for legacy data
  if (channelLength === '6 Hole (4 Feet)') return 4;
  return 6.67;
};

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

// Data configuration for Order status tables
export const ORDER_TABLE_DATA = [
  {
    status: 'Pending',
    title: 'Pending Orders',
    subtitle: 'New orders that are awaiting review and confirmation.',
    color: 'warning'
  },
  {
    status: 'Confirmed',
    title: 'Confirmed Orders',
    subtitle: 'Orders that have been approved and are in production.',
    color: 'success'
  },
  {
    status: 'Ready',
    title: 'Ready Orders',
    subtitle: 'Completed orders that are ready for dispatch or pickup.',
    color: 'info'
  },
  {
    status: 'Cancelled',
    title: 'Cancelled Orders',
    subtitle: 'Orders that have been cancelled or rejected.',
    color: 'error'
  }
];

// ── Production Calculation Helper ──────────────────────────────────

export const calculateProductionDetails = (size, qty) => {
  if (!size || !qty) return '—';

  const totalFeet = parseFloat(size) * parseFloat(qty);
  if (totalFeet <= 0) return '—';

  const lengths = [
    { label: '4ft', value: 4 },
    { label: '6ft', value: 6 },
    { label: '8ft', value: 8 }
  ];

  return lengths.map(length =>
    `${length.label}: ${(totalFeet / length.value).toFixed(1)} pcs`
  ).join(' | ');
};

// ── Business Days Calculation ──────────────────────────────────

export const addBusinessDays = (date, days) => {
  const result = new Date(date);
  let businessDaysAdded = 0;

  while (businessDaysAdded < days) {
    result.setDate(result.getDate() + 1);

    // Only count weekdays (Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5)
    // Skip weekends (Saturday = 6, Sunday = 0)
    const dayOfWeek = result.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      businessDaysAdded++;
    }
  }

  return result;
};

export const getEstimatedDeliveryDate = () => {
  const date = addBusinessDays(new Date(), 5);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate config for summary cards based on current counts
export const getSummaryCardsData = (counts) => [
  { title: 'Total Orders', count: counts.total, sub: 'All orders', accent: 'primary.main', dot: 'primary.main', target: 'tables-container' },
  { title: 'Pending', count: counts.pending, sub: 'Awaiting confirmation', accent: 'warning.main', dot: 'warning.main', target: 'table-Pending' },
  { title: 'Confirmed', count: counts.confirmed, sub: 'Ready for production', accent: 'success.main', dot: 'success.main', target: 'table-Confirmed' },
  { title: 'Ready', count: counts.ready, sub: 'Ready for dispatch', accent: 'info.main', dot: 'info.main', target: 'table-Ready' },
  { title: 'Cancelled', count: counts.cancelled, sub: 'Orders cancelled', accent: 'error.main', dot: 'error.main', target: 'table-Cancelled' },
];

// Calculate minimum pickup date based on stock and time cutoff
export const getMinPickupDate = (isReadySatisfied) => {
  const currentHour = new Date().getHours();
  const daysToAdd = (currentHour < 12 && isReadySatisfied) ? 1 : 2;
  return addBusinessDays(new Date(), daysToAdd);
};

