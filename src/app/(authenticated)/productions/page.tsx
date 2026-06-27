import { Suspense } from "react";
import { ProductionRangeProvider } from "@/app/(authenticated)/productions/_providers/production-range-provider";
import { ProductionListProvider } from "@/app/(authenticated)/productions/_providers/production-list-provider";
import { ProductionListHeader } from "@/app/(authenticated)/productions/_components/production-list-header";
import { ProductionListToolbar } from "@/app/(authenticated)/productions/_components/production-list-toolbar";
import { ProductionListTable } from "@/app/(authenticated)/productions/_components/production-list-table";
import { ProductionDeleteDialog } from "@/app/(authenticated)/productions/_components/production-delete-dialog";

export default function ProductionsPage() {
  return (
    <Suspense>
      <ProductionRangeProvider>
        <ProductionListProvider>
          <div className="flex flex-col gap-y-6">
            <ProductionListHeader />
            <ProductionListToolbar />
            <ProductionListTable />
          </div>
          <ProductionDeleteDialog />
        </ProductionListProvider>
      </ProductionRangeProvider>
    </Suspense>
  );
}
