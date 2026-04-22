import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { ProductionCreateProvider } from "@/app/(authenticated)/productions/create/_providers/production-create-provider";
import { ProductionCreateFormCard } from "@/app/(authenticated)/productions/create/_components/production-create-form-card";
import { ProductionPreviewCard } from "@/app/(authenticated)/productions/create/_components/production-preview-card";
import { ProductionCreateSaveButton } from "@/app/(authenticated)/productions/create/_components/production-create-save-button";

export default function CreateProductionPage() {
  return (
    <ProductionCreateProvider>
      <div className="flex flex-col gap-y-6">
        <DetailPageHeader backHref="/productions" title="Catat Produksi" action={<ProductionCreateSaveButton />} />
        <ProductionCreateFormCard />
        <ProductionPreviewCard />
      </div>
    </ProductionCreateProvider>
  );
}
