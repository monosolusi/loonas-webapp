import { JournalLineDraft } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor.types";

/**
 * Computes the 3200 (retained earnings) balancing line from a set of plain-input journal line drafts.
 *
 * Rule:
 *   residual = Σdebit − Σcredit  (integer arithmetic only, no float drift)
 *   residual > 0  → 3200 credit line (normal case)
 *   residual < 0  → 3200 debit  line (accumulated-deficit case — BE will 422 this)
 *   residual === 0 → no line returned
 *
 * @param inputLines  The lines derived from plain user inputs (excluding 3200).
 * @param account3200Id  The UUID of the 3200 account from the tenant's CoA.
 */
export function computeRetainedEarningsLine(
  inputLines: JournalLineDraft[],
  account3200Id: string,
): JournalLineDraft | null {
  let totalDebit = 0;
  let totalCredit = 0;
  for (const line of inputLines) {
    totalDebit += line.debit;
    totalCredit += line.credit;
  }

  const residual = totalDebit - totalCredit;

  if (residual > 0) {
    // More debits than credits → need a credit to 3200 to balance
    return { account_id: account3200Id, debit: 0, credit: residual };
  }
  if (residual < 0) {
    // More credits than debits → need a debit to 3200 (deficit case)
    return { account_id: account3200Id, debit: -residual, credit: 0 };
  }
  return null;
}
