export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }

  return rows;
}

function looksLikeHeaderRow(row: string[], keyColumn: string): boolean {
  return row.some((cell) => cell.trim().toLowerCase() === keyColumn);
}

// Normalizes a header cell into a stable ascii key: "Em Dia" -> "em_dia", "Meta%" -> "meta".
function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// keyColumn is the header cell that identifies the real header row (e.g. "colaborador"
// or "cliente"), used to skip any title row a sheet may place above the header.
export function csvToObjects(
  text: string,
  keyColumn = "colaborador"
): Record<string, string>[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const headerIndex = rows.findIndex((row) => looksLikeHeaderRow(row, keyColumn));
  if (headerIndex === -1) return [];

  const headers = rows[headerIndex].map(normalizeHeader);
  return rows.slice(headerIndex + 1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? "").trim();
    });
    return obj;
  });
}
