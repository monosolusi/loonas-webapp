"use client";

import { BanknotesIcon, ClockIcon, CreditCardIcon } from "@heroicons/react/20/solid";
import { useParams } from "next/navigation";
import { Timeline } from "../../disbursement-status/_components/timeline";
import { useGetIncomingInvoice } from "@/features/invoice/presentations/hooks/use-get-incoming-invoice";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";

export function TimelineImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetIncomingInvoice({ id });

  if (!invoice || loading) return null;
  return (
    <Timeline
      currentStatus={invoice.status}
      override={{ title: <h3 className="mb-4 text-lg font-semibold">Status Transaksis</h3> }}
      items={[
        {
          id: 1,
          content: "Silakan lakukan pembayaran, kami siap memprosesnya.",
          status: PaymentRequestStatus.PENDING_PAYMENT,
          icon: ClockIcon,
          iconBackground: "bg-yellow-400",
        },
        {
          id: 2,
          content: "Terima kasih! Pembayaran masuk, faktur kamu sedang kami urus.",
          status: PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY,
          icon: CreditCardIcon,
          iconBackground: "bg-yellow-500",
        },
        {
          id: 4,
          content: "Dana kamu sukses diteruskan ke bank penerima, sekarang tinggal proses di pihak mereka.",
          status: PaymentRequestStatus.COMPLETED,
          icon: BanknotesIcon,
          iconBackground: "bg-green-500",
        },
      ]}
    />
  );
}
