import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";

export type PphFinalWarningDetails = {
  period: string;               // "yyyy-MM"
  tenantRegime: string;         // "pph_final_umkm"
  expectedAccountCode: string;  // "8110"
  periodDpp: number;            // whole rupiah (converted from BE minor units at parse boundary)
  setorDeadline: string;        // "yyyy-MM-dd"
};

export type CloseWarning = {
  code: string;
  message: string;
  details: PphFinalWarningDetails | null;
};

export type ClosePeriodResult = {
  period: AccountingPeriodEntity;
  warnings: CloseWarning[];
};
