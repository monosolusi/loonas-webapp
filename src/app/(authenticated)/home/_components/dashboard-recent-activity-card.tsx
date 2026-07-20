"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import {
  DESTINATION_TEMPLATE,
  toActivityView,
} from "@/app/(authenticated)/home/_components/dashboard-recent-activity-row";
import { DashboardRecentActivityStatusText } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-status-text";
import { track } from "@/core/analytics";
import type { ActivityTab } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-tabs";

interface DashboardRecentActivityCardProps {
  invoice: IncomingInvoiceEntity | OutgoingInvoiceEntity;
  tab: ActivityTab;
  position: number;
}

export function DashboardRecentActivityCard({ invoice, tab, position }: DashboardRecentActivityCardProps) {
  const router = useRouter();
  const view = toActivityView(invoice);

  const handleActivate = useCallback(() => {
    track("recent_activity_row_clicked", {
      tab,
      row_position: position,
      destination: DESTINATION_TEMPLATE[view.kind],
    });
    router.push(view.href);
  }, [tab, position, view.kind, view.href, router]);

  return (
    <MobileListCard
      onClick={handleActivate}
      title={view.partyName}
      subtitle={view.paymentMethod}
      meta={view.createdAt.setLocale("id").toRelative()}
      trailingTop={IDRFormatter.toCurrency(view.total)}
      trailingBottom={<DashboardRecentActivityStatusText status={view.status} />}
    />
  );
}
