"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { SectionCard } from "@/core/presentations/components/section-card";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type ProductDetailProductionErrorProps = {
  error: ServerError;
  onRetry: () => void;
};

export function ProductDetailProductionError({ error, onRetry }: ProductDetailProductionErrorProps) {
  const isNotFound = error.code === ErrorCodes.NOT_FOUND.code;

  return (
    <SectionCard title="Riwayat Produksi" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col items-center gap-y-3 py-4 text-center">
        <ExclamationCircleIcon className="size-5 text-error-300" />
        <span className="text-sm font-semibold text-neutral-500">
          {isNotFound ? "Produk tidak ditemukan" : "Gagal memuat riwayat produksi"}
        </span>
        <span className="text-sm text-neutral-300">
          {isNotFound ? "Data produksi tidak dapat dimuat." : (error.message ?? "Terjadi kesalahan yang tidak diketahui.")}
        </span>
        {!isNotFound && <SecondaryButton outlined onClick={onRetry} className="h-11" label="Coba Lagi" />}
      </div>
    </SectionCard>
  );
}
