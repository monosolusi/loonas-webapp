import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

/**
 * `"choose"` represents "no direction yet" as a real state rather than letting the caller fall
 * back to a default — see the `mode` discriminant note below.
 */
export type CreateDirectionResolution =
  | { readonly mode: "fixed"; readonly direction: CashEntryDirection }
  | { readonly mode: "choose" };

/**
 * Resolves the "Tambah Kategori" dialog's starting direction from the list page's active tab
 * (`CashCategoriesProvider.direction`, `undefined` = "Semua"). A specific tab (Kas Masuk / Kas
 * Keluar) fixes the created category's direction — there is nothing to pick. "Semua" carries no
 * direction to inherit, so it resolves to `{ mode: "choose" }`: the dialog renders a blank
 * selector and forces a deliberate pick. Keying off the VALUE (not a tab index) makes "no
 * direction yet" representable, so silently defaulting to `In` is structurally impossible.
 */
export function resolveCreateDirection(tab: CashEntryDirection | undefined): CreateDirectionResolution {
  if (tab === undefined) return { mode: "choose" };
  return { mode: "fixed", direction: tab };
}
