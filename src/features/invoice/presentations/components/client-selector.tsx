"use client";

import { Selector } from "@/features/invoice/presentations/components/selector";
import { SelectorItem } from "@/features/invoice/presentations/components/selector-item";
import { useListPartnerProvider } from "@/features/invoice/presentations/providers/list-partner";

export function ClientSelector() {
  const { partners } = useListPartnerProvider();

  return (
    <Selector>
      {partners.map((partner) => (
        <SelectorItem key={partner.id} title={partner.name} description={partner.email} />
      ))}
    </Selector>
  );
}
