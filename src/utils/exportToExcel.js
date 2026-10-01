import * as XLSX from 'xlsx';

/**
 * Export an array of objects to an Excel (.xlsx) file.
 *
 * @param {Object[]} data        — Array of row objects
 * @param {Object[]} columns     — [{ field, label }] to pick & rename columns
 * @param {string}   sheetName   — Excel sheet tab name  (default: "Sheet1")
 * @param {string}   fileName    — Download file name     (default: "export.xlsx")
 */
export const exportToExcel = (data, columns, sheetName = 'Sheet1', fileName = 'export.xlsx') => {
  // Build rows using only the requested columns
  const rows = data.map((item) =>
    columns.reduce((row, col) => {
      row[col.label] = item[col.field] ?? '';
      return row;
    }, {}),
  );

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-size column widths based on header + data
  worksheet['!cols'] = columns.map((col) => ({
    wch: Math.max(
      col.label.length,
      ...rows.map((r) => String(r[col.label] || '').length),
      10,
    ),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
};
