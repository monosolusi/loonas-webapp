import { InvoicePreview } from "@/app/(authenticated)/invoices/_components/invoice-preview";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { PageContent } from "@/core/presentations/components/page-content";
import { BackButton } from "@/core/presentations/components/back-button";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { InvoiceSummary } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/invoice-summary";

export default function OutgoingInvoiceDetailPage() {
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-1 flex-row justify-between space-x-4">
          <div className="flex">
            <BackButton />
          </div>
          <div className="flex flex-1 flex-row justify-end space-x-2 self-end">
            <div className="flex">
              <OutlinedButton>Download PDF</OutlinedButton>
            </div>
            <div className="flex">
              <FilledButton>Kirim Faktur</FilledButton>
            </div>
          </div>
        </div>
        <InvoiceSummary />
        <div className="flex flex-1">
          <InvoicePreview
            invoice={{
              id: uuid(),
              invoiceNumber: "INV/2025/05/0001",
              invoiceDate: DateTime.now(),
              dueDate: DateTime.now().plus({ days: 10 }),
            }}
            items={[
              {
                name: "Layanan Maintenance Website Bulanan",
                description:
                  "Pemeliharaan rutin situs web meliputi update plugin, monitoring keamanan, backup mingguan, dan perbaikan bug minor. Periode: 1 - 31 Mei 2025.",
                qty: 1,
                price: 100000000,
                taxType: TaxType.MANUAL_EXCLUSIVE,
                tax: 100000,
                taxBase: 100000000,
                total: 110000000,
                discountType: DiscountType.FIXED,
                discount: 10000,
              },
            ]}
            recipient={{
              name: "PT. Mono Solusi Indonesia",
              email: "halo@monosolusi.com",
              phoneNumber: "+62123456789",
            }}
            sender={{
              name: "Frans Siswanto",
              address: "Jl. Kebon Sirih No. 123, Kota Bandung, Jawa Barat",
            }}
            signature={{ signerName: "Frans Siswanto" }}
          />
        </div>
      </div>
    </PageContent>
  );
}
