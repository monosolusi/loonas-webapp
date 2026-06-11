"use client";

import { Selector } from "@/features/invoice/presentations/components/selector";
import { SelectorItem } from "@/features/invoice/presentations/components/selector-item";
import { useListPartnerProvider } from "@/features/partner/presentation/providers/list-partner";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";

export function ClientSelector() {
  const { partners } = useListPartnerProvider();
  const { recipient, setRecipient } = useCreateIncomingInvoiceProvider();

  return (
    <Selector>
      {partners.map((partner) => (
        <SelectorItem
          key={partner.id}
          title={partner.name}
          description={partner.email}
          onClick={() => setRecipient?.(partner)}
          state={recipient?.id === partner.id ? "active" : undefined}
        />
      ))}
    </Selector>
  );
}
