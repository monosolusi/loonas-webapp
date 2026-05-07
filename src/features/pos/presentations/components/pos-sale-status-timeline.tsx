"use client";

import clsx from "clsx";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import {
  derivePosSaleStatusKind,
  formatPosSaleTimeOnly,
} from "@/features/pos/presentations/components/pos-sale-status-helpers";

type PosSaleStatusTimelineProps = {
  sale: PosSaleEntity;
};

type TimelineEvent = {
  title: string;
  description: string;
  timestamp: string | null;
  active: boolean;
};

export function PosSaleStatusTimeline({ sale }: PosSaleStatusTimelineProps) {
  const events = buildEvents(sale);

  return (
    <div className="flex flex-col gap-y-1 rounded-lg border border-neutral-200 bg-white p-5">
      <div className="text-sm font-semibold text-neutral-500">Riwayat status</div>
      <div className="flex flex-col pt-3">
        {events.map((event, idx) => (
          <TimelineRow key={event.title} event={event} isLast={idx === events.length - 1} />
        ))}
      </div>
    </div>
  );
}

function TimelineRow({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  return (
    <div className="flex flex-row gap-x-3">
      <div className="flex flex-col items-center">
        <div
          className={clsx(
            "size-2.5 shrink-0 rounded-full border-2",
            event.active ? "border-success-500 bg-success-500" : "border-neutral-200 bg-white",
          )}
          aria-hidden
        />
        {!isLast && <div className="w-px flex-1 bg-neutral-100" />}
      </div>
      <div className={clsx("flex flex-1 flex-col pb-4", isLast && "pb-0")}>
        <div className="flex flex-row items-baseline justify-between gap-x-3">
          <span className={clsx("text-sm font-medium", event.active ? "text-neutral-500" : "text-neutral-300")}>
            {event.title}
          </span>
          <span className="shrink-0 text-xs tabular-nums text-neutral-300">{event.timestamp ?? "—"}</span>
        </div>
        <span className="text-xs text-neutral-300">{event.description}</span>
      </div>
    </div>
  );
}

function buildEvents(sale: PosSaleEntity): TimelineEvent[] {
  const kind = derivePosSaleStatusKind(sale);
  const isQris = sale.payInDetail?.method === "QRIS";
  const expiresAt = sale.payInDetail?.expiresAt;
  const events: TimelineEvent[] = [];

  // Active = top of the stack (most recent state).
  if (isQris) {
    if (kind === "paid") {
      events.push({
        title: "Pembayaran diterima",
        description: "QRIS terbayar oleh pelanggan",
        timestamp: formatPosSaleTimeOnly(sale.updatedAt || sale.invoiceDate),
        active: true,
      });
      events.push({
        title: "Menunggu pembayaran",
        description: expiresAt
          ? `QR diterbitkan · kedaluwarsa ${formatPosSaleTimeOnly(expiresAt)}`
          : "QR diterbitkan",
        timestamp: formatPosSaleTimeOnly(sale.createdAt || sale.invoiceDate),
        active: false,
      });
    } else {
      events.push({
        title: "Pembayaran diterima",
        description: "Belum",
        timestamp: null,
        active: false,
      });
      events.push({
        title: "Menunggu pembayaran",
        description: expiresAt
          ? `QR diterbitkan · kedaluwarsa ${formatPosSaleTimeOnly(expiresAt)}`
          : "QR diterbitkan",
        timestamp: formatPosSaleTimeOnly(sale.createdAt || sale.invoiceDate),
        active: true,
      });
    }
  } else {
    events.push({
      title: "Lunas",
      description: "Tunai diterima",
      timestamp: formatPosSaleTimeOnly(sale.invoiceDate),
      active: true,
    });
  }

  events.push({
    title: "Transaksi dibuat",
    description: "Tercatat di sistem POS",
    timestamp: formatPosSaleTimeOnly(sale.createdAt || sale.invoiceDate),
    active: false,
  });

  return events;
}
