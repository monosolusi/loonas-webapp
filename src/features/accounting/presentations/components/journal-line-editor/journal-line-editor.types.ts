import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

export type JournalLineDraft = {
  account_id: string | null;
  debit: number;
  credit: number;
};

export type AccountFilter = (account: LedgerAccountEntity) => boolean;

export type JournalLineEditorProps = {
  lines: JournalLineDraft[];
  onChange: (next: JournalLineDraft[]) => void;
  accountFilter?: AccountFilter;
  disabled?: boolean;
  error?: string;
};

export type JournalLineBalance = {
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
};
