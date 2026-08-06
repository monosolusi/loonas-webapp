"use client";

export function CostValuationGapsAccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 py-24">
      <div className="flex flex-col items-center gap-y-1 text-center">
        <p className="text-base font-semibold text-neutral-400">Fitur HPP Belum Tercatat tidak tersedia.</p>
        <p className="max-w-sm text-sm text-neutral-300">
          Upgrade paket Anda untuk mengakses laporan kesenjangan biaya dan fitur akuntansi lengkap.
        </p>
      </div>
      <a
        href="/settings"
        className="rounded-lg bg-primary-300 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-300/90"
      >
        Pelajari Paket
      </a>
    </div>
  );
}