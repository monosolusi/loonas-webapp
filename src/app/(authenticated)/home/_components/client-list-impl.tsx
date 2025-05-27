"use client";

import { DateTime } from "luxon";
import { ClientItem, ClientList } from "@/app/(authenticated)/home/_components/client-list";
import { useMemo } from "react";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { useListPartner } from "@/features/partner/presentation/hooks/use-list-partner";


export function ClientListImpl() {
  const { partners } = useListPartner();

  const formattedPartners: ClientItem[] = useMemo(() => {
    return partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
      lastInvoice: {
        date: DateTime.now(),
        amount: 100000000,
        status: PaymentRequestStatus.COMPLETED
      }
    }));
  }, [partners]);

  return (
    <ClientList data={formattedPartners} />
  );
}
