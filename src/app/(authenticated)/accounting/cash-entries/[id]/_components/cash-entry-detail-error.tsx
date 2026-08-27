"use client";

import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type CashEntryDetailErrorProps = {
  error: ServerError;
  onRetry?: () => void;
};

export function CashEntryDetailError({ error, onRetry }: CashEntryDetailErrorProps) {
  // A NOT_FOUND never succeeds on retry — hide "Coba lagi" and show terminal copy instead.
  const isNotFound = error.code === ErrorCodes.NOT_FOUND.code;

  return (
    <div className="flex flex-col items-center gap-y-4 p-12 text-center">
      <ExclamationCircleIcon className="size-10 text-neutral-200" />
      <p className="text-sm text-neutral-400">
        {isNotFound ? "Entri kas tidak ditemukan." : "Entri kas gagal dimuat."}
      </p>
      <div className="flex flex-row items-center gap-x-3">
        {!isNotFound && onRetry && (
          <SecondaryButton outlined type="button" label="Coba lagi" onClick={onRetry} className="w-auto px-4" />
        )}
        <Link href="/accounting/cash-entries" className="text-sm font-medium text-primary-400 underline">
          Kembali ke Kas
        </Link>
      </div>
    </div>
  );
}
