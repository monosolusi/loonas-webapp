"use client";

import { Selector } from "@/features/invoice/presentations/components/selector";
import { useListPartner } from "@/features/partner/presentation/hooks/use-list-partner";
import { SelectorItem } from "@/features/invoice/presentations/components/selector-item";

export function ClientSelector() {
  const { partners } = useListPartner();

  return (
    <Selector>
      {partners.map((partner) => (
        <SelectorItem key={partner.id} title={partner.name} description={partner.email} />
      ))}
    </Selector>
  );
}
