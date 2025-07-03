import { InvoicePreview } from "@/app/(authenticated)/invoices/_components/invoice-preview";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { LogoImage } from "@/core/presentations/components/logo-image";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DateTime } from "luxon";
import { InvoiceMetadataImpl } from "./_components/invoice-metadata-impl";

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
          <InvoicePreview
            invoice={{
              id: "123456789",
              invoiceNumber: "INV/2025/07/0001",
              invoiceDate: DateTime.now().setZone("Asia/Jakarta"),
              dueDate: DateTime.now().setZone("Asia/Jakarta").plus({ days: 30 }),
            }}
            items={[
              {
                name: "Layanan Konsultasi",
                description: "Konsultasi bisnis selama 1 jam",
                qty: 1,
                price: 10000000,
                taxType: TaxType.MANUAL_EXCLUSIVE,
                tax: 1000000,
                taxBase: 10000000,
                total: 11000000,
                discountType: DiscountType.NO_DISCOUNT,
                discount: 0,
              },
            ].map((item) => ({
              name: item.name,
              description: item.description,
              qty: item.qty,
              price: item.price,
              taxType: item.taxType,
              tax: item.tax,
              taxBase: item.taxBase,
              total: item.total,
              discountType: item.discountType,
              discount: item.discount,
            }))}
            recipient={{
              name: "PT. Loonas Solusi Digital",
              email: "info@loonassolusi.com",
              phoneNumber: "021-12345678",
            }}
            sender={{
              name: "Frans Siswanto",
              address: "Jl. Raya No. 1, Jakarta",
            }}
            signature={{
              signerName: "Frans Siswanto",
            }}
          />
        </div>
      </div>
    </div>
  );
}
