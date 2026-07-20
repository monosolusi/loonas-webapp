"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

type ReceiptErrorProps = {
  error: ServerError;
};

export function ReceiptError({ error }: ReceiptErrorProps) {
  const router = useRouter();
  const isNotFound = error.code === ErrorCodes.NOT_FOUND.code;

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-y-4 rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <ExclamationTriangleIcon className="size-10 text-warning-300" />
        <span className="text-base font-semibold text-neutral-500">
          {isNotFound ? "Receipt tidak ditemukan" : "Gagal memuat receipt"}
        </span>
        <span className="text-sm text-neutral-300">
          {isNotFound
            ? "Transaksi mungkin sudah dihapus atau ID tidak valid."
            : (error.message ?? "Terjadi kesalahan yang tidak diketahui.")}
        </span>
        <PrimaryButton label="Kembali ke POS" onClick={() => router.push("/pos")} />
      </div>
    </div>
  );
}
