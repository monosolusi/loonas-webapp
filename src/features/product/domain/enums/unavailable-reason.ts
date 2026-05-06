export const UnavailableReason = {
  OUT_OF_STOCK: "OUT_OF_STOCK",
  STOCK_NOT_REGISTERED: "STOCK_NOT_REGISTERED",
  RECIPE_NOT_DEFINED: "RECIPE_NOT_DEFINED",
  RAW_MATERIAL_NOT_REGISTERED: "RAW_MATERIAL_NOT_REGISTERED",
} as const;

export type UnavailableReason = (typeof UnavailableReason)[keyof typeof UnavailableReason];
