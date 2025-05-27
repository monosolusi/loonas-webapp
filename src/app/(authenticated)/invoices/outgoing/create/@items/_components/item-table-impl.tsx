import { ItemRow, ItemTable } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/item-table";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useMemo } from "react";

export function ItemTableImpl() {
  const { items } = useCreateOutgoingInvoice();

  const formattedItems: ItemRow[] = useMemo(() => {
    return items?.map((item) => ({
      name: item.name,
      description: item.description,
      qty: item.qty,
      price: item.price,
      taxBase: item.taxBase,
      tax: item.tax,
      taxType: item.taxType,
      total: item.total,
      discountType: item.discountType,
      discount: item.discount
    })) ?? [];
  }, [items]);

  return (
    <ItemTable data={formattedItems} />
  );
}
