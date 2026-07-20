import { JournalLineDraft, JournalLineBalance } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor.types";

export function computeJournalLineBalance(lines: JournalLineDraft[]): JournalLineBalance {
  const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  return { totalDebit, totalCredit, isBalanced };
}
