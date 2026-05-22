"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

export function DashboardTotalProductsCardEmpty() {
  const router = useRouter();

  return (
    <div
      className={clsx(
        "flex flex-col gap-y-3 rounded-xl border border-t border-r border-b-4 border-l border-neutral-100 bg-neutral-50 p-5",
      )}
    >
      <div className="flex items-center gap-2 text-neutral-300">
        <Squares2X2Icon className="size-5 shrink-0" />
        <span className="text-sm leading-5">Total Produk</span>
      </div>
      <p className="text-sm text-neutral-300">Belum ada produk.</p>
      <div className="w-fit">
        <PrimaryButton label="Tambah produk" onClick={() => router.push("/products/create")} />
      </div>
    </div>
  );
}
