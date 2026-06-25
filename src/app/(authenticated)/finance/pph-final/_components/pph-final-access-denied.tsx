"use client";

import Link from "next/link";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { SectionCard } from "@/core/presentations/components/section-card";

type PphFinalAccessDeniedProps = {
  variant: "no-feature" | "not-configured";
};

export function PphFinalAccessDenied({ variant }: PphFinalAccessDeniedProps) {
  return (
    <div role="alert">
      <SectionCard title="">
        <div className="flex flex-col items-center gap-y-3 py-12 text-center">
          <LockClosedIcon className="size-10 text-neutral-200" aria-hidden="true" />
          {variant === "no-feature" ? (
            <>
              <h2 className="text-base font-semibold text-neutral-500">Akses Tidak Diizinkan</h2>
              <p className="max-w-xs text-sm text-neutral-300">
                Kamu tidak memiliki izin untuk mengakses halaman ini. Hubungi pemilik akun untuk mendapatkan akses.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold text-neutral-500">PPh Final UMKM belum diaktifkan</h2>
              <p className="max-w-xs text-sm text-neutral-300">
                Aktifkan PPh Final UMKM di Pengaturan Pajak terlebih dahulu untuk mencatat pembayaran ini.
              </p>
              <Link
                href="/settings/tax-posture"
                className="mt-1 text-sm font-medium text-primary-300 hover:underline"
              >
                Buka Pengaturan Pajak
              </Link>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
