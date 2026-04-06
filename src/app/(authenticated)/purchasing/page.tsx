import { PurchaseListProvider } from "@/app/(authenticated)/purchasing/_providers/purchase-list-provider";
import { PurchaseListHeader } from "@/app/(authenticated)/purchasing/_components/purchase-list-header";
import { PurchaseListToolbar } from "@/app/(authenticated)/purchasing/_components/purchase-list-toolbar";
import { PurchaseListTable } from "@/app/(authenticated)/purchasing/_components/purchase-list-table";
import { PurchaseDeleteDialog } from "@/app/(authenticated)/purchasing/_components/purchase-delete-dialog";

export default function PurchasingPage() {
  return (
    <PurchaseListProvider>
      <div className="flex flex-col gap-y-6">
        <PurchaseListHeader />
        <PurchaseListToolbar />
        <PurchaseListTable />
      </div>
      <PurchaseDeleteDialog />
    </PurchaseListProvider>
  );
}
