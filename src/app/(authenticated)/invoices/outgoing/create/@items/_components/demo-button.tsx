import {
  DiscountType,
  useCreateOutgoingInvoice,
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";

export function DemoButton() {
  const { addInvoiceItem, setInvoiceNumber } = useCreateOutgoingInvoice();

  const autoPopulateData = () => {
    if (!addInvoiceItem) return;
    if (!setInvoiceNumber) return;

    addInvoiceItem({
      name: "Demo Item",
      description: "Demo Item Description",
      qty: 1,
      price: 10000000,
      taxType: TaxType.NON_TAXABLE,
      tax: 0,
      taxBase: 0,
      discountType: DiscountType.NO_DISCOUNT,
      discount: 0,
      total: 10000000,
    });

    setInvoiceNumber("INV/2025/05/0002");
  };

  if (process.env.NODE_ENV === "production") return;
  return <OutlinedButton onClick={autoPopulateData}>Auto Populate Data</OutlinedButton>;
}
