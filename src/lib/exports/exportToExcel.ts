import * as XLSX from "xlsx";

/**
 * Exports a sheet with headers and rows to an Excel file.
 * Uses xlsx. Safe for client (browser) only.
 */
export function exportToExcel(
  sheetName: string,
  headers: string[],
  rows: (string | number)[][],
): void {
  const data: (string | number)[][] = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  const colCount = Math.max(headers.length, ...rows.map((r) => r.length));
  worksheet["!cols"] = Array.from({ length: colCount }, (_, i) => {
    const maxWidth = data.reduce((acc, row) => {
      const cell = row[i];
      const len = cell != null ? String(cell).length : 0;
      return Math.max(acc, Math.min(len, 50));
    }, 10);
    return { wch: Math.max(maxWidth, 12) };
  });

  const workbook = XLSX.utils.book_new();
  const safeSheetName = sanitizeSheetName(sheetName) || "Sheet1";
  XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);

  const filename = `${sanitizeFilename(sheetName)}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

function sanitizeSheetName(name: string): string {
  return (
    name
      .replace(/[\\/*?:\[\]]/g, " ")
      .slice(0, 31)
      .trim() || "Sheet1"
  );
}

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "-").trim() || "export";
}
