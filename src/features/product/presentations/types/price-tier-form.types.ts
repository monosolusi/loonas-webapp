export type PriceTierFormRow = {
  key: string;
  /**
   * Raw user input, kept as a string on purpose.
   *
   * `min_qty` may be fractional, and the shared `NumberInput` parses id-ID grouping —
   * it strips "." as a thousands separator, so a typed "1.5" becomes 15. Because 15 is
   * itself a valid threshold, nothing errors and the wrong schedule is saved silently.
   * Holding the raw text and parsing it here keeps "1,5" and "1.5" both meaning 1.5.
   */
  minQty: string;
  unitPrice: number;
};

export type PriceTierRowError = {
  minQty?: string;
  unitPrice?: string;
};

export type PriceTierRowErrors = Record<string, PriceTierRowError>;
