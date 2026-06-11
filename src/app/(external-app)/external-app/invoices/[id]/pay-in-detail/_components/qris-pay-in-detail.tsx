"use client";

import { useParams } from "next/navigation";
import {
  useGetPublicPayInDetailForOutgoingInvoice
} from "@/features/invoice/presentations/hooks/use-get-public-pay-in-detail-for-outgoing-invoice";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";
import { RemainingPaymentTime } from "@/core/presentations/components/remaining-payment-time";
import {
  QrisPayInDetailBox
} from "@/app/(authenticated)/invoices/incoming/[id]/qris-pay-in-detail/_components/qris-pay-in-detail-box";

export function QrisPayInDetail() {
  const { id } = useParams<{ id: string }>();
  const { payIn, loading } = useGetPublicPayInDetailForOutgoingInvoice({ invoiceId: id });

  if (!payIn || loading) return null;
  if (payIn.payIn.type !== PayInType.QRIS) return null;
  return (
    <div className="flex flex-col space-y-4">
      <RemainingPaymentTime deadline={payIn.payIn.expirationTime} />
      <QrisPayInDetailBox
        payInDetail={{ id: payIn.payIn.id }}
        merchant={{ name: "PT. Tumbuh Adidaya Perkasa" }}
        qrString={payIn.payIn.qrString}
      />
    </div>
  );
}
