import { InvoicePreview } from "@/app/(authenticated)/invoices/_components/invoice-preview";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { LogoImage } from "@/core/presentations/components/logo-image";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DateTime } from "luxon";
import { InvoiceMetadataImpl } from "./_components/invoice-metadata-impl";
import { InvoicePreviewImpl } from "./_components/invoice-preview-impl";

export default function InvoicePayPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-1 flex-row justify-between space-x-4">
          <LogoImage />
          <FilledButton className="self-end">Bayar Faktur</FilledButton>
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
