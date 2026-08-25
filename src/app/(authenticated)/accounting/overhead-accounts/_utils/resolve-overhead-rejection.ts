import { ErrorCodes, ServerError } from "@/core/resources/server-error";

/**
 * Maps a PUT /accounting/overhead-accounts failure to either a per-account rejection list
 * (422 OVERHEAD_ACCOUNT_NOT_SELECTABLE) or a generic fallback message.
 *
 * The 422 body is FLAT — `accounts` sits at the top level alongside `code`/`message`, with no
 * `details` envelope. `HttpRequest` forwards unrecognised top-level keys onto `ServerError.details`
 * (the same mechanism PRICE_TIER_SCHEDULE_INVALID uses), so this reads `err.details.accounts` —
 * never the double-nested `err.details.details.accounts` shape some other 422s use.
 */

export const OverheadAccountRejectionReason = {
  RESERVED_CODE: "reserved_code",
  SYSTEM_POSTING_CODE: "system_posting_code",
  COA_MAPPING_TARGET: "coa_mapping_target",
} as const;

export type OverheadAccountRejectionReasonType =
  (typeof OverheadAccountRejectionReason)[keyof typeof OverheadAccountRejectionReason];

export type OverheadAccountRejection = {
  id: string;
  code: string;
  name: string;
  reason: OverheadAccountRejectionReasonType | null;
  message: string;
};

export type OverheadRejectionInfo =
  | { kind: "not-selectable"; accounts: OverheadAccountRejection[] }
  | { kind: "generic"; message: string };

function messageForReason(reason: unknown): string {
  switch (reason) {
    case OverheadAccountRejectionReason.RESERVED_CODE:
      return "Kode akun ini dicadangkan untuk sistem.";
    case OverheadAccountRejectionReason.SYSTEM_POSTING_CODE:
      return "Akun ini digunakan untuk posting otomatis sistem.";
    case OverheadAccountRejectionReason.COA_MAPPING_TARGET:
      return "Akun ini menjadi target Pemetaan Akun.";
    default:
      // An unrecognised reason must not be dressed up as one of the three known ones.
      return "Akun ini tidak dapat dipilih sebagai akun overhead.";
  }
}

function parseAccounts(value: unknown): OverheadAccountRejection[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, any> => !!entry && typeof entry === "object")
    .map((entry) => {
      const reason = typeof entry["reason"] === "string" ? (entry["reason"] as OverheadAccountRejectionReasonType) : null;
      return {
        id: typeof entry["id"] === "string" ? entry["id"] : "",
        code: typeof entry["code"] === "string" ? entry["code"] : "",
        name: typeof entry["name"] === "string" ? entry["name"] : "",
        reason,
        message: messageForReason(reason),
      };
    });
}

export function resolveOverheadRejection(err: unknown): OverheadRejectionInfo {
  if (!(err instanceof ServerError)) {
    return { kind: "generic", message: "Terjadi gangguan jaringan. Silakan coba lagi." };
  }

  if (err.code === ErrorCodes.OVERHEAD_ACCOUNT_NOT_SELECTABLE.code) {
    const accounts = parseAccounts(err.details?.["accounts"]);
    // Shape present but the account list is missing or malformed — fall back rather than
    // rendering an empty, unexplained banner.
    if (accounts.length === 0) {
      return { kind: "generic", message: ErrorCodes.OVERHEAD_ACCOUNT_NOT_SELECTABLE.message };
    }
    return { kind: "not-selectable", accounts };
  }

  return { kind: "generic", message: err.message ?? "Gagal menyimpan akun overhead. Silakan coba lagi." };
}
