import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

/**
 * ADVISORY picker pre-filter only — maps a cash direction onto the CoA account types a
 * category for that direction may post to. Money in posts to revenue; money out posts to
 * expense or asset (petty-cash style categories draw from an asset account). COGS and every
 * `CONTRA_*` type are excluded by construction: they are not reachable from either direction.
 *
 * The server owns the real gate: it rejects an incompatible pair with 422
 * `CASH_CATEGORY_DIRECTION_MISMATCH` on category create only (`direction` is not updatable, so PATCH cannot
 * mismatch — the category PATCH instead rejects with 409 `CASH_CATEGORY_REFERENCED` once the category is
 * referenced by a cash entry), and with 422 `CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH` on the category PATCH's
 * account-only remap (`/accounting/cash-categories` "Ubah Akun" dialog, LNS-788 — the standalone settings
 * page this used to describe was deleted by that ticket). Never use this mapping to decide whether a
 * request may be sent — use it only to narrow an account list before it reaches a picker, so a mismatch
 * stays a server-authoritative error and not a silent FE divergence.
 */
export function eligibleAccountTypesFor(direction: CashEntryDirection): AccountType[] {
  switch (direction) {
    case CashEntryDirection.In:
      return [AccountType.REVENUE];
    case CashEntryDirection.Out:
      return [AccountType.EXPENSE, AccountType.ASSET];
  }
}
