/**
 * Builds a CSV string from headers and rows, escaping values that contain comma, quote, or newline.
 */
function buildCSVString(
  headers: string[],
  rows: (string | number)[][],
): string {
  function escape(value: string | number): string {
    const s = String(value);
    if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  const headerLine = headers.map(escape).join(",");
  const dataLines = rows.map((row) => row.map(escape).join(","));
  return [headerLine, ...dataLines].join("\r\n");
}

/**
 * Triggers download of a CSV file. Uses Blob and object URL. Safe for client (browser) only.
 */
export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
): void {
  const csv = buildCSVString(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${sanitizeFilename(filename)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "-").trim() || "export";
}
