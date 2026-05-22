"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

type DashboardRangePosSalesTileErrorProps = {
  onRetry: () => void;
};

export function DashboardRangePosSalesTileError({ onRetry }: DashboardRangePosSalesTileErrorProps) {
  return (
    <SectionCard title="Penjualan POS">
      <div className="flex items-center gap-x-3">
        <span className="rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-medium text-error-400">Gagal memuat</span>
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-medium text-primary-300 hover:underline"
        >
          Coba lagi
        </button>
      </div>
    </SectionCard>
  );
}
