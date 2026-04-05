import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PurchaseCreateProvider } from "@/app/(authenticated)/purchasing/create/_providers/purchase-create-provider";
import { PurchaseCreateFormCard } from "@/app/(authenticated)/purchasing/create/_components/purchase-create-form-card";
import { PurchaseCreateSaveButton } from "@/app/(authenticated)/purchasing/create/_components/purchase-create-save-button";

export default function CreatePurchasePage() {
  return (
    <PurchaseCreateProvider>
      <div className="flex flex-col gap-y-6">
        <DetailPageHeader backHref="/purchasing" title="Catat Pembelian" />
        <div className="flex flex-row gap-x-6">
          <div className="flex min-w-0 flex-1 flex-col gap-y-6">
            <PurchaseCreateFormCard />
          </div>
          <div className="w-[280px] shrink-0">
            <div className="sticky top-8">
              <PurchaseCreateSaveButton />
            </div>
          </div>
        </div>
      </div>
    </PurchaseCreateProvider>
  );
}
