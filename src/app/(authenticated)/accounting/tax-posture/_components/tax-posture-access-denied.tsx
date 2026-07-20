"use client";

import { LockClosedIcon } from "@heroicons/react/20/solid";
import { SectionCard } from "@/core/presentations/components/section-card";

export function TaxPostureAccessDenied() {
  return (
    <div role="alert">
      <SectionCard title="">
        <div className="flex flex-col items-center gap-y-3 py-12 text-center">
          <LockClosedIcon className="size-10 text-neutral-200" aria-hidden="true" />
          <h2 className="text-base font-semibold text-neutral-500">Akses Tidak Diizinkan</h2>
          <p className="max-w-xs text-sm text-neutral-300">
            Kamu tidak memiliki izin untuk mengakses halaman ini. Hubungi pemilik akun untuk mendapatkan akses.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
