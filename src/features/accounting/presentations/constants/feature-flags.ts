/**
 * Feature-gate literal for managerial costing, shared across the accounting feature so every gated
 * surface (periods table, close-period failed-postings remedy) reads the same string. Consumed via
 * `account?.hasFeature(MANAGERIAL_COSTING_FEATURE)`.
 */
export const MANAGERIAL_COSTING_FEATURE = "managerial_costing" as const;
