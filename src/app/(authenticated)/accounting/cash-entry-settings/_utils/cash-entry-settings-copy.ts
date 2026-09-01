import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { eligibleAccountTypesFor } from "@/features/accounting/domain/helpers/cash-category-eligibility";
import { ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";

/**
 * The "Akun Default" card copy and the per-field eligibility hint for the
 * `/accounting/cash-entry-settings` page, in one plain `.ts` module.
 *
 * This page configures the OFFSET-side default accounts for cash entries — the cash side of every
 * entry is fixed at CoA `1100` (Kas dan Setara Kas) and is not configurable (confirmed against the
 * live dev-api OpenAPI spec: neither the request nor the response schema for this endpoint has a
 * cash-account field). The spec's own prose disagrees on WHEN these offset accounts actually apply:
 * at description level, `CashEntrySettingsResponse` says they're "used when a category is not
 * supplied, or for curated categories that fall back to defaults"; at field level,
 * `default_income_account_id` says they're "used for direction=in entries with no explicit category",
 * while `CashEntryResponse` says flatly the offset side is "the account linked to the entry's
 * category". Neither trigger is confirmed, and separately `category_id` is `required` on
 * `POST /accounting/cash-entries` with the FE hard-blocking submit without one
 * (`cash-entries/new/_providers/cash-entry-create-provider.tsx`, "Pilih kategori kas."), so the
 * no-category trigger is not reachable in this product today. The card copy therefore states the
 * fields' PURPOSE only and deliberately does not assert a trigger condition it cannot stand behind —
 * do not re-add a trigger claim on the strength of one spec sentence. Living as inline JSX put it out
 * of reach of the node-env vitest suite; mirrors `onboarding/_utils/select-field-copy.ts`'s shape (one
 * nested const tree so the test can walk every leaf).
 */
export const CASH_ENTRY_SETTINGS_COPY = {
  defaultAccountCard: {
    title: "Akun Default",
    // USER-APPROVED verbatim — do not reword. Sentence 4 is the pre-existing forward-only copy, kept
    // verbatim ("Atur akun bawaan untuk pencatatan kas masuk dan kas keluar. Perubahan hanya berlaku
    // untuk transaksi berikutnya — transaksi yang sudah tercatat tetap memakai akun lama."). Sentences
    // 1-2 (the CoA-1100 assertions) are NEW in this PR, sourced from the `CashEntrySettingsResponse`
    // schema description on the live dev-api spec, which does state the cash side is fixed at CoA 1100
    // and not configurable. Sentence 3 states the offset fields' purpose without asserting an
    // unverifiable trigger condition (see module doc-comment above).
    description:
      "Setiap transaksi kas dicatat pada akun kas 1100 (Kas dan Setara Kas). Akun kas ini tetap dan tidak dapat diubah. Kolom di bawah mengatur akun lawan (offset) bawaan untuk transaksi kas masuk dan kas keluar. Perubahan hanya berlaku untuk transaksi berikutnya — transaksi yang sudah tercatat tetap memakai akun lama.",
  },
} as const;

/**
 * The per-field account-type constraint hint, derived from the same `eligibleAccountTypesFor` the form
 * already filters pickers with — never retyped, so the hint cannot drift from the actual filter.
 */
export function resolveEligibleAccountTypesHint(direction: CashEntryDirection): string {
  const labels = eligibleAccountTypesFor(direction).map((type) => ACCOUNT_TYPE_LABELS[type]);
  return `Hanya akun bertipe ${labels.join(" atau ")}.`;
}
