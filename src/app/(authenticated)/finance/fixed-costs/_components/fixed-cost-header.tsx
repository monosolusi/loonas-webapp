"use client";

import { useFixedCostEntries } from "@/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider";

export function FixedCostWarningBanner() {
  const { hasNoMaster } = useFixedCostEntries();

  if (!hasNoMaster) return null;

  return (
    <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-400">
      <span className="font-semibold">Belum ada jenis biaya tetap.</span> Buat jenis biaya terlebih dahulu di{" "}
      <a href="/settings/fixed-costs" className="font-semibold underline hover:text-warning-500">
        Pengaturan &rarr; Biaya Tetap
      </a>{" "}
      sebelum menambahkan data biaya bulanan.
    </div>
  );
}
