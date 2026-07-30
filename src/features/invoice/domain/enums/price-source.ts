export const PriceSource = {
  BASE: "base",
  TIER: "tier",
} as const;

export type PriceSourceType = (typeof PriceSource)[keyof typeof PriceSource];
