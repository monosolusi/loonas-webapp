"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRecentPosInvoicesError() {
  return (
    <SectionCard title="Transaksi POS Terbaru" bodyClassName="p-0">
      <div className="py-8 text-center text-sm text-neutral-300">Gagal memuat transaksi POS.</div>
    </SectionCard>
  );
}
