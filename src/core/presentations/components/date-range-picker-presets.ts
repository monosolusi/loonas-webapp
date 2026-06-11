import { DateTime } from "luxon";

export const TZ = "Asia/Jakarta";

export const PRESETS = [
  {
    label: "Bulan ini",
    getRange: () => ({
      from: DateTime.now().setZone(TZ).startOf("month").toJSDate(),
      to: DateTime.now().setZone(TZ).toJSDate(),
    }),
  },
  {
    label: "7 hari terakhir",
    getRange: () => ({
      from: DateTime.now().setZone(TZ).minus({ days: 6 }).toJSDate(),
      to: DateTime.now().setZone(TZ).toJSDate(),
    }),
  },
  {
    label: "14 hari terakhir",
    getRange: () => ({
      from: DateTime.now().setZone(TZ).minus({ days: 13 }).toJSDate(),
      to: DateTime.now().setZone(TZ).toJSDate(),
    }),
  },
  {
    label: "30 hari terakhir",
    getRange: () => ({
      from: DateTime.now().setZone(TZ).minus({ days: 29 }).toJSDate(),
      to: DateTime.now().setZone(TZ).toJSDate(),
    }),
  },
];

export function formatDate(date: Date | undefined): string | null {
  if (!date) return null;
  return DateTime.fromJSDate(date).setLocale("id").toFormat("d MMM yyyy");
}

export function resolveLabel(from: Date | undefined, to: Date | undefined): string {
  if (!from || !to) return "Pilih periode";
  const fromDt = DateTime.fromJSDate(from).setZone(TZ);
  const toDt = DateTime.fromJSDate(to).setZone(TZ);
  const matchedPreset = PRESETS.find((preset) => {
    const range = preset.getRange();
    const presetFrom = DateTime.fromJSDate(range.from).setZone(TZ);
    const presetTo = DateTime.fromJSDate(range.to).setZone(TZ);
    return fromDt.toISODate() === presetFrom.toISODate() && toDt.toISODate() === presetTo.toISODate();
  });
  if (matchedPreset) return matchedPreset.label;
  const fromFormatted = formatDate(from);
  if (!fromFormatted) return "Pilih periode";
  const toFormatted = formatDate(to);
  if (!toFormatted) return fromFormatted;
  return `${fromFormatted} — ${toFormatted}`;
}
