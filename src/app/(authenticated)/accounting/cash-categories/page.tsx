"use client";

import { Suspense } from "react";
import { CashEntryFeatureGate } from "@/app/(authenticated)/accounting/_components/cash-entry-feature-gate";
import { CashCategoriesProvider } from "@/app/(authenticated)/accounting/cash-categories/_providers/cash-categories-provider";
import { CashCategoriesListImpl } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-categories-list-impl";
import { CashCategoryEditDialog } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-category-edit-dialog";
import { CashCategoryDeleteDialog } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-category-delete-dialog";
import { CashCategoryCreateDialog } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-category-create-dialog";

export default function CashCategoriesPage() {
  return (
    <Suspense>
      <CashEntryFeatureGate>
        <CashCategoriesProvider>
          <CashCategoriesListImpl />
          <CashCategoryEditDialog />
          <CashCategoryDeleteDialog />
          <CashCategoryCreateDialog />
        </CashCategoriesProvider>
      </CashEntryFeatureGate>
    </Suspense>
  );
}
