"use client";

import React, { useMemo } from "react";
import { ClientTable } from "@/app/(authenticated)/clients/_components/client-table";
import { useListPartner } from "@/features/partner/presentation/hooks/use-list-partner";
import { NoClientState } from "@/app/(authenticated)/clients/_components/no-client-state";

export function ClientTableImpl() {
  const { partners, loading, error } = useListPartner();

  const formattedPartners = useMemo(() => {
    if (error) return [];
    return partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
      email: partner.email,
      phoneNumber: partner.phoneNumber,
    }));
  }, [partners, error]);

  if (loading || !partners) return null;
  if (partners.length === 0) return <NoClientState />;
  return <ClientTable data={formattedPartners} />;
}
