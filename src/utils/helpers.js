// Status chip color mapping for order statuses
export const STATUS_CHIP_COLOR = (status) =>
({
  Confirmed: 'success',
  Pending: 'warning',
  'Awaiting production': 'primary',
  'Awaiting material': 'secondary',
  Ready: 'info',
  Cancelled: 'error',
}[status] || 'default');

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
  { value: '10', label: '10 Holes — 6.67 ft' },
  { value: '9', label: '9 Holes — 6.00 ft' },
  { value: '8', label: '8 Holes — 5.33 ft' },
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

// Map stored channel_length value (feet or hole count) to dropdown value (hole count)
export const mapToChannelLengthLabel = (value) => {
  if (!value) return value;

  // If it's already a hole count string (e.g. '10', '9', '8')
  const numInt = parseInt(value, 10);
  if ([8, 9, 10].includes(numInt) && String(numInt) === String(value)) return String(numInt);

  // If it's a feet value from DB (e.g. 6.67, 6.00, 5.33), convert to hole count
  const numFloat = parseFloat(value);
  if (Math.abs(numFloat - 6.67) < 0.1) return '10';
  if (Math.abs(numFloat - 6.00) < 0.1) return '9';
  if (Math.abs(numFloat - 5.33) < 0.1) return '8';

  // Legacy mappings
  if (numFloat === 4) return '10'; // 4ft -> 10 holes mapping for legacy data
  if (numFloat === 8) return '8';  // 8ft -> 8 holes mapping for legacy data

  return String(value);
};

// Calculate piece length in feet from hole count
// Formula: channel_length_ft = holes / 1.5
export const getPieceLength = (channelLength) => {
  const holes = parseInt(channelLength, 10);
  if (holes > 0) return parseFloat((holes / 1.5).toFixed(2));
  return 0;
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
    subtitle: 'Orders approved and ready for pickup or production request.',
    color: 'success'
  },
  {
    status: 'Awaiting production',
    title: 'Awaiting Production',
    subtitle: 'Orders confirmed and waiting for production completion.',
    color: 'primary',
  },
  {
    status: 'Awaiting material',
    title: 'Awaiting Material',
    subtitle: 'Orders that need stock before production can start.',
    color: 'secondary',
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

  const holes = [
    { label: '10H (6.67ft)', value: 6.67 },
    { label: '9H (6ft)', value: 6 },
    { label: '8H (5.33ft)', value: 5.33 }
  ];

  return holes.map(h =>
    `${h.label}: ${Math.floor(totalFeet / h.value)} pcs`
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
  { title: 'Confirmed', count: counts.confirmed, sub: 'Confirmed orders', accent: 'success.main', dot: 'success.main', target: 'table-Confirmed' },
  { title: 'Awaiting Prod.', count: counts.awaitingProduction, sub: 'Production requested', accent: 'primary.main', dot: 'primary.main', target: 'table-Awaiting-production' },
  { title: 'Awaiting Material', count: counts.awaitingMaterial, sub: 'Need stock update', accent: 'secondary.main', dot: 'secondary.main', target: 'table-Awaiting-material' },
  { title: 'Ready', count: counts.ready, sub: 'Ready for dispatch', accent: 'info.main', dot: 'info.main', target: 'table-Ready' },
  { title: 'Cancelled', count: counts.cancelled, sub: 'Orders cancelled', accent: 'error.main', dot: 'error.main', target: 'table-Cancelled' },
];

// Calculate minimum pickup date based on stock and time cutoff
export const getMinPickupDate = (isReadySatisfied) => {
  const currentHour = new Date().getHours();
  const daysToAdd = (currentHour < 12 && isReadySatisfied) ? 1 : 2;
  return addBusinessDays(new Date(), daysToAdd);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'warning';
    case 'In Progress': return 'info';
    case 'Completed': return 'success';
    case 'Cancelled': return 'error';
    default: return 'default';
  }
};

export const getTypeColor = (type) => {
  return type === 'Specific Order' ? 'primary' : 'secondary';
};

