import { useMemo } from "react";
import { JournalLineDraft, JournalLineBalance } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor.types";
import { computeJournalLineBalance } from "@/features/accounting/presentations/helpers/compute-journal-line-balance";

export function useJournalLineBalance(lines: JournalLineDraft[]): JournalLineBalance {
  return useMemo(() => computeJournalLineBalance(lines), [lines]);
}
