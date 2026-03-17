export enum AccountType {
  ASSET = "asset",
  LIABILITY = "liability",
  EQUITY = "equity",
  REVENUE = "revenue",
  COGS = "cogs",
  EXPENSE = "expense",
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.ASSET]: "Aset",
  [AccountType.LIABILITY]: "Liabilitas",
  [AccountType.EQUITY]: "Ekuitas",
  [AccountType.REVENUE]: "Pendapatan",
  [AccountType.COGS]: "Harga Pokok Penjualan",
  [AccountType.EXPENSE]: "Beban",
};
