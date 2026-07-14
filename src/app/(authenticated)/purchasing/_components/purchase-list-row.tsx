"use client";

import { useMemo } from "react";
import Link from "next/link";
import { DateTime } from "luxon";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";
import { usePurchaseList } from "@/app/(authenticated)/purchasing/_providers/purchase-list-provider";
import { useRouter } from "next/navigation";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";

type PurchaseListRowProps = {
  purchase: PurchaseEntity;
};

export function PurchaseListRow({ purchase }: PurchaseListRowProps) {
  const { setDeletingItem } = usePurchaseList();
  const router = useRouter();

  const menuOptions = useMemo<ActionMenuOption[]>(
    () => [
      { label: "Lihat Detail", onClick: () => router.push(`/purchasing/${purchase.id}`) },
      { label: "Hapus", onClick: () => setDeletingItem(purchase), variant: "danger" },
    ],
    [purchase, setDeletingItem, router],
  );

  const date = DateTime.fromISO(purchase.date).toFormat("dd MMM yyyy");
  const itemsLabel = `${purchase.items.length} item`;

  return (
    <>
      {/* Desktop: grid row (lg and up) */}
      <Link
        href={`/purchasing/${purchase.id}`}
        className="hover:border-l-primary-300 hover:bg-primary-50 hidden grid-cols-[1fr_1.5fr_0.6fr_1fr_48px] items-center gap-x-4 border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0 lg:grid"
      >
        <span className="text-sm leading-5 text-neutral-400">{date}</span>
        <span className="truncate text-sm leading-5 text-neutral-400">{purchase.note ?? "—"}</span>
        <span className="text-sm leading-5 text-neutral-400">{itemsLabel}</span>
        <span className="text-right text-sm leading-5 font-semibold text-neutral-500">
          <CurrencyDisplay value={purchase.totalAmount} />
        </span>
        <div className="flex justify-end">
          <ActionMenu options={menuOptions} />
        </div>
      </Link>

      {/* Mobile: stacked card (below lg) */}
      <div className="lg:hidden">
        <MobileListCard
          href={`/purchasing/${purchase.id}`}
          title={purchase.note ?? "Pembelian"}
          subtitle={itemsLabel}
          meta={date}
          trailingTop={<CurrencyDisplay value={purchase.totalAmount} />}
          trailingBottom={<ActionMenu options={menuOptions} />}
        />
      </div>
    </>
  );
}
