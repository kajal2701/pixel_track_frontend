import React from 'react';
import { Chip } from '@mui/material';

// Status chip color mapping for order statuses
export const STATUS_CHIP_COLOR = (status) =>
({
  Confirmed: 'success',
  Pending: 'warning',
  'Awaiting production': 'primary',
  'Awaiting material': 'secondary',
  Ready: 'info',
  'Ready for Pickup/Delivery': 'success',
  Completed: 'success',
  Cancelled: 'error',
}[status] || 'default');

// Status chip color mapping for invoice statuses
export const getInvoiceStatusColor = (status) => {
  switch (status) {
    case 'Paid': return 'success';
    case 'Sent': return 'info';
    case 'Payment Submitted': return 'primary';
    case 'Draft': return 'warning';
    case 'Cancelled': return 'error';
    default: return 'default';
  }
};

export const getInvoiceStatusDisplay = (status) => {
  switch (status) {
    case 'Paid': return { label: 'Amount Paid:', color: 'success' };
    case 'Payment Submitted': return { label: 'Deposit Amount:', color: 'primary' };
    case 'Sent': return { label: 'Due Amount:', color: 'warning' };
    case 'Draft': return { label: 'Total Amount:', color: 'default' };
    case 'Cancelled': return { label: 'Total Amount:', color: 'error' };
    default: return { label: 'Total Amount:', color: 'default' };
  }
};

// Format date string to DD-MM-YYYY HH:MM format
// export const formatDate = (dateStr) => {
//   if (!dateStr) return '—';
//   const d = new Date(dateStr);
//   const dd = String(d.getDate()).padStart(2, '0');
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const yy = String(d.getFullYear());
//   return `${dd}-${mm}-${yy}`;
// };


export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const clean = dateStr.split('T')[0]; // "2026-06-04T18:30:00.000Z" → "2026-06-05"
  const [yy, mm, dd] = clean.split('-');
  return `${dd}-${mm}-${yy}`;
};

// Format date string to YYYY-MM-DD format (for HTML date inputs)
// export const formatDateToYYYYMMDD = (dateStr) => {
//   if (!dateStr) return '';
//   try {
//     const d = new Date(dateStr);
//     if (isNaN(d.getTime())) return '';
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, '0');
//     const dd = String(d.getDate()).padStart(2, '0');
//     return `${yyyy}-${mm}-${dd}`;
//   } catch (e) {
//     return '';
//   }
// };

export const formatDateToYYYYMMDD = (dateStr) => {
  if (!dateStr) return '';
  const clean = dateStr.split('T')[0];
  return clean; // already "YYYY-MM-DD"
};

export const PIXEL_TRACK = {
  name: 'Pixel Track',
  address: '4783 CAWSEY Terrace SW,',
  city: 'Edmonton,',
  province: 'AB T6W 5M7',
  email: 'info@pixeltracks.ca',
  phone: '+1 (780) 938-4509',
};

export const generateColorOptions = (products) => {
  const rows = (products || [])
    .filter((p) => p?.color)
    .map((p) => {
      // 1. Used for the UI label and sorting
      const colorCodeUI = p.color_code ? ` - (${p.color_code})` : '';
      const manufacturerUI = p.manufacturer ? p.manufacturer : '';
      const plainLabel = `${p.color}${manufacturerUI ? ` - (${manufacturerUI})` : ''}${colorCodeUI}`;

      // 2. Used for the backend payload (Old Format: "Color (ColorCode) (Manufacturer)")
      const colorCodeBackend = p.color_code ? ` (${p.color_code})` : '';
      const manufacturerBackend = p.manufacturer ? ` (${p.manufacturer})` : '';
      const backendValue = `${p.color}${colorCodeBackend}${manufacturerBackend}`;

      const label = (
        <span>
          {p.color}
          {manufacturerUI && (
            <>
              {' - '}
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                ({manufacturerUI})
              </span>
            </>
          )}
          {colorCodeUI}
        </span>
      );

      return { key: p.id ?? plainLabel, value: backendValue, label, plainLabel };
    });

  rows.sort((a, b) => a.plainLabel?.localeCompare(b.plainLabel));
  return rows;
};
// ── Shared Dropdown Options ──────────────────────────────────

export const CHANNEL_LENGTH_OPTIONS = [
  { value: '', label: 'Select Channel Length', disabled: true },
  { value: '10', label: '10 Holes — 6.67 ft' },
  { value: '9', label: '9 Holes — 6.00 ft' },
  { value: '8', label: '8 Holes — 5.33 ft' },
];

// Used in customer pricing form — key matches JSON column key in DB
// New format: { commercial: { "10h": { price: 2.50, enabled: true } }, residential: { ... } }
export const CHANNEL_PRICING_OPTIONS = [
  { key: '10h', label: '10 Holes — 6.67 ft', feet: 6.67 },
  { key: '9h', label: '9 Holes — 6.00 ft', feet: 6.00 },
  { key: '8h', label: '8 Holes — 5.33 ft', feet: 5.33 },
];

// Pricing categories used in admin CustomerForm
export const PRICING_CATEGORIES = [
  { key: 'commercial', label: 'Commercial' },
  { key: 'residential', label: 'Residential' },
];

// Build default empty pricing state for one category
const buildEmptyCategoryPricing = () => {
  const obj = {};
  CHANNEL_PRICING_OPTIONS.forEach(({ key }) => {
    obj[key] = { price: '', enabled: true };
  });
  return obj;
};

// Build full default pricing state
export const buildDefaultPricing = () => ({
  commercial: buildEmptyCategoryPricing(),
  residential: buildEmptyCategoryPricing(),
});

// Parse API pricing data (handles both new nested and legacy flat formats)
export const parsePricingFromApi = (raw) => {
  if (!raw) return buildDefaultPricing();
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

  // Detect new nested format
  if (data.commercial || data.residential) {
    const result = buildDefaultPricing();
    ['commercial', 'residential'].forEach((cat) => {
      if (data[cat]) {
        CHANNEL_PRICING_OPTIONS.forEach(({ key }) => {
          if (data[cat][key]) {
            const entry = data[cat][key];
            result[cat][key] = {
              price: String(typeof entry === 'object' ? (entry.price ?? '') : (entry ?? '')),
              enabled: typeof entry === 'object' ? (entry.enabled !== false) : true,
            };
          }
        });
      }
    });
    return result;
  }

  // Legacy flat format — copy same prices to both categories, all enabled
  const result = buildDefaultPricing();
  Object.keys(data).forEach((k) => {
    const val = data[k];
    ['commercial', 'residential'].forEach((cat) => {
      if (result[cat][k]) {
        result[cat][k] = { price: String(val != null ? val : ''), enabled: true };
      }
    });
  });
  return result;
};


export const INVENTORY_TYPE_OPTIONS = [
  { value: 'Full Roll', label: 'Full Roll' },
  { value: 'Slitted', label: 'Slitted' },
  { value: 'Ready Channel', label: 'Ready Channel' },
];

export const ROLE_OPTIONS = [
  { value: '', label: 'Select Role', disabled: true },
  { value: 'admin', label: 'Admin' },
  { value: 'production tech', label: 'Production Tech' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
];

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// ── Validation & Input Helpers ───────────────────────────────

// Formats raw phone digits to 000-000-0000
// e.g. "9925674192" → "992-567-4192"
export const formatPhoneNumber = (raw) => {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  const match = digits.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  if (!match) return raw;
  return !match[2] ? match[1] : `${match[1]}-${match[2]}${match[3] ? `-${match[3]}` : ''}`;
};

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

// Get human-readable channel length label from value
export const getChannelLengthLabel = (value) => {
  if (!value) return '—';
  const opt = CHANNEL_LENGTH_OPTIONS.find((o) => String(o.value) === String(value));
  if (opt) return opt.label;
  return `${value} ft`;
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
    subtitle: 'Orders produced and stored in warehouse.',
    color: 'info'
  },
  {
    status: 'Ready for Pickup/Delivery',
    title: 'Ready for Pickup/Delivery',
    subtitle: 'Orders dispatched to pickup location or out for delivery.',
    color: 'success'
  },
  {
    status: 'Completed',
    title: 'Completed Orders',
    subtitle: 'Orders that have been picked up or delivered successfully.',
    color: 'success'
  },
  {
    status: 'Cancelled',
    title: 'Cancelled Orders',
    subtitle: 'Orders that have been cancelled or rejected.',
    color: 'error'
  }
];

// ── Production Calculation Helper ──────────────────────────────────

export const calculateProductionDetails = (size, qty, type = 'Full Roll', product = null) => {
  if (!size || !qty) return '—';

  const s = parseFloat(size);
  const q = parseFloat(qty);

  if (s <= 0 || q <= 0) return '—';

  let slittedLength = s;
  let slitsPerRoll = 1;

  if (type === 'Full Roll') {
    slittedLength = product?.slitted_roll_length ? parseFloat(product.slitted_roll_length) : s;
    slitsPerRoll = product?.slits_per_roll ? parseInt(product.slits_per_roll) : 6;
  } else if (type === 'Slitted') {
    slittedLength = s;
    slitsPerRoll = 1;
  }

  const holes = [
    { label: '10H (6.67ft)', value: 6.67 },
    { label: '9H (6ft)', value: 6 },
    { label: '8H (5.33ft)', value: 5.33 }
  ];

  return holes.map(h => {
    const channelsPerSlitted = Math.floor(slittedLength / h.value);
    const totalPieces = channelsPerSlitted * slitsPerRoll * q;
    return `${h.label}: ${Math.floor(totalPieces)} pcs`;
  }).join(' | ');
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
  { title: 'Ready', count: counts.ready, sub: 'In warehouse', accent: 'info.main', dot: 'info.main', target: 'table-Ready' },
  { title: 'Dispatched', count: counts.readyForPickup, sub: 'Out for pickup/delivery', accent: 'success.main', dot: 'success.main', target: 'table-Ready-for-Pickup/Delivery' },
  { title: 'Completed', count: counts.completed, sub: 'Picked up / delivered', accent: 'success.main', dot: 'success.main', target: 'table-Completed' },
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

// ── Location Options ──────────────────────────────────────────────
export const LOCATION_OPTIONS = [
  { value: 'Warehouse', label: 'Warehouse' },
  { value: '4783 CAWSEY Terrace SW, Edmonton AB T6W 5M7', label: '4783 CAWSEY Terrace SW' },
  { value: '2322 chokecherry close sw Edmonton, AB T6X2M7', label: '2322 Chokecherry Close SW' },
];

// ── Role Chip Color ──────────────────────────────────────────────
export const getRoleChipColor = (role) => {
  switch (role) {
    case 'admin': return 'primary';
    case 'production tech': return 'info';
    case 'sales': return 'success';
    case 'operations': return 'secondary';
    default: return 'default';
  }
};

// ── Inventory Type Color ─────────────────────────────────────────
export const getInventoryTypeColor = (type) => {
  switch (type) {
    case 'Full Roll': return '#5D87FF';
    case 'Slitted': return '#FFAE1F';
    case 'Ready Channel': return '#13DEB9';
    default: return '#8e8e8e';
  }
};

// ── Order Grouping Colors ─────────────────────────────────────────
export const ORDER_COLORS = [
  '#5D87FF', '#49BEFF', '#13DEB9', '#FFAE1F', '#FA896B',
  '#9C27B0', '#00BCD4', '#FF5722', '#8BC34A', '#3F51B5',
];

// ── Type Chip with Order Color Grouping ───────────────────────────
export const TypeChipWithOrderColor = ({ item, orderColor }) => (
  <Chip
    label={item.production_type === 'Specific Order' ? `Order: ${item.order_id || '—'}` : 'General'}
    size="small"
    sx={{
      borderRadius: '6px',
      ...(orderColor
        ? { backgroundColor: orderColor, color: '#fff', fontWeight: 600 }
        : {}),
    }}
    {...(!orderColor ? { color: 'secondary' } : {})}
  />
);

// ── Invoice URL Obfuscation Helpers ──────────────────────────────
export const encodeInvoiceId = (id) => {
  if (!id) return '';
  const numId = parseInt(id, 10);

  // 1. Generate a salt to change the very beginning of the string
  const salt = (numId * 87654321).toString(36);

  // 2. Base padding string (shortened to make the final Base64 string smaller)
  const padding = "PxTrk_SecureInv";

  // 3. XOR the padding using the ID so the entire middle string changes completely
  let xorPadding = "";
  for (let i = 0; i < padding.length; i++) {
    const charCode = padding.charCodeAt(i) ^ ((numId * (i + 1)) % 256);
    xorPadding += charCode.toString(16).padStart(2, '0');
  }

  // 4. Assemble the raw token: salt + scrambled padding + real ID
  const rawToken = `${salt}_${xorPadding}_${id}`;

  // 5. Base64 encode the whole thing
  return btoa(rawToken);
};

export const decodeInvoiceToken = (token) => {
  if (!token) return null;
  try {
    const decoded = atob(token);
    // Split by underscore and grab the last part (which is the real ID)
    const parts = decoded.split('_');
    if (parts.length >= 3) {
      const actualId = parts[parts.length - 1];
      if (!isNaN(actualId)) {
        return actualId;
      }
    }
  } catch (e) {
    // Return null if invalid base64 or pattern doesn't match
  }
  return null;
};
