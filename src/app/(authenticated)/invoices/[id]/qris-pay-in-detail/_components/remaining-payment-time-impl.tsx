"use client";

import { RemainingPaymentTime } from "@/core/presentations/components/remaining-payment-time";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetIncomingInvoicePayInDetail } from "@/features/payment/presentations/hooks/use-get-incoming-invoice-pay-in-detail";
import { QrisPayInDetailEntity } from "@/features/payment/domain/entities/qris-pay-in-detail-entity";

export function RemainingPaymentTimeImpl() {
  const { id } = useParams<{ id: string }>();
  const { payInDetail, loading } = useGetIncomingInvoicePayInDetail({ invoice: { id } });

  const deadline = useMemo(() => {
    if (loading) return null;
    if (!payInDetail) return null;
    if (!(payInDetail instanceof QrisPayInDetailEntity)) return null;
    return payInDetail.expirationTime;
  }, [payInDetail, loading]);

  if (!deadline) return null;
  return <RemainingPaymentTime deadline={deadline} />;
}
