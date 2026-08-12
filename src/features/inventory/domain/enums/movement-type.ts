export const MovementType = {
  PURCHASE: "purchase",
  PRODUCTION_IN: "production_in",
  PRODUCTION_OUT: "production_out",
  SALE: "sale",
  OPNAME_ADJUSTMENT: "opname_adjustment",
  WRITE_OFF: "write_off",
} as const;

export type MovementTypeType = (typeof MovementType)[keyof typeof MovementType];

export const MovementTypeLabel: Record<MovementTypeType, string> = {
  [MovementType.PURCHASE]: "Pembelian",
  [MovementType.PRODUCTION_IN]: "Produksi Masuk",
  [MovementType.PRODUCTION_OUT]: "Produksi Keluar",
  [MovementType.SALE]: "Penjualan",
  [MovementType.OPNAME_ADJUSTMENT]: "Penyesuaian Opname",
  [MovementType.WRITE_OFF]: "Penghapusan",
};
