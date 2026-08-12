export const TierMode = {
  VOLUME: "VOLUME",
  GRADUATED: "GRADUATED",
} as const;

export type TierModeType = (typeof TierMode)[keyof typeof TierMode];

export const TierModeLabel: Record<TierModeType, string> = {
  [TierMode.VOLUME]: "Harga Borongan",
  [TierMode.GRADUATED]: "Harga Bertingkat",
};

export const TierModeDescription: Record<TierModeType, string> = {
  [TierMode.VOLUME]: "Seluruh jumlah dihargai sama, mengikuti tingkat tertinggi yang tercapai.",
  [TierMode.GRADUATED]: "Tiap tingkat dihargai terpisah sesuai jumlahnya, lalu dijumlahkan.",
};
