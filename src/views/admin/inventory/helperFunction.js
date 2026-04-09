// ── Inventory Dropdown Options ──────────────────────────────────

export const channelLengthOptions = [
  { value: '', label: 'Select Channel Length', disabled: true },
  { value: "4 Feet/48''", label: "4 Feet/48''" },
  { value: "6 Feet/72''", label: "6 Feet/72''" },
  { value: '8 Feet/80"', label: '8 Feet/80"' },
];

export const holeDistanceOptions = [
  { value: '', label: 'Select Hole Distance', disabled: true },
  { value: '8 inches', label: '8 inches' },
  { value: '9 inches', label: '9 inches' },
];

export const inventoryTypeOptions = [
  { value: 'Full Roll', label: 'Full Roll' },
  { value: 'Slitted', label: 'Slitted' },
  { value: 'Ready Channel', label: 'Ready Channel' },
];

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
  { title: 'Total Colors', count: counts.total, sub: 'Unique supplier + color', accent: 'primary.main', dot: 'primary.main' },
  { title: 'Full Rolls', count: counts.fullRolls, sub: 'Total rolls in stock', accent: 'info.main', dot: 'info.main' },
  { title: 'Slitted Rolls', count: counts.slitted, sub: 'Total slitted pieces', accent: 'warning.main', dot: 'warning.main' },
  { title: 'Ready Channels', count: counts.readyPieces, sub: 'Total ready pieces', accent: 'success.main', dot: 'success.main' },
];

// ═══════════════════════════════════════════════════════════════════
// Grouping: merge all inventory records by supplier + color_name
// ═══════════════════════════════════════════════════════════════════
export const groupBySupplierColor = (items) => {
  const map = {};

  items.forEach((item) => {
    const key = `${(item.supplier || '').trim().toLowerCase()}__${(item.color_name || '').trim().toLowerCase()}`;

    if (!map[key]) {
      map[key] = {
        supplier: item.supplier,
        color_name: item.color_name,
        color_code: item.color_code,
        hole_distance: '',
        fullRoll_qty: 0, fullRoll_size: '', fullRoll_state: null, fullRoll_feet: 0, fullRoll_id: null, fullRoll_channel_length: '',
        slitted_qty: 0, slitted_size: '', slitted_state: null, slitted_feet: 0, slitted_id: null, slitted_channel_length: '',
        ready_pieces: 0, ready_length: '', ready_state: null, ready_id: null,
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
      group.ready_pieces += parseFloat(item.pieces) || 0;
      group.ready_length = item.length ? `${item.length} ft` : group.ready_length;
      group.ready_state = item.state || group.ready_state;
      group.ready_id = item.id;
      group.hole_distance = item.hole_distance || group.hole_distance;
    }
  });

  return Object.values(map).map((g) => {
    const totalFeet = (g.fullRoll_feet || 0) + (g.slitted_feet || 0);
    return {
      ...g,
      possible_feet: totalFeet ? parseFloat(totalFeet.toFixed(2)) : 0,
    };
  });
};
