import { LogoImage } from "@/core/presentations/components/logo-image";
import { InvoiceMetadataImpl } from "./_components/invoice-metadata-impl";
import { InvoicePreviewImpl } from "./_components/invoice-preview-impl";
import { PayButton } from "./_components/pay-button";

export default function InvoicePayPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-1 flex-row justify-between space-x-4">
          <LogoImage />
          <div className="self-end">
            <PayButton />
          </div>
        </div>
        <div className="flex-1">
          <InvoiceMetadataImpl />
        </div>
        <div className="flex-1">
          <InvoicePreviewImpl />
        </div>
      </div>
    </div>
  );
}
