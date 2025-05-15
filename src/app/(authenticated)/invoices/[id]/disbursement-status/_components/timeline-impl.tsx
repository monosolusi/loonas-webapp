import { PaymentRequestStatus } from "@/features/invoice/domain/enums/payment-request";
import { BanknotesIcon, ClockIcon, CreditCardIcon } from "@heroicons/react/20/solid";
import { Timeline } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/timeline";
import React from "react";

export function TimelineImpl() {
  const currentStatus = PaymentRequestStatus.PENDING_PAYMENT;

  return (
    <Timeline
      currentStatus={currentStatus}
      items={[
        {
          id: 1,
          content: "Silakan lakukan pembayaran, kami siap memprosesnya.",
          status: PaymentRequestStatus.PENDING_PAYMENT,
          icon: ClockIcon,
          iconBackground: "bg-yellow-400"
        },
        {
          id: 2,
          content: "Terima kasih! Pembayaran masuk, faktur kamu sedang kami urus.",
          status: PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY,
          icon: CreditCardIcon,
          iconBackground: "bg-yellow-500"
        },
        {
          id: 4,
          content: "Dana kamu sukses diteruskan ke bank penerima, sekarang tinggal proses di pihak mereka.",
          status: PaymentRequestStatus.COMPLETED,
          icon: BanknotesIcon,
          iconBackground: "bg-green-500"
        }
      ]}
    />
  );
}