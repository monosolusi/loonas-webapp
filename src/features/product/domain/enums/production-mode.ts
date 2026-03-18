export const ProductionMode = {
  BATCH: "batch",
  ON_DEMAND: "on_demand",
} as const;

export type ProductionModeType = (typeof ProductionMode)[keyof typeof ProductionMode];

export const ProductionModeLabel: Record<ProductionModeType, string> = {
  [ProductionMode.BATCH]: "Produksi Batch",
  [ProductionMode.ON_DEMAND]: "Dibuat Saat Order",
};
