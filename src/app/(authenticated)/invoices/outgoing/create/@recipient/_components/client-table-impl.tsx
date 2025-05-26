"use client";

import {
  ClientItem,
  ClientTable
} from "@/app/(authenticated)/invoices/outgoing/create/@recipient/_components/client-table";
import { useListPartner } from "@/features/partner/presentation/hooks/use-list-partner";
import { useMemo } from "react";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function ClientTableImpl() {
  const { partners, loading } = useListPartner();
  const { setRecipient, nextStep } = useCreateOutgoingInvoice();

  const handleItemSelected = (item: ClientItem) => {
    if (!setRecipient) return;
    if (!nextStep) return;

    // Looking for PartnerEntity that match the item.id
    const partner = partners.find((partner) => partner.id === item.id);
    if (!partner) return;

    setRecipient(partner);
    nextStep();
  };

  const formattedPartners: ClientItem[] = useMemo(() => {
    if (loading) return [];
    if (partners.length === 0) return [];
    return partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
      email: partner.email,
      phoneNumber: partner.phoneNumber
    }));
  }, [partners, loading]);

  return (
    <ClientTable
      data={formattedPartners}
      onItemSelected={handleItemSelected}
    />
  );
}
