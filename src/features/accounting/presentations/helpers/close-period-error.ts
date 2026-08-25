import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BlockingPosting, CoaAccountRef } from "@/features/accounting/domain/entities/blocking-posting";
import {
  deriveBlockingOverheadAccounts,
  hasUnattributedBlockingPosting,
  parseCoaAccountRef,
} from "@/features/accounting/domain/helpers/blocking-posting";

export type ClosePeriodBlock =
  | {
      kind: "failed-postings" | "not-drained";
      message: string;
      totalCount: number | null;
      postings: BlockingPosting[] | null;
      overheadAccounts: CoaAccountRef[];
      hasUnattributed: boolean;
    }
  | { kind: "pph-final"; message: string }
  | { kind: "generic"; message: string };

function parseBlockingPosting(value: unknown): BlockingPosting | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  return {
    sourceTable: typeof v["source_table"] === "string" ? v["source_table"] : "",
    outboxId: typeof v["outbox_id"] === "string" ? v["outbox_id"] : "",
    errorCode: typeof v["error_code"] === "string" ? v["error_code"] : null,
    coaAccount: parseCoaAccountRef(v["coa_account"]),
  };
}

/**
 * `blocking_postings` is ABSENT from the body entirely (not `[]`) when the server itself could not
 * diagnose the block — absence means "no diagnosis available" and must render distinctly from an
 * empty array, which would (incorrectly) mean "nothing is blocking".
 */
function parseBlockingPostings(value: unknown): BlockingPosting[] | null {
  if (!Array.isArray(value)) return null;
  return value.map(parseBlockingPosting).filter((p): p is BlockingPosting => p !== null);
}

function parseCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 1 ? value : null;
}

function buildDiagnosedBlock(
  kind: "failed-postings" | "not-drained",
  err: ServerError,
  countField: "failed_count" | "unacked_count",
  fallbackMessage: string,
  countMessage: (count: number) => string,
): ClosePeriodBlock {
  const totalCount = parseCount(err.details?.[countField]);
  const postings = parseBlockingPostings(err.details?.["blocking_postings"]);
  const overheadAccounts = postings ? deriveBlockingOverheadAccounts(postings) : [];
  const hasUnattributed = postings ? hasUnattributedBlockingPosting(postings) : false;

  return {
    kind,
    message: totalCount !== null ? countMessage(totalCount) : fallbackMessage,
    totalCount,
    postings,
    overheadAccounts,
    hasUnattributed,
  };
}

/**
 * Resolves a close-period 422 into a discriminated block description, shared by both close-period
 * entry points (`/accounting/periods` and `/accounting/fixed-costs`).
 *
 * The body is FLAT: `code`, `message`, `failed_count`, `unacked_count`, `blocking_postings` all sit
 * at the top level — `http-request.ts` forwards every unrecognised top-level key straight onto
 * `err.details`, so this reads `err.details.failed_count` directly, never a double-nested
 * `err.details.details.failed_count`. (That double-nested shape IS real, but only for
 * `VALIDATION_FAILED`'s Joi payload, which genuinely nests its `details`. This resolver used to read
 * the double-nested path for `PERIOD_HAS_FAILED_POSTINGS` too — the body has always been flat here,
 * so `failed_count` silently never rendered. See LNS-692.)
 */
export function resolveClosePeriodBlock(err: unknown): ClosePeriodBlock {
  if (!(err instanceof ServerError)) {
    return { kind: "generic", message: "Terjadi gangguan jaringan. Silakan coba lagi." };
  }

  if (err.code === ErrorCodes.PERIOD_HAS_FAILED_POSTINGS.code) {
    return buildDiagnosedBlock(
      "failed-postings",
      err,
      "failed_count",
      ErrorCodes.PERIOD_HAS_FAILED_POSTINGS.message,
      (count) =>
        `Periode belum bisa dikunci. Ada ${count.toLocaleString("id-ID")} transaksi yang gagal tercatat ke pembukuan dan perlu diselesaikan sebelum periode ini bisa ditutup.`,
    );
  }

  // Explicit branch — this used to be the silent catch-all for every unrecognised 422, so an
  // unrelated failure was mislabelled with this copy. It now also carries `blocking_postings`.
  if (err.code === ErrorCodes.PERIOD_NOT_DRAINED.code) {
    return buildDiagnosedBlock(
      "not-drained",
      err,
      "unacked_count",
      ErrorCodes.PERIOD_NOT_DRAINED.message,
      (count) =>
        `Periode belum bisa dikunci. Ada ${count.toLocaleString("id-ID")} transaksi yang masih diproses ke pembukuan. Coba lagi setelah beberapa saat, atau selesaikan transaksi yang gagal terlebih dahulu.`,
    );
  }

  if (err.code === ErrorCodes.PPH_FINAL_NOT_POSTED.code) {
    return { kind: "pph-final", message: ErrorCodes.PPH_FINAL_NOT_POSTED.message };
  }

  // A genuinely unrecognised code must get a genuinely generic message — never dressed up as one of
  // the known ones above.
  return { kind: "generic", message: err.message ?? "Periode belum bisa dikunci. Silakan coba lagi." };
}

/**
 * True when `err` is a `PERIOD_HAS_FAILED_POSTINGS` 422 — the only close-period error code that
 * feeds the consecutive-failure escalation counter in both providers.
 */
export function isPeriodHasFailedPostingsError(err: unknown): boolean {
  return err instanceof ServerError && err.httpCode === 422 && err.code === ErrorCodes.PERIOD_HAS_FAILED_POSTINGS.code;
}
