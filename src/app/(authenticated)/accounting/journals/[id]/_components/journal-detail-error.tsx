"use client";

import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type JournalDetailErrorProps = {
  onRetry?: () => void;
};

export function JournalDetailError({ onRetry }: JournalDetailErrorProps) {
  return (
    <div className="flex flex-col items-center gap-y-4 p-12 text-center">
      <ExclamationCircleIcon className="size-10 text-neutral-200" />
      <p className="text-sm text-neutral-400">Jurnal tidak ditemukan atau gagal dimuat.</p>
      <div className="flex flex-row items-center gap-x-3">
        {onRetry && (
          <SecondaryButton outlined type="button" label="Coba lagi" onClick={onRetry} className="w-auto px-4" />
        )}
        <Link href="/accounting/journals" className="text-sm font-medium text-primary-300 hover:underline">
          Kembali ke Jurnal Umum
        </Link>
      </div>
    </div>
  );
}
