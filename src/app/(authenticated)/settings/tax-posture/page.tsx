"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { TaxPostureProvider } from "@/app/(authenticated)/settings/tax-posture/_providers/tax-posture-provider";
import { TaxPostureLoading } from "@/app/(authenticated)/settings/tax-posture/_components/tax-posture-loading";
import { TaxPostureAccessDenied } from "@/app/(authenticated)/settings/tax-posture/_components/tax-posture-access-denied";
import { TaxPostureFormCard } from "@/app/(authenticated)/settings/tax-posture/_components/tax-posture-form-card";
import { TaxPostureHistoryCard } from "@/app/(authenticated)/settings/tax-posture/_components/tax-posture-history-card";

export default function TaxPosturePage() {
  return (
    <TaxPostureProvider loading={<TaxPostureLoading />} accessDenied={<TaxPostureAccessDenied />}>
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-3">
          <Link
            href="/settings"
            className="flex size-8 items-center justify-center rounded-lg border border-neutral-100 text-neutral-400 transition-colors hover:bg-neutral-50"
            aria-label="Kembali ke Pengaturan"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <h1 className="text-base font-semibold text-neutral-500">Postur Pajak</h1>
        </div>
        <TaxPostureFormCard />
        <TaxPostureHistoryCard />
      </div>
    </TaxPostureProvider>
  );
}
