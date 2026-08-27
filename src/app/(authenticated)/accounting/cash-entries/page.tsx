"use client";

import { Suspense } from "react";
import { CashEntryFeatureGate } from "@/app/(authenticated)/accounting/_components/cash-entry-feature-gate";
import { CashEntriesListProvider } from "@/app/(authenticated)/accounting/cash-entries/_providers/cash-entries-list-provider";
import { CashEntriesView } from "@/app/(authenticated)/accounting/cash-entries/_components/cash-entries-view";

export default function CashEntriesPage() {
  return (
    <Suspense>
      <CashEntryFeatureGate>
        <CashEntriesListProvider>
          <CashEntriesView />
        </CashEntriesListProvider>
      </CashEntryFeatureGate>
    </Suspense>
  );
}
