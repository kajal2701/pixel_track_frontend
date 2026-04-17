import {
  CHANNEL_LENGTH_OPTIONS as channelLengthOptions,
  HOLE_DISTANCE_OPTIONS as holeDistanceOptions,
  READY_CHANNEL_LENGTH_OPTIONS as readyChannelLengthOptions,
  INVENTORY_TYPE_OPTIONS as inventoryTypeOptions,
} from 'src/utils/helpers';

export {
  channelLengthOptions,
  holeDistanceOptions,
  readyChannelLengthOptions,
  inventoryTypeOptions,
};

// ── Status config ──────────────────────────────────────────────
export const statusConfig = {
  available: { label: 'Available', color: 'success' },
  hold: { label: 'Hold', color: 'warning' },
  not_in_stock: { label: 'Not in Stock', color: 'error' },
};

export const getStatusInfo = (state, qty) => {
  if (state && statusConfig[state]) return statusConfig[state];
  if (qty > 0) return statusConfig.available;
  return statusConfig.not_in_stock;
};

// ── Summary card config ──────────────────────────────────────────
export const SUMMARY_CARDS = (counts) => [
  {
    title: 'Total Colors',
    count: counts.total,
    sub: 'Unique supplier + color code',
    accent: 'primary.main',
    dot: 'primary.main',
  },
  {
    title: 'Full Rolls',
    count: counts.fullRolls,
    sub: 'Total rolls in stock',
    accent: 'info.main',
    dot: 'info.main',
  },
  {
    title: 'Slitted Rolls',
    count: counts.slitted,
    sub: 'Total slitted pieces',
    accent: 'warning.main',
    dot: 'warning.main',
  },
  {
    title: 'Ready Channels',
    count: counts.readyPieces,
    sub: 'Total ready pieces',
    accent: 'success.main',
    dot: 'success.main',
  },
];

// ═══════════════════════════════════════════════════════════════════
// Grouping: merge all inventory records by supplier + color_code
// ═══════════════════════════════════════════════════════════════════
export const groupBySupplierColor = (items) => {
  const map = {};

  items.forEach((item) => {
    const key = `${(item.supplier || '').trim().toLowerCase()}__${(item.color_code || '')
      .trim()
      .toLowerCase()}`;

    if (!map[key]) {
      map[key] = {
        supplier: item.supplier,
        color_name: item.color_name,
        color_code: item.color_code,
        fullRoll_qty: 0,
        fullRoll_size: '',
        fullRoll_state: null,
        fullRoll_feet: 0,
        fullRoll_id: null,
        fullRoll_channel_length: '',
        slitted_qty: 0,
        slitted_size: '',
        slitted_state: null,
        slitted_feet: 0,
        slitted_id: null,
        slitted_channel_length: '',
        ready_pieces: 0,
        ready_state: null,
        ready_variants: [],
        ids: [],
      };
    }

    const group = map[key];
    group.ids.push(item.id);

    if (item.inventory_type === 'Full Roll') {
      group.fullRoll_qty += parseFloat(item.quantity) || 0;
      group.fullRoll_size = item.size ? `${item.size} ft` : group.fullRoll_size;
      group.fullRoll_state = item.state || group.fullRoll_state;
      group.fullRoll_feet += parseFloat(item.possible_feet) || 0;
      group.fullRoll_id = item.id;
      group.fullRoll_channel_length = item.channel_length || group.fullRoll_channel_length;
    } else if (item.inventory_type === 'Slitted') {
      group.slitted_qty += parseFloat(item.quantity) || 0;
      group.slitted_size = item.size ? `${item.size} ft` : group.slitted_size;
      group.slitted_state = item.state || group.slitted_state;
      group.slitted_feet += parseFloat(item.possible_feet) || 0;
      group.slitted_id = item.id;
      group.slitted_channel_length = item.channel_length || group.slitted_channel_length;
    } else if (item.inventory_type === 'Ready Channel') {
      const readyPieces = parseFloat(item.pieces) || 0;
      const itemLength = parseFloat(item.length);
      const formattedLength = Number.isNaN(itemLength) ? null : parseFloat(itemLength.toFixed(2));
      const holeDistance = item.hole_distance || '—';

      group.ready_pieces += readyPieces;
      group.ready_state = item.state || group.ready_state;
      group.ready_variants.push({
        id: item.id,
        pieces: readyPieces,
        length: formattedLength,
        hole_distance: holeDistance,
        state: item.state || null,
      });
    }
  });

  return Object.values(map).map((g) => {
    const totalFeet = (g.fullRoll_feet || 0) + (g.slitted_feet || 0);
    g.ready_variants.sort((a, b) => {
      const aLen = a.length ?? Number.MAX_SAFE_INTEGER;
      const bLen = b.length ?? Number.MAX_SAFE_INTEGER;
      return aLen - bLen;
    });
    return {
      ...g,
      possible_feet: totalFeet ? parseFloat(totalFeet.toFixed(2)) : 0,
    };
  });
};

export const getSuppliersOptions = (allProducts) => {
  const s = allProducts.map((p) => p.manufacturer).filter(Boolean);
  const unique = Array.from(new Set(s)).sort();
  const options = unique.map((name) => ({ value: name, label: name }));
  return [{ value: '', label: 'Select Supplier', disabled: true }, ...options];
};

export const getFilteredColorsOptions = (allProducts, selectedSupplier) => {
  if (!selectedSupplier) return [{ value: '', label: 'Select Supplier first', disabled: true }];
  const colors = allProducts
    .filter((p) => p.manufacturer === selectedSupplier)
    .map((p) => ({
      value: p.color || p.product_name,
      label: p.color || p.product_name,
      color_code: p.color_code,
    }));
  // Unique color names
  const map = new Map();
  colors.forEach((c) => {
    if (!map.has(c.value)) map.set(c.value, c);
  });
  const options = Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  return [{ value: '', label: 'Select Color', disabled: true }, ...options];
};

export const getFilteredColorCodesOptions = (allProducts, selectedSupplier) => {
  if (!selectedSupplier) return [{ value: '', label: 'Select Supplier first', disabled: true }];
  const codes = allProducts
    .filter((p) => p.manufacturer === selectedSupplier && p.color_code)
    .map((p) => ({
      value: p.color_code,
      label: p.color_code,
    }));
  // Unique color codes
  const map = new Map();
  codes.forEach((c) => {
    if (!map.has(c.value)) map.set(c.value, c);
  });
  const options = Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  return [{ value: '', label: 'Select Color Code', disabled: true }, ...options];
};
