"use client";

import { FilledButton } from "@/core/presentations/components/filled-button";
import {
  DiscountType,
  TaxType,
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function HeaderAddItemButton() {
  const { addInvoiceItem } = useCreateOutgoingInvoice();

  const handleClick = () => {
    if (!addInvoiceItem) return;

    addInvoiceItem({
      name: "Item 1",
      description: "Deskripsi Item 1",
      qty: 1,
      price: 100000,
      taxType: TaxType.EXCLUSIVE,
      tax: 9900,
      discountType: DiscountType.FIXED,
      discount: 10000
    });

    addInvoiceItem({
      name: "Item 2",
      description: "Deskripsi Item 2",
      qty: 10,
      price: 100000,
      taxType: TaxType.INCLUSIVE,
      tax: 10000
    });

    addInvoiceItem({
      name: "Item 3",
      description: "Deskripsi Item 3",
      qty: 10,
      price: 100000,
      taxType: TaxType.NON_TAXABLE,
      tax: 0
    });
  };

  return (
    <FilledButton onClick={handleClick}>
      Tambah Item
    </FilledButton>
  );
}
