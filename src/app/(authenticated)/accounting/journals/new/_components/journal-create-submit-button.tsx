"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useJournalCreate } from "@/app/(authenticated)/accounting/journals/new/_providers/journal-create-provider";

export function JournalCreateSubmitButton() {
  const { isSubmitting, enabled, handleSubmit } = useJournalCreate();

  return (
    <PrimaryButton
      label={isSubmitting ? "Menyimpan…" : "Simpan Jurnal"}
      loadingLabel="Menyimpan…"
      loading={isSubmitting}
      disabled={!enabled}
      onClick={handleSubmit}
    />
  );
}
