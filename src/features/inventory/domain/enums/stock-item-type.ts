export const StockItemType = {
  RAW_MATERIAL: "raw_material",
  FINISHED_GOODS: "finished_goods",
} as const;

export type StockItemTypeType = (typeof StockItemType)[keyof typeof StockItemType];

export const StockItemTypeLabel: Record<StockItemTypeType, string> = {
  [StockItemType.RAW_MATERIAL]: "Bahan Baku",
  [StockItemType.FINISHED_GOODS]: "Produk Jadi",
};
