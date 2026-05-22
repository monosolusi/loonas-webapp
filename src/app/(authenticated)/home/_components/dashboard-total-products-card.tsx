"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
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
    <div
      onClick={() => router.push("/products")}
      className={clsx(
        "flex cursor-pointer flex-col gap-y-3 rounded-xl border border-t border-r border-b-4 border-l border-neutral-100 bg-neutral-50 p-5",
        "hover:border-neutral-200 hover:bg-white",
        "transition-colors duration-150",
      )}
    >
      <div className="flex items-center gap-2 text-neutral-300">
        <Squares2X2Icon className="size-5 shrink-0" />
        <span className="text-sm leading-5">Total Produk</span>
      </div>
      <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">{meta?.total ?? 0}</span>
    </div>
  );
}
