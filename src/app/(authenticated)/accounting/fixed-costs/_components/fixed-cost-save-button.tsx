"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useFixedCostEntries } from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";

export function FixedCostSaveButton() {
  const { hasDirty, saving, save, isClosed } = useFixedCostEntries();

  return (
    <PrimaryButton
      label="Simpan"
      disabled={!hasDirty || isClosed}
      loading={saving}
      onClick={save}
      className="w-auto whitespace-nowrap px-8"
    />
  );
}
