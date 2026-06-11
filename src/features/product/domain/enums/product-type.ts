export const ProductType = {
  MANUFACTURED: "manufactured",
  TRADING: "trading",
  SERVICE: "service",
} as const;

export type ProductTypeType = (typeof ProductType)[keyof typeof ProductType];

export const ProductTypeLabel: Record<ProductTypeType, string> = {
  [ProductType.MANUFACTURED]: "Produk Olahan",
  [ProductType.TRADING]: "Barang Dagang",
  [ProductType.SERVICE]: "Jasa",
};
