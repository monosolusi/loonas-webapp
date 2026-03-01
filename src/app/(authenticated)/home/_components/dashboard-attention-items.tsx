"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

interface AttentionItem {
  count: number;
  label: string;
  description?: string;
  severity: "critical" | "warning" | "info";
  redirectTo: string;
}

const severityConfig = {
  critical: {
    badge: "bg-error-100 text-error-400",
    hoverBg: "hover:bg-error-50",
  },
  warning: {
    badge: "bg-warning-100 text-warning-400",
    hoverBg: "hover:bg-warning-50",
  },
  info: {
    badge: "bg-primary-50 text-primary-300",
    hoverBg: "hover:bg-primary-50",
  },
};

const items: AttentionItem[] = [
  {
    count: 3,
    label: "Faktur Masukan Belum Dibayar",
    description: "3 faktur jatuh tempo minggu ini",
    severity: "critical",
    redirectTo: "/invoices/incoming",
  },
  {
    count: 5,
    label: "Stock Menipis",
    description: "5 item stok di bawah minimum",
    severity: "warning",
    redirectTo: "/inventory",
  },
  {
    count: 2,
    label: "Faktur Keluaran Belum Dibayar",
    description: "Total Rp4,5jt tertunggak",
    severity: "info",
    redirectTo: "/invoices/outgoing",
  },
];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <svg className="size-10 text-success-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="mt-3 font-semibold text-neutral-500">Semua Terkendali!</p>
      <p className="mt-1 text-sm text-neutral-300">Tidak ada hal yang perlu perhatian Anda saat ini.</p>
    </div>
  );
}

export function DashboardAttentionItems() {
  const router = useRouter();

  return (
    <SectionCard title="Perlu Perhatian" iconSrc="/assets/images/bell-icon-primary-300-w16-h16.svg">
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col divide-y divide-neutral-100">
          {items.map((item) => {
            const config = severityConfig[item.severity];

            return (
              <div
                key={item.label}
                onClick={() => router.push(item.redirectTo)}
                className={`group flex cursor-pointer items-center gap-x-3 py-3 transition-colors duration-150 first:pt-0 last:pb-0 ${config.hoverBg}`}
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${config.badge}`}
                >
                  {item.count}
                </span>
                <div className="flex-1">
                  <span className="text-sm text-neutral-500">{item.label}</span>
                  {item.description && <p className="mt-0.5 text-xs text-neutral-300">{item.description}</p>}
                </div>
                <ChevronRightIcon className="size-5 text-neutral-200 transition-transform duration-150 group-hover:translate-x-0.5" />
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
