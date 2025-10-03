import XLSX from "xlsx-js-style";
import type { WorkSheet } from "xlsx-js-style";

// Your existing toFlatRows(data) -> FlatRow[] stays the same

// ARGB colors (FF + RRGGBB)
const COLORS = {
  headerBg:  "FF1F2937", // dark gray
  headerFg:  "FFFFFFFF", // white
  zebraBg:   "FFF9FAFB", // very light gray
  border:    "FFE5E7EB", // light gray
  linkBlue:  "FF1D4ED8", // blue
};

export function styleHeader(ws: WorkSheet, headers: string[]) {
  for (let c = 0; c < headers.length; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    const cell = ws[addr] || { t: "s", v: headers[c] };
    cell.s = {
      font: { bold: true, color: { rgb: COLORS.headerFg } },
      alignment: { vertical: "center", horizontal: "center", wrapText: true },
      fill: { patternType: "solid", fgColor: { rgb: COLORS.headerBg } },
      border: {
        top:    { style: "thin", color: { rgb: COLORS.border } },
        bottom: { style: "thin", color: { rgb: COLORS.border } },
        left:   { style: "thin", color: { rgb: COLORS.border } },
        right:  { style: "thin", color: { rgb: COLORS.border } },
      },
    };
    ws[addr] = cell;
  }
  ws["!rows"] = ws["!rows"] || [];
  ws["!rows"][0] = { hpt: 24 };
}

export function zebra(ws: WorkSheet) {
  const range = XLSX.utils.decode_range(ws["!ref"]!);
  for (let r = 1; r <= range.e.r; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        const cell = ws[addr];
        if (!cell) continue;
        cell.s = {
          ...(cell.s || {}),
          fill: { patternType: "solid", fgColor: { rgb: COLORS.zebraBg } },
        };
        ws[addr] = cell;
      }
    }
  }
}

export function enhance(ws: WorkSheet, headers: string[]) {
  // Freeze header + autofilter
  // @ts-ignore
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };
  const range = XLSX.utils.decode_range(ws["!ref"]!);
  ws["!autofilter"] = { ref: XLSX.utils.encode_range({ r: 0, c: 0 }, { r: range.e.r, c: range.e.c }) };

  // Column widths
  ws["!cols"] = headers.map((h) => ({ wch: Math.min(40, Math.max(12, h.length + 2)) }));

  // Number formats
  const colIndex: Record<string, number> = {};
  headers.forEach((h, i) => (colIndex[h] = i));
  for (let r = 1; r <= range.e.r; r++) {
    const precio = XLSX.utils.encode_cell({ r, c: colIndex["precio"] ?? -1 });
    if (ws[precio]?.t === "n") ws[precio].z = "#,##0";
    for (const k of ["metros2", "superficie_construida", "banos", "dormitorios"]) {
      const addr = XLSX.utils.encode_cell({ r, c: colIndex[k] ?? -1 });
      if (ws[addr]?.t === "n") ws[addr].z = "0";
    }
  }

  // Hyperlinks with blue font
  for (const k of ["ficha_pdf_url", "url_activo", "url_info_detallada"]) {
    const c = colIndex[k];
    if (c == null) continue;
    for (let r = 1; r <= range.e.r; r++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr];
      if (cell && typeof cell.v === "string" && cell.v.startsWith("http")) {
        cell.t = "s";
        // @ts-ignore
        cell.l = { Target: cell.v };
        cell.s = { ...(cell.s || {}), font: { color: { rgb: COLORS.linkBlue }, underline: true } };
        ws[addr] = cell;
      }
    }
  }
}