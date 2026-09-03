import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { eligibleAccountTypesFor } from "@/features/accounting/domain/helpers/cash-category-eligibility";
import { ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";

/**
 * Copy for the "Ubah Akun" dialog on `/accounting/cash-categories` — LNS-788's replacement for the
 * deleted standalone "Pengaturan Kas" settings page, which this PR removes. Sentence 1 and the
 * final sentence are BYTE-IDENTICAL to that deleted page's copy module's
 * `defaultAccountCard.description` (USER-APPROVED copy decision); only the middle sentence changes,
 * from "...bawaan untuk transaksi kas masuk dan kas keluar." to "...untuk kategori ini." — this
 * dialog remaps ONE category's account, not the cash-entry-wide defaults the old page configured.
 * Living as a plain `.ts` module (not inline JSX) keeps it reachable by the node-env vitest suite.
 */
export const CASH_CATEGORY_ACCOUNT_COPY = {
  description:
    "Setiap transaksi kas dicatat pada akun kas 1100 (Kas dan Setara Kas). Akun kas ini tetap dan tidak dapat diubah. Kolom di bawah mengatur akun lawan (offset) untuk kategori ini. Perubahan hanya berlaku untuk transaksi berikutnya — transaksi yang sudah tercatat tetap memakai akun lama.",
  nameImmutableHint: "Nama kategori bawaan tidak dapat diubah.",
  missingSavedAccountNotice:
    "Akun yang tersimpan tidak ditemukan di daftar akun. Pilih akun baru untuk memperbaikinya.",
  /** No manual retry affordance is wired here — SWR retries failed fetches automatically
   *  app-wide (`swr-provider.tsx`'s `shouldRetryOnError`), so the copy says so instead of
   *  instructing an action (e.g. "coba lagi") that has nothing to do. */
  accountListErrorNotice: "Gagal memuat daftar akun. Daftar akan dimuat ulang secara otomatis.",
} as const;

/**
 * The per-field account-type constraint hint. Moved here (not retyped) from the deleted settings
 * page's copy module — still derived from the same `eligibleAccountTypesFor` the dialog's picker
 * `filter` uses, so the hint and the option list it describes cannot drift apart.
 */
export function resolveEligibleAccountTypesHint(direction: CashEntryDirection): string {
  const labels = eligibleAccountTypesFor(direction).map((type) => ACCOUNT_TYPE_LABELS[type]);
  return `Hanya akun bertipe ${labels.join(" atau ")}.`;
}
