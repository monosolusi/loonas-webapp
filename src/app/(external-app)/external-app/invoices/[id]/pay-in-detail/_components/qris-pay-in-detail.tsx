"use client";

import { useParams } from "next/navigation";
import {
  useGetPublicPayInDetailForOutgoingInvoice
} from "@/features/invoice/presentations/hooks/use-get-public-pay-in-detail-for-outgoing-invoice";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";
import { RemainingPaymentTime } from "@/core/presentations/components/remaining-payment-time";
import { QrisCard } from "@/core/presentations/components/qris-card";

export function QrisPayInDetail() {
  const { id } = useParams<{ id: string }>();
  const { payIn, loading } = useGetPublicPayInDetailForOutgoingInvoice({ invoiceId: id });

  if (!payIn || loading) return null;
  if (payIn.payIn.type !== PayInType.QRIS) return null;
  return (
    <div className="flex flex-col space-y-4">
      <RemainingPaymentTime deadline={payIn.payIn.expirationTime} />
      <QrisCard
        qrString={payIn.payIn.qrString}
        merchantName="PT. Tumbuh Adidaya Perkasa"
        serialCode={payIn.payIn.id}
      />
    </div>
  );
}
