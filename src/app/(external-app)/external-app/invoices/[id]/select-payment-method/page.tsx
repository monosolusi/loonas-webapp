import { LogoImage } from "@/core/presentations/components/logo-image";
import { InvoiceMetadataImpl } from "./_components/invoice-metadata-impl";
import { SelectPaymentMethod } from "./_components/select-payment-method";
import { SelectPaymentMethodImpl } from "./_components/select-payment-method-impl";

export default function SelectPaymentMethodPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex-1 self-start">
          <LogoImage />
        </div>
        <div className="flex-1">
          <InvoiceMetadataImpl />
        </div>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-gray-900">Pilih Metode Pembayaran</h1>
            <p className="mt-2 text-sm text-gray-700">
              Pilih metode pembayaran yang ingin kamu gunakan untuk membayar faktur ini.
            </p>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex-2">
              <SelectPaymentMethodImpl />
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
