export const ProductStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type ProductStatusType = (typeof ProductStatus)[keyof typeof ProductStatus];
