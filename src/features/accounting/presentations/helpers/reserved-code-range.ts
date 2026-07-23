import { AccountType } from "@/features/accounting/domain/enums/account-type";

type CodeRangeHint = {
  reserved: string;
  reservedName: string;
  alternative: string;
  alternativeDescription: string;
};

// Advisory range hints per type. Boundaries are server-authoritative (400 CODE_RESERVED).
const RANGE_HINTS: Partial<Record<AccountType, CodeRangeHint>> = {
  [AccountType.CONTRA_ASSET]: {
    reserved: "1xxx",
    reservedName: "Kontra Aset",
    alternative: "19xx",
    alternativeDescription: "akun kontra aset",
  },
  [AccountType.CONTRA_EQUITY]: {
    reserved: "3xxx",
    reservedName: "Kontra Ekuitas",
    alternative: "39xx",
    alternativeDescription: "akun kontra ekuitas",
  },
  [AccountType.CONTRA_REVENUE]: {
    reserved: "4xxx",
    reservedName: "Kontra Pendapatan",
    alternative: "49xx",
    alternativeDescription: "akun kontra pendapatan",
  },
  [AccountType.CONTRA_EXPENSE]: {
    reserved: "6xxx–8xxx",
    reservedName: "Kontra Beban",
    alternative: "69xx atau 79xx",
    alternativeDescription: "akun kontra beban",
  },
};

/**
 * Returns an advisory hint string for the given account type's code range.
 * Advisory only — server 400 CODE_RESERVED is the authoritative boundary.
 */
export function getCodeRangeHint(type: AccountType): string | null {
  const hint = RANGE_HINTS[type];
  if (!hint) return null;
  return `${hint.reserved} dicadangkan untuk ${hint.reservedName}. Gunakan rentang ${hint.alternative} untuk ${hint.alternativeDescription}.`;
}
