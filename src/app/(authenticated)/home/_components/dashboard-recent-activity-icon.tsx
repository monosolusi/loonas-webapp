"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { DashboardRecentInvoicesArrowIcon } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-arrow-icon";

type ActivityKind = "pos" | "incoming" | "outgoing";

export interface ActivityIconProps {
  kind: ActivityKind;
}

export function ActivityIcon({ kind }: ActivityIconProps) {
  if (kind === "pos") {
    return (
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-50">
        <ShoppingCartIcon className="size-3.5 text-primary-400" />
      </div>
    );
  }
  if (kind === "incoming") {
    return (
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-success-50">
        <DashboardRecentInvoicesArrowIcon direction="in" className="text-success-400" />
      </div>
    );
  }
  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-warning-50">
      <DashboardRecentInvoicesArrowIcon direction="out" className="text-warning-400" />
    </div>
  );
}
