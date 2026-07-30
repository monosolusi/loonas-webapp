"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type PriceTierLoadErrorProps = {
  error: ServerError;
  onRetry: () => void;
};

export function PriceTierLoadError({ error, onRetry }: PriceTierLoadErrorProps) {
  const isNotFound = error.code === ErrorCodes.NOT_FOUND.code || error.httpCode === 404;

  return (
    <div className="flex flex-col items-center gap-y-3 py-4 text-center">
      <ExclamationCircleIcon className="text-error-300 size-5" />
      <span className="text-sm font-semibold text-neutral-500">
        {isNotFound ? "Varian sudah tidak ada" : "Gagal memuat harga grosir"}
      </span>
      <span className="text-sm text-neutral-300">
        {isNotFound
          ? "Varian ini sudah dihapus. Muat ulang halaman."
          : "Skema harga grosir tidak dapat dimuat saat ini."}
      </span>
      {/* A NOT_FOUND will never succeed on retry, so the affordance is omitted. */}
      {!isNotFound && <SecondaryButton outlined onClick={onRetry} className="h-11" label="Coba Lagi" />}
    </div>
  );
}
