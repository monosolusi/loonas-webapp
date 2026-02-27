import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

export function DemoButton() {
  const { addInvoiceItem, setInvoiceNumber, setNote, setTnc } = useCreateOutgoingInvoice();

  const autoPopulateData = () => {
    if (!addInvoiceItem) return;
    if (!setInvoiceNumber) return;
    if (!setNote) return;
    if (!setTnc) return;

    addInvoiceItem({
      name: "Item 1",
      description: "Deskripsi Item Pertama",
      qty: 5,
      price: 100000,
      taxType: TaxType.NON_TAXABLE,
      tax: 0,
      taxBase: 0,
      discountType: DiscountType.NO_DISCOUNT,
      discount: 0,
      total: 500000,
    });

    addInvoiceItem({
      name: "Item 2",
      description: "Deskripsi Item Kedua",
      qty: 3,
      price: 100000,
      taxType: TaxType.MANUAL_EXCLUSIVE,
      tax: 10000,
      taxBase: 300000,
      discountType: DiscountType.NO_DISCOUNT,
      discount: 0,
      total: 310000,
    });

    setInvoiceNumber("INV/2025/05/0002");
    setNote(
      "Pembayaran atas jasa pembuatan materi promosi digital dan pengelolaan kampanye iklan untuk periode 1–31 Mei 2025.",
    );
    setTnc(
      "Pembayaran wajib diselesaikan dalam 7 hari sejak invoice diterbitkan, klaim keberatan disampaikan maksimal 3 hari, dan invoice ini sah secara hukum sebagai bukti penagihan.",
    );
  };

  if (process.env.NODE_ENV === "production") return;
  return <SecondaryButton outlined label="Auto Populate Data" onClick={autoPopulateData} />;
}
