export enum AccountType {
  ASSET = "asset",
  CONTRA_ASSET = "contra_asset",
  LIABILITY = "liability",
  EQUITY = "equity",
  CONTRA_EQUITY = "contra_equity",
  REVENUE = "revenue",
  CONTRA_REVENUE = "contra_revenue",
  COGS = "cogs",
  EXPENSE = "expense",
  CONTRA_EXPENSE = "contra_expense",
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.ASSET]: "Aset",
  [AccountType.CONTRA_ASSET]: "Kontra Aset",
  [AccountType.LIABILITY]: "Liabilitas",
  [AccountType.EQUITY]: "Ekuitas",
  [AccountType.CONTRA_EQUITY]: "Kontra Ekuitas",
  [AccountType.REVENUE]: "Pendapatan",
  [AccountType.CONTRA_REVENUE]: "Kontra Pendapatan",
  [AccountType.COGS]: "Harga Pokok Penjualan",
  [AccountType.EXPENSE]: "Beban",
  [AccountType.CONTRA_EXPENSE]: "Kontra Beban",
};
