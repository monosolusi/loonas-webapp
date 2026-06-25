"use client";

import { Fragment } from "react";
import clsx from "clsx";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { PeriodRow } from "@/app/(authenticated)/finance/periods/_components/period-row";
import { PeriodAdvisory } from "@/app/(authenticated)/finance/periods/_components/period-advisory";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";

const TABLE_COLUMNS = [
  { label: "Periode" },
  { label: "Status" },
  { label: "Aksi", align: "right" as const },
];

type StatusFilterOption = {
  label: string;
  value: "open" | "closed" | undefined;
};

const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { label: "Semua", value: undefined },
  { label: "Terbuka", value: "open" },
  { label: "Terkunci", value: "closed" },
];

export function PeriodsTable() {
  const { periods, meta, page, setPage, statusFilter, setStatusFilter, pendingAdvisories, dismissAdvisory } = usePeriods();

  return (
    <div className="flex flex-col gap-y-4">
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

      <TableContainer>
        <TableHeader
          columns={TABLE_COLUMNS}
          className="grid-cols-[2fr_1fr_64px]"
        />
        {periods.map((period) => (
          <Fragment key={period.id}>
            <PeriodRow period={period} />
            {pendingAdvisories[period.id]?.length ? (
              <PeriodAdvisory
                periodLabel={period.label}
                warnings={pendingAdvisories[period.id]}
                onDismiss={() => dismissAdvisory(period.id)}
              />
            ) : null}
          </Fragment>
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination
            displayedCount={periods.length}
            meta={meta}
            currentPage={page}
            onPageChange={setPage}
            countLabel="periode"
          />
        )}
      </TableContainer>
    </div>
  );
}
