"use client";

import { CashEntryFeatureGate } from "@/app/(authenticated)/accounting/_components/cash-entry-feature-gate";
import { CashEntrySettingsProvider } from "@/app/(authenticated)/accounting/cash-entry-settings/_providers/cash-entry-settings-provider";
import { CashEntrySettingsSkeleton } from "@/app/(authenticated)/accounting/cash-entry-settings/_components/cash-entry-settings-skeleton";
import { CashEntrySettingsForm } from "@/app/(authenticated)/accounting/cash-entry-settings/_components/cash-entry-settings-form";

export default function CashEntrySettingsPage() {
  return (
    <CashEntryFeatureGate>
      <CashEntrySettingsProvider loading={<CashEntrySettingsSkeleton />}>
        <CashEntrySettingsForm />
      </CashEntrySettingsProvider>
    </CashEntryFeatureGate>
  );
}
