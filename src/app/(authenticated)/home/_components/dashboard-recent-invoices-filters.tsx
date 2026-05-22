"use client";

import clsx from "clsx";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { DashboardRecentInvoicesArrowIcon } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-arrow-icon";

const filters: { label: string; value: InvoiceType | undefined; icon?: "in" | "out" }[] = [
  { label: "Semua", value: undefined },
  { label: "Masukan", value: InvoiceType.INCOMING, icon: "in" },
  { label: "Keluaran", value: InvoiceType.OUTGOING, icon: "out" },
];

interface DashboardRecentInvoicesFiltersProps {
  activeFilter: InvoiceType | undefined;
  onFilterChange: (value: InvoiceType | undefined) => void;
}

export function DashboardRecentInvoicesFilters({ activeFilter, onFilterChange }: DashboardRecentInvoicesFiltersProps) {
  return (
    <div className="flex items-center gap-1">
      {filters.map((f) => (
        <button
          key={f.label}
          type="button"
          onClick={() => onFilterChange(f.value)}
          className={clsx(
            "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            activeFilter === f.value
              ? "bg-neutral-800 text-white"
              : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200",
          )}
        >
          {f.icon && <DashboardRecentInvoicesArrowIcon direction={f.icon} />}
          {f.label}
        </button>
      ))}
    </div>
  );
}
