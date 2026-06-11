import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PurchaseCreateProvider } from "@/app/(authenticated)/purchasing/create/_providers/purchase-create-provider";
import { PurchaseCreateFormCard } from "@/app/(authenticated)/purchasing/create/_components/purchase-create-form-card";
import { PurchaseCreateSaveButton } from "@/app/(authenticated)/purchasing/create/_components/purchase-create-save-button";

export default function CreatePurchasePage() {
  return (
    <PurchaseCreateProvider>
      <div className="flex flex-col gap-y-6">
        <DetailPageHeader backHref="/purchasing" title="Catat Pembelian" action={<PurchaseCreateSaveButton />} />
        <PurchaseCreateFormCard />
      </div>
    </PurchaseCreateProvider>
  );
}
