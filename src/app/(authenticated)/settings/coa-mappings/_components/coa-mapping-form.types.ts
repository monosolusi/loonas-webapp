import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { CoaMappingLinePosition } from "@/features/accounting/domain/entities/coa-mapping-line";

export type CoaMappingLineFormItem = {
  key: string;
  account: LedgerAccountEntity | null;
  position: CoaMappingLinePosition;
  label: string;
};
