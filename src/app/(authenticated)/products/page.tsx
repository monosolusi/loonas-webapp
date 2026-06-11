import { ProductListProvider } from "@/app/(authenticated)/products/_providers/product-list-provider";
import { ProductListHeader } from "@/app/(authenticated)/products/_components/product-list-header";
import { ProductListToolbar } from "@/app/(authenticated)/products/_components/product-list-toolbar";
import { ProductListTable } from "@/app/(authenticated)/products/_components/product-list-table";
import { ProductListBlockedDialog } from "@/app/(authenticated)/products/_components/product-list-blocked-dialog";

export default function ProductsPage() {
  return (
    <ProductListProvider>
      <div className="flex flex-col gap-y-6">
        <ProductListHeader />
        <ProductListToolbar />
        <ProductListTable />
      </div>
      <ProductListBlockedDialog />
    </ProductListProvider>
  );
}
