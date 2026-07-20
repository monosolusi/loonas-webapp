import { DateTime } from "luxon";

// Formats the period line shown in a financial-statement masthead (kop laporan).
// Point-in-time statements (Neraca, Neraca Saldo, Catatan) read "Per 31 Desember 2025".
// Flow statements (Laba Rugi, Arus Kas, Buku Besar) read
// "Periode 1 Januari 2025 – 31 Desember 2025".

const FULL_DATE = "dd MMMM yyyy";

function formatJsDate(date: Date | undefined): string | null {
  if (!date) return null;
  return DateTime.fromJSDate(date).setLocale("id").toFormat(FULL_DATE);
}

export function formatStatementAsOfLabel(date: Date | undefined): string {
  const formatted = formatJsDate(date);
  return formatted ? `Per ${formatted}` : "Pilih tanggal laporan";
}

export function formatStatementRangeLabel(range: { from: Date | undefined; to: Date | undefined }): string {
  const from = formatJsDate(range.from);
  const to = formatJsDate(range.to);
  if (from && to) return `Periode ${from} – ${to}`;
  if (from) return `Mulai ${from}`;
  return "Pilih periode laporan";
}
