"use client";

import { useParams } from "next/navigation";
import { VirtualAccountPaymentInstruction } from "./va-payment-instruction";
import { useGetVirtualAccountPayInDetail } from "@/features/payment/presentations/hooks/use-get-virtual-account-pay-in-detail";

export function VirtualAccountPaymentInstructionImpl() {
  const { id } = useParams<{ id: string }>();
  const { payIn, loading } = useGetVirtualAccountPayInDetail({ requestId: id });

  if (loading || !payIn) return null;
  return (
    <VirtualAccountPaymentInstruction
      paymentMethod={payIn.paymentScheme.name}
      accountNumber={payIn.accountNumber}
      amountToPay={payIn.amount}
      expireAt={payIn.expirationTime}
    />
  );
}
