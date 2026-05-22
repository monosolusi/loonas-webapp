"use client";

import { useRouter } from "next/navigation";
import { SectionCard } from "@/core/presentations/components/section-card";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

export function DashboardRecentPosInvoicesEmpty() {
  const router = useRouter();

  return (
    <SectionCard title="Transaksi POS Terbaru" bodyClassName="p-0">
      <div className="flex flex-col items-center gap-4 py-8">
        <p className="text-sm text-neutral-300">Belum ada transaksi POS di periode ini.</p>
        <div className="w-fit">
          <SecondaryButton outlined label="Buka POS" onClick={() => router.push("/sales/pos")} />
        </div>
      </div>
    </SectionCard>
  );
}
