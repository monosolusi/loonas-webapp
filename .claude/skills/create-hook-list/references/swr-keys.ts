// Canonical example: SWR keys constant for a feature.
// Source: src/features/production/presentations/constants/swr-keys.ts
//
// Rules:
// - One constant object per feature, PascalCase-upper: {FEATURE}_SWR_KEYS.
// - Key names uppercase with underscores, values are kebab-case strings.
// - Keep list, get, and preview keys separate — they map to distinct caches.
// - Mutations revalidate these constants via revalidateSWRKey(KEY).

export const PRODUCTION_SWR_KEYS = {
  LIST_PRODUCTION_RECORDS: "list-production-records",
  GET_PRODUCTION_RECORD: "get-production-record",
  PREVIEW_PRODUCTION: "preview-production",
} as const;
