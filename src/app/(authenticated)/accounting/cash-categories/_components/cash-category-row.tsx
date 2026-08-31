"use client";

import clsx from "clsx";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { resolveAccountLabel } from "@/app/(authenticated)/accounting/cash-categories/_utils/account-label";
import { resolveCategoryActions } from "@/app/(authenticated)/accounting/cash-categories/_utils/resolve-category-actions";
import { directionLabel } from "@/app/(authenticated)/accounting/cash-categories/_utils/direction-label";

// Shared with the `TableHeader` in `cash-categories-list-impl.tsx` — the header and the desktop
// rows must stay in lockstep, so the literal lives in exactly one module.
export const CASH_CATEGORY_GRID_COLUMNS = "grid-cols-[0.8fr_1.2fr_1.6fr_0.7fr_56px]";

type CashCategoryRowProps = {
  category: CashCategoryEntity;
  onEdit: (category: CashCategoryEntity) => void;
  onDelete: (category: CashCategoryEntity) => void;
};

export function CashCategoryRow({ category, onEdit, onDelete }: CashCategoryRowProps) {
  const actions = resolveCategoryActions(category.isCurated);
  const accountLabel = resolveAccountLabel(category.account);

  const menuOptions: ActionMenuOption[] = actions.hasMenu
    ? actions.options.map((option) => ({
        label: option.label,
        variant: option.variant,
        onClick: () => (option.kind === "edit" ? onEdit(category) : onDelete(category)),
      }))
    : [];

  return (
    <>
      {/* Desktop: grid row (lg and up). A curated row renders no action menu at all — ActionMenu
          has no disabled state, so absence of the menu is the disabled state. */}
      <div
        className={clsx(
          "hidden items-center gap-x-2 border-b border-neutral-100 px-6 py-4 last:border-b-0 lg:grid",
          CASH_CATEGORY_GRID_COLUMNS,
        )}
      >
        <span className="text-sm text-neutral-400">{directionLabel(category.direction)}</span>
        <span className="truncate text-sm font-medium text-neutral-500">{category.name}</span>
        <span className="truncate text-sm text-neutral-400">
          {accountLabel ?? <span className="text-neutral-200">—</span>}
        </span>
        <div className="flex flex-col items-start">
          {category.isCurated && <StatusChip label="Bawaan" variant="neutral" compact />}
        </div>
        <div className="flex justify-end">{actions.hasMenu && <ActionMenu options={menuOptions} />}</div>
      </div>

      {/* Mobile: stacked card (below lg). */}
      <div className="lg:hidden">
        <MobileListCard
          title={category.name}
          subtitle={
            <>
              {directionLabel(category.direction)} · {accountLabel ?? <span className="text-neutral-200">—</span>}
            </>
          }
          trailingTop={category.isCurated ? <StatusChip label="Bawaan" variant="neutral" compact /> : undefined}
          trailingBottom={actions.hasMenu ? <ActionMenu options={menuOptions} /> : undefined}
        />
      </div>
    </>
  );
}
