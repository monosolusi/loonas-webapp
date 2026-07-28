"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type ProductDetailProductionErrorProps = {
  error: ServerError;
};

export function ProductDetailProductionError({ error }: ProductDetailProductionErrorProps) {
  const isNotFound = error.code === ErrorCodes.NOT_FOUND.code;

  return (
    <SectionCard title="Riwayat Produksi" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col items-center gap-y-2 py-6 text-center">
        <ExclamationTriangleIcon className="size-8 text-warning-300" />
        <span className="text-sm font-semibold text-neutral-500">
          {isNotFound ? "Produk tidak ditemukan" : "Gagal memuat riwayat produksi"}
        </span>
        <span className="text-sm text-neutral-300">
          {isNotFound ? "Data produksi tidak dapat dimuat." : (error.message ?? "Terjadi kesalahan yang tidak diketahui.")}
        </span>
      </div>
    </SectionCard>
  );
}
