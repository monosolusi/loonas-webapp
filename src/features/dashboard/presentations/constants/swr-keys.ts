export const DASHBOARD_SWR_KEYS = {
  DASHBOARD_STATISTICS: "dashboard-statistics",
  // Tile + chart intentionally share this key — one fetch, both consumers; "Coba lagi" on either refetches both.
  DASHBOARD_REVENUE_SERIES: "dashboard-revenue-series",
} as const;
