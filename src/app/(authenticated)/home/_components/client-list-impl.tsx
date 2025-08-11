"use client";

import { ClientItem, ClientList } from "@/app/(authenticated)/home/_components/client-list";
import { useMemo } from "react";
import { useListPartner } from "@/features/partner/presentation/hooks/use-list-partner";

export function ClientListImpl() {
  const { partners, error } = useListPartner();

  const formattedPartners: ClientItem[] = useMemo(() => {
    if (error) return [];
    return partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
    }));
  }, [partners, error]);

  return <ClientList data={formattedPartners} />;
}
