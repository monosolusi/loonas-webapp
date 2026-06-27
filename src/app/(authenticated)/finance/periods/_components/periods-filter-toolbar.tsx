"use client";

import clsx from "clsx";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";

type StatusFilterOption = {
  label: string;
  value: "open" | "closed" | undefined;
};

const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { label: "Semua", value: undefined },
  { label: "Terbuka", value: "open" },
  { label: "Terkunci", value: "closed" },
];

export function PeriodsFilterToolbar() {
  const { statusFilter, setStatusFilter } = usePeriods();

  return (
    <TableToolbar>
      <div className="flex flex-row gap-x-2">
        {STATUS_FILTER_OPTIONS.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => setStatusFilter(opt.value)}
            className={clsx(
              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
              statusFilter === opt.value
                ? "border-primary-300 bg-primary-50 text-primary-300"
                : "border-neutral-100 text-neutral-400 hover:border-neutral-200",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </TableToolbar>
  );
}
