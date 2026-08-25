"use client";

import Link from "next/link";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { ClosePeriodEscalationHint } from "@/features/accounting/presentations/components/close-period-escalation-hint";
import { ClosePeriodBlock } from "@/features/accounting/presentations/helpers/close-period-error";
import { CoaAccountRef } from "@/features/accounting/domain/entities/blocking-posting";
import { RetryFailedPostingsResult } from "@/features/accounting/domain/entities/retry-failed-postings-result";
import { deriveBlockingOverheadAccounts, hasUnattributedBlockingPosting } from "@/features/accounting/domain/helpers/blocking-posting";

function formatAccountLabel(account: CoaAccountRef): string {
  return `${account.code} — ${account.name}`;
}

function resolveRetryOutcomeMessage(outcome: RetryFailedPostingsResult): string {
  if (outcome.pendingAfterRetry === 0) {
    return outcome.attempted === 0
      ? "Tidak ada transaksi yang perlu diproses ulang saat ini."
      : `Berhasil! ${outcome.attempted.toLocaleString("id-ID")} transaksi telah diproses ulang. Coba tutup periode lagi.`;
  }
  return `Belum semua transaksi berhasil diproses ulang. ${outcome.pendingAfterRetry.toLocaleString("id-ID")} transaksi masih gagal.`;
}

type ClosePeriodBlockNoticeProps = {
  block: ClosePeriodBlock;
  /** Consecutive failed-close attempts — the escalation hint's original, kind-agnostic trigger. */
  failureCount: number;
  canRetry: boolean;
  isRetrying: boolean;
  retryErrorMessage: string | null;
  retryOutcome: RetryFailedPostingsResult | null;
  onRetry: () => void;
};

/**
 * Renders a close-period 422 block, shared by both close-period dialogs
 * (`/accounting/periods` and `/accounting/fixed-costs`). Names the overhead account(s) the server
 * attributed the block to, offers a self-service "retry" remedy when at least one is named, links to
 * the deselect surface, and shows the WhatsApp escalation hint either after repeated failures (any
 * kind — the original, kind-agnostic safety net) or immediately whenever a blocking posting could
 * not be turned into a self-service action.
 */
export function ClosePeriodBlockNotice({
  block,
  failureCount,
  canRetry,
  isRetrying,
  retryErrorMessage,
  retryOutcome,
  onRetry,
}: ClosePeriodBlockNoticeProps) {
  if (block.kind === "pph-final" || block.kind === "generic") {
    return (
      <div className="flex flex-col gap-y-2">
        <p className="text-sm text-warning-500">{block.message}</p>
        {failureCount >= 2 && <ClosePeriodEscalationHint />}
      </div>
    );
  }

  // Once a retry has produced a verified outcome, the current truth is `stillFailing` — not the
  // stale pre-retry diagnosis.
  const currentAccounts = retryOutcome ? deriveBlockingOverheadAccounts(retryOutcome.stillFailing) : block.overheadAccounts;
  const currentHasUnattributed = retryOutcome ? hasUnattributedBlockingPosting(retryOutcome.stillFailing) : block.hasUnattributed;
  const showEscalationHint = failureCount >= 2 || currentHasUnattributed;

  // `stillFailing` is the true remaining count, never capped — the cap notice only applies to the
  // original diagnosis's `postings` sample.
  let capNoticeText: string | null = null;
  if (!retryOutcome && block.postings !== null && block.totalCount !== null && block.totalCount > block.postings.length) {
    capNoticeText = `Menampilkan ${block.postings.length} dari ${block.totalCount.toLocaleString("id-ID")} transaksi bermasalah.`;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-sm text-warning-500">{block.message}</p>

      {currentAccounts.length > 0 && (
        <ul className="list-disc pl-4 text-sm text-warning-500">
          {currentAccounts.map((account) => (
            <li key={account.id}>{formatAccountLabel(account)}</li>
          ))}
        </ul>
      )}

      {capNoticeText && <p className="text-xs text-warning-500">{capNoticeText}</p>}

      <Link href="/accounting/overhead-accounts" className="text-sm text-primary-400 underline hover:text-primary-500">
        Kelola Akun Overhead
      </Link>

      {currentAccounts.length > 0 &&
        canRetry &&
        (retryErrorMessage ? (
          <p className="text-sm text-warning-500">{retryErrorMessage}</p>
        ) : (
          <SecondaryButton
            label="Coba Proses Ulang"
            loading={isRetrying}
            loadingLabel="Memproses ulang..."
            onClick={onRetry}
            outlined
            type="button"
          />
        ))}

      {retryOutcome && <p className="text-sm text-warning-500">{resolveRetryOutcomeMessage(retryOutcome)}</p>}

      {showEscalationHint && <ClosePeriodEscalationHint />}
    </div>
  );
}
