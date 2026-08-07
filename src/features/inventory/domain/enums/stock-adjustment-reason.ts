export const StockAdjustmentReason = {
  SHRINKAGE: "shrinkage",
  RECOUNT_OVERAGE: "recount_overage",
  OWNER_WITHDRAWAL: "owner_withdrawal",
  PROMOTIONAL_GIVEAWAY: "promotional_giveaway",
  STAFF_CONSUMPTION: "staff_consumption",
  BUSINESS_USE: "business_use",
} as const;

export type StockAdjustmentReasonType = (typeof StockAdjustmentReason)[keyof typeof StockAdjustmentReason];

// Labels are lifted verbatim from the OpenAPI reason descriptions (the bold
// Indonesian lead-in sentences) — the backend wording is carefully chosen and
// must not be shortened or paraphrased.
export const StockAdjustmentReasonLabel: Record<StockAdjustmentReasonType, string> = {
  [StockAdjustmentReason.SHRINKAGE]: "Barang hilang, rusak, atau kedaluwarsa.",
  [StockAdjustmentReason.RECOUNT_OVERAGE]: "Stok fisik lebih banyak dari catatan pembukuan.",
  [StockAdjustmentReason.OWNER_WITHDRAWAL]: "Diambil pemilik untuk keperluan pribadi (prive).",
  [StockAdjustmentReason.PROMOTIONAL_GIVEAWAY]: "Diberikan gratis, dipajang, atau dijadikan contoh untuk promosi.",
  [StockAdjustmentReason.STAFF_CONSUMPTION]: "Dimakan atau dipakai karyawan.",
  [StockAdjustmentReason.BUSINESS_USE]: "Dipakai sendiri untuk latihan, uji coba, atau operasional.",
};