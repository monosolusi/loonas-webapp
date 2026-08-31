import { CashCategoryAccountEntity } from "@/features/accounting/domain/entities/cash-category-account";

/**
 * `CashCategoryAccountModel.fromJson` defaults a nullable `code`/`name` to `""`, and the BE can
 * emit null there — so "no label" is a real state of this resource, not a zero. Returning `null`
 * is the render-an-em-dash signal (`text-neutral-200`); the caller owns the styling. Never return
 * a fabricated placeholder for it.
 */
export function resolveAccountLabel(account: CashCategoryAccountEntity): string | null {
  const code = account.code.trim();
  const name = account.name.trim();

  if (code && name) return `${code} — ${name}`;
  return code || name || null;
}
