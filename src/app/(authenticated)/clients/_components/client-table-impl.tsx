"use client";

import React, { useMemo } from "react";
import { ClientTable } from "@/app/(authenticated)/clients/_components/client-table";
import { useListPartner } from "@/features/partner/presentation/providers/list-partner";

export function ClientTableImpl() {
  const { partners, loading } = useListPartner();

  const formattedPartners = useMemo(() => {
    return partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
      email: partner.email,
      phoneNumber: partner.phoneNumber
    }));
  }, [partners]);

  if (loading || !partners) return null;
  if (partners.length === 0) return null;
  return (
    <ClientTable data={formattedPartners} />
  );
}
