"use client";

import { QrisPayInDetailBox } from "@/app/(authenticated)/invoices/incoming/[id]/qris-pay-in-detail/_components/qris-pay-in-detail-box";
import { useParams } from "next/navigation";
import { useGetIncomingInvoicePayInDetail } from "@/features/payment/presentations/hooks/use-get-incoming-invoice-pay-in-detail";
import { QrisPayInDetailEntity } from "@/features/payment/domain/entities/qris-pay-in-detail-entity";

export function QrisPayInDetailBoxImpl() {
  const { id } = useParams<{ id: string }>();
  const { payInDetail, loading } = useGetIncomingInvoicePayInDetail({ invoice: { id } });

  if (loading || !payInDetail) return null;
  if (!(payInDetail instanceof QrisPayInDetailEntity)) return null;
  return (
    <QrisPayInDetailBox
      payInDetail={{ id: payInDetail.id }}
      merchant={{ name: "PT. Tumbuh Adidaya Perkasa" }}
      qrString={payInDetail.qrString}
    />
  );
}
