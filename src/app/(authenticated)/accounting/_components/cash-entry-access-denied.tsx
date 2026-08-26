"use client";

import Link from "next/link";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

export function CashEntryAccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 py-24">
      <div className="flex flex-col items-center gap-y-1 text-center">
        <p className="text-base font-semibold text-neutral-400">Fitur Kas Masuk & Kas Keluar tidak tersedia.</p>
        <p className="max-w-sm text-sm text-neutral-300">
          Upgrade paket Anda untuk mengakses pencatatan kas masuk dan kas keluar serta fitur akuntansi lengkap.
        </p>
      </div>
      <Link href="/settings" className="w-auto">
        <PrimaryButton label="Pelajari Paket" className="w-auto px-6" />
      </Link>
    </div>
  );
}