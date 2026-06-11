"use client";

import { useFixedCostEntries } from "@/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider";

export function FixedCostHeader() {
  const { masterCount, hasNoMaster } = useFixedCostEntries();

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Biaya Tetap Bulanan</h1>
        <p className="leading-6 text-neutral-300">{masterCount} jenis biaya</p>
      </div>

      {hasNoMaster && (
        <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-400">
          <span className="font-semibold">Belum ada jenis biaya tetap.</span> Buat jenis biaya terlebih dahulu di{" "}
          <a href="/settings/fixed-costs" className="font-semibold underline hover:text-warning-500">
            Pengaturan &rarr; Biaya Tetap
          </a>{" "}
          sebelum menambahkan data biaya bulanan.
        </div>
      )}
    </>
  );
}
