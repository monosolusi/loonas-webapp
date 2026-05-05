"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

export function ReceiptActions() {
  const router = useRouter();

  return (
    <div className="flex w-full max-w-md flex-row gap-x-3">
      <PrimaryButton label="Transaksi Baru" onClick={() => router.push("/pos")} />
    </div>
  );
}
