"use client";

import { Fragment } from "react";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { PeriodRow } from "@/app/(authenticated)/finance/periods/_components/period-row";
import { PeriodAdvisory } from "@/app/(authenticated)/finance/periods/_components/period-advisory";
import { AllocateFixedCostDialog } from "@/app/(authenticated)/finance/periods/_components/allocate-fixed-cost-dialog";
import { usePeriods, MANAGERIAL_COSTING_FEATURE } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

const TABLE_COLUMNS = [
  { label: "Periode" },
  { label: "Status" },
  { label: "Aksi", align: "right" as const },
];

export function PeriodsTable() {
  const { periods, meta, page, setPage, pendingAdvisories, dismissAdvisory } = usePeriods();
  const { account } = useGetCurrentAccount();
  const hasManagerialCosting = account?.hasFeature(MANAGERIAL_COSTING_FEATURE) ?? false;

  return (
    <div className="flex flex-col gap-y-4">
      {hasManagerialCosting ? <AllocateFixedCostDialog /> : null}

      <TableContainer>
        <TableHeader
          columns={TABLE_COLUMNS}
          className="grid-cols-[2fr_1fr_64px]"
          hideOnMobile
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
