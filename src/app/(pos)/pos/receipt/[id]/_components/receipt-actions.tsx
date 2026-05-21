"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

export function ReceiptActions() {
  const router = useRouter();

  return (
    <div className="flex w-full max-w-md flex-col gap-y-3">
      <PrimaryButton label="Selesai" onClick={() => router.push("/pos")} />
      <SecondaryButton outlined label="Cetak Ulang" onClick={() => { if (typeof window !== "undefined") window.print(); }} />
    </div>
  );
}
