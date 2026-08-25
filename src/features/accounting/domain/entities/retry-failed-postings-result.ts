import { BlockingPosting } from "@/features/accounting/domain/entities/blocking-posting";

/**
 * Verified outcome of `POST /accounting/periods/{id}/retry-failed-postings` — the result of a
 * synchronous drain, never an acknowledgement. `cleared = attempted - stillFailing.length` and
 * `pendingAfterRetry = stillFailing.length`; `attempted: 0` with an empty `stillFailing` means
 * nothing was eligible to retry.
 */
export type RetryFailedPostingsResult = {
  periodId: string;
  attempted: number;
  cleared: number;
  pendingAfterRetry: number;
  stillFailing: BlockingPosting[];
};
