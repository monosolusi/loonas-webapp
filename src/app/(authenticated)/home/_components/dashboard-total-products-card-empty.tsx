"use client";

import { useRouter } from "next/navigation";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

export function DashboardTotalProductsCardEmpty() {
  const router = useRouter();

  return (
    <SectionCard title="Total Produk">
      <div className="flex flex-col gap-y-3">
        <p className="text-sm text-neutral-300">Belum ada produk.</p>
        <div className="w-fit">
          <PrimaryButton label="Tambah produk" onClick={() => router.push("/products/create")} />
        </div>
      </div>
    </SectionCard>
  );
}
