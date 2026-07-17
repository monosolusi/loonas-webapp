"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

export function WizardFetchError() {
  function handleReload() {
    window.location.reload();
  }

  return (
    <SectionCard title="">
      <div className="rounded-lg border border-error-100 bg-error-50 p-4">
        <div className="flex gap-3">
          <ExclamationCircleIcon className="mt-0.5 size-5 shrink-0 text-error-400" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-500">
              Gagal memuat status — coba muat ulang halaman.
            </p>
            <SecondaryButton
              outlined
              label="Muat Ulang"
              onClick={handleReload}
              className="w-auto self-start px-4"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
