"use client";

import { useRouter } from "next/navigation";
import { SectionCard } from "@/core/presentations/components/section-card";
import { useListProducts } from "@/features/product/presentations/hooks/use-list-products";
import { DashboardTotalProductsCardLoading } from "@/app/(authenticated)/home/_components/dashboard-total-products-card-loading";
import { DashboardTotalProductsCardError } from "@/app/(authenticated)/home/_components/dashboard-total-products-card-error";
import { DashboardTotalProductsCardEmpty } from "@/app/(authenticated)/home/_components/dashboard-total-products-card-empty";

export function DashboardTotalProductsCard() {
  const router = useRouter();
  const { meta, loading, error } = useListProducts({ limit: 1 });

  if (loading) {
    return <DashboardTotalProductsCardLoading />;
  }

  if (error) {
    return <DashboardTotalProductsCardError />;
  }

  if ((meta?.total ?? 0) === 0) {
    return <DashboardTotalProductsCardEmpty />;
  }

  return (
    <button type="button" onClick={() => router.push("/products")} className="w-full cursor-pointer text-left">
      <SectionCard title="Total Produk">
        <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">{meta?.total ?? 0}</span>
      </SectionCard>
    </button>
  );
}
