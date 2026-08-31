export const MovementDirection = {
  CREDIT: "credit",
  DEBIT: "debit",
} as const;

export type MovementDirectionType = (typeof MovementDirection)[keyof typeof MovementDirection];

// "Masuk"/"Keluar", never "Kredit"/"Debit" — those are the accounting GL's words and this
// ledger is NOT the GL. Sharing the vocabulary would merge two unrelated systems in the
// reader's head.
export const MovementDirectionLabel: Record<MovementDirectionType, string> = {
  [MovementDirection.CREDIT]: "Masuk",
  [MovementDirection.DEBIT]: "Keluar",
};
