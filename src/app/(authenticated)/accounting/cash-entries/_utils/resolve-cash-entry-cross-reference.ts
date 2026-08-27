import { CashEntryStatusChip } from "@/app/(authenticated)/accounting/cash-entries/_utils/resolve-cash-entry-status-chip";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";

export type CashEntryCrossReference =
  | { kind: "none" }
  | {
      kind: "is-cancellation";
      targetId: string | null;
      chip: CashEntryStatusChip;
      copy: string;
      linkLabel: string;
    }
  | {
      kind: "was-cancelled";
      targetId: string | null;
      chip: CashEntryStatusChip;
      copy: string;
      linkLabel: string;
    };

/**
 * Pure `CashEntryEntity → CrossReference`. Unlike `journal-reversal-status-card.tsx`'s template
 * (which ANDs the flag with the target id — `isReversal && reversedJournalId` — so a flagged
 * entity with a missing id silently renders nothing), the STATUS ALONE selects the branch here.
 * A missing `targetId` still yields a visible chip, just without a link — never a silently
 * absent card.
 */
export function resolveCashEntryCrossReference(entry: CashEntryEntity): CashEntryCrossReference {
  switch (entry.status) {
    case CashEntryStatus.Active:
      return { kind: "none" };
    case CashEntryStatus.Cancellation:
      return {
        kind: "is-cancellation",
        targetId: entry.cancelsId,
        chip: { label: "Entri Pembatalan", variant: "primary" },
        copy: "Entri ini adalah pembatalan dari entri kas lain.",
        linkLabel: "Lihat entri asal",
      };
    case CashEntryStatus.Cancelled:
      return {
        kind: "was-cancelled",
        targetId: entry.cancelledById,
        chip: { label: "Sudah Dibatalkan", variant: "warning" },
        copy: "Entri kas ini telah dibatalkan.",
        linkLabel: "Lihat entri pembatalan",
      };
  }
}
