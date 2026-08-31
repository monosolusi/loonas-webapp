"use client";

import { CashEntryFeatureGate } from "@/app/(authenticated)/accounting/_components/cash-entry-feature-gate";
import { CashEntryCreateProvider } from "@/app/(authenticated)/accounting/cash-entries/new/_providers/cash-entry-create-provider";
import { CashEntryCreateForm } from "@/app/(authenticated)/accounting/cash-entries/new/_components/cash-entry-create-form";

export default function CashEntryCreatePage() {
  return (
    <CashEntryFeatureGate>
      <CashEntryCreateProvider>
        <CashEntryCreateForm />
      </CashEntryCreateProvider>
    </CashEntryFeatureGate>
  );
}
