// Transcribed verbatim from the merged balance `openapi.yaml` (LNS-744, as corrected by
// LNS-753). The colocated test pins `Object.values(SourceRefType)` to a literal array, so a
// one-sided edit to either this declaration or that array fails CI.
export const SourceRefType = {
  PAYMENT_PAY_IN: "payment.pay_in",
} as const;

export type SourceRefTypeType = (typeof SourceRefType)[keyof typeof SourceRefType];

// Exhaustive by type: deleting an entry fails `npm run typecheck`. The unknown-member
// fallback (`?? t`) is deliberately NOT here — LNS-756's `_utils/movement-row-display.ts`
// is its single owner.
export const SourceRefTypeLabel: Record<SourceRefTypeType, string> = {
  [SourceRefType.PAYMENT_PAY_IN]: "Pembayaran Masuk",
};
