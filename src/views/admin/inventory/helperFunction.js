import {
  CHANNEL_LENGTH_OPTIONS as channelLengthOptions,
  INVENTORY_TYPE_OPTIONS as inventoryTypeOptions,
} from 'src/utils/helpers';

export {
  channelLengthOptions,
  inventoryTypeOptions,
};

// ── Status config ──────────────────────────────────────────────
export const statusConfig = {
  available: { label: 'Available', color: 'success' },
  hold: { label: 'Hold', color: 'warning' },
  not_in_stock: { label: 'Not in Stock', color: 'error' },
};

export const getStatusInfo = (state, qty) => {
  // If quantity is 0 or less, always show as out of stock regardless of DB state
  if (qty <= 0) return statusConfig.not_in_stock;
  if (state && statusConfig[state]) return statusConfig[state];
  return statusConfig.available;
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
        fullRoll_available_qty: 0,
        fullRoll_raw_qty: 0,
        fullRoll_size: '',
        fullRoll_state: null,
        fullRoll_feet: 0,
        fullRoll_total_feet: 0,
        fullRoll_held_feet: 0,
        fullRoll_id: null,
        fullRoll_channel_length: '',
        fullRoll_location: '',
        slitted_qty: 0,
        slitted_size: '',
        slitted_state: null,
        slitted_feet: 0,
        slitted_id: null,
        slitted_channel_length: '',
        slitted_location: '',
        slitted_held_qty: 0,
        slitted_total_qty: 0,
        ready_pieces: 0,
        ready_total_pieces: 0,
        ready_held_pieces: 0,
        ready_state: null,
        ready_variants: [],
        ids: [],
      };
    }

    const group = map[key];
    group.ids.push(item.id);

    if (item.inventory_type === 'Full Roll') {
      const q = parseFloat(item.quantity) || 0;
      const sizeNum = parseFloat(item.size) || 0;
      const heldFeet = parseFloat(item.held_feet) || 0;
      const heldQty = parseFloat(item.held_quantity) || 0;

      // Single roll size (each roll is sizeNum ft)
      // Total size across all rolls = sizeNum * q
      const totalRollFeet = sizeNum * q;
      // Held feet could be from held_feet or held whole rolls * sizeNum
      const totalHeldFeet = heldFeet > 0 ? heldFeet : (heldQty > 0 ? heldQty * sizeNum : 0);
      const availableFeet = Math.max(0, totalRollFeet - totalHeldFeet);

      group.fullRoll_raw_qty += q;
      // Available rolls equivalent (e.g., if full roll size is 98ft, available roll count = Math.round(availableFeet / sizeNum))
      const exactAvailQty = sizeNum > 0 ? parseFloat((availableFeet / sizeNum).toFixed(2)) : q;
      group.fullRoll_available_qty = (group.fullRoll_available_qty || 0) + exactAvailQty;
      group.fullRoll_qty += sizeNum > 0 ? Math.round(availableFeet / sizeNum) : q;
      group.fullRoll_total_feet += totalRollFeet;
      group.fullRoll_held_feet += totalHeldFeet;
      group.fullRoll_available_feet = (group.fullRoll_available_feet || 0) + availableFeet;

      if (item.size) {
        group.fullRoll_size = `${Number(parseFloat(item.size).toFixed(2))} ft`;
      }
      group.fullRoll_state = item.state || group.fullRoll_state;
      // Full Roll produces 6 slitted rolls, so possible channel feet = availableFeet * 6
      group.fullRoll_feet += availableFeet * 6;
      group.fullRoll_id = item.id;
      group.fullRoll_channel_length = item.channel_length || group.fullRoll_channel_length;
      group.fullRoll_location = item.location || group.fullRoll_location || 'Warehouse';
    } else if (item.inventory_type === 'Slitted') {
      const rawQty = parseFloat(item.quantity) || 0;
      const heldQty = parseFloat(item.held_quantity !== undefined && item.held_quantity !== null ? item.held_quantity : item.held_pieces) || 0;
      const availableQty = Math.max(0, rawQty - heldQty);

      group.slitted_qty += availableQty;
      group.slitted_total_qty = (group.slitted_total_qty || 0) + rawQty;
      group.slitted_held_qty = (group.slitted_held_qty || 0) + heldQty;

      if (item.size) {
        group.slitted_size = `${Number(parseFloat(item.size).toFixed(2))} ft`;
      }
      group.slitted_state = item.state || group.slitted_state;
      const sizeNum = parseFloat(item.size) || 0;
      group.slitted_feet += availableQty * sizeNum;
      group.slitted_id = item.id;
      group.slitted_channel_length = item.channel_length || group.slitted_channel_length;
      group.slitted_location = item.location || group.slitted_location || 'Warehouse';
    } else if (item.inventory_type === 'Ready Channel') {
      const readyPieces = parseFloat(item.pieces) || 0;
      const itemLength = parseFloat(item.length);
      const formattedLength = Number.isNaN(itemLength) ? null : parseFloat(itemLength.toFixed(2));
      const holeDistance = item.hole_distance || '—';
      const holdQTy = parseFloat(item.held_pieces !== undefined && item.held_pieces !== null ? item.held_pieces : item.held_quantity) || 0;
      const availablePieces = Math.max(0, readyPieces - holdQTy);

      group.ready_pieces += availablePieces;
      group.ready_total_pieces = (group.ready_total_pieces || 0) + readyPieces;
      group.ready_held_pieces = (group.ready_held_pieces || 0) + holdQTy;
      group.ready_state = item.state || group.ready_state;
      group.ready_variants.push({
        id: item.id,
        pieces: readyPieces,
        available_pieces: availablePieces,
        length: formattedLength,
        hole_distance: holeDistance,
        state: item.state || null,
        location: item.location || 'Warehouse',
        location_stock: item.location_stock || null,
        holdQTy,
        avaibleForOthers: availablePieces
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
