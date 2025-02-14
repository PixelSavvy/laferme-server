import { Worksheet } from "exceljs";

export const formatExcelFile = (worksheet: Worksheet) => {
  const header = worksheet.getRow(1);
  const startIndex = 1;
  const endIndex = worksheet.columnCount;

  for (let col = startIndex; col <= endIndex; col++) {
    const cell = header.getCell(col);
    cell.font = {
      bold: true,
      size: 12,
      color: {
        argb: "FFFFFFFF",
      },
    }; // Make headers bold with size 12
    cell.alignment = { horizontal: "center", vertical: "middle" }; // Center alignment
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" }, // Light blue fill color
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };
  }

  worksheet.columns.forEach((column) => {
    if (!column.values || !column.header) return;
    const lengths = column.values.map((v) => {
      if (v === null || v === undefined) return 0;
      if (typeof v === "object") return v.toString().length;
      return v.toString().length;
    });
    const maxLength = Math.max(Math.max(...lengths.filter((v) => typeof v === "number")) + 2, column.header.length + 12);
    column.width = maxLength;
  });

  worksheet.autoFilter = {
    from: {
      row: 1,
      column: 1,
    },
    to: {
      row: worksheet.rowCount,
      column: worksheet.columnCount,
    },
  };
};
