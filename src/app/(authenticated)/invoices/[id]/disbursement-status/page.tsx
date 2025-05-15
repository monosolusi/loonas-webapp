"use client";

import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { CurrentStatus } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/current-status";
import { Timeline } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/timeline";
import { Actions } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/actions";
import { PaymentRequestStatus } from "@/features/invoice/domain/enums/payment-request";
import { BanknotesIcon, ClockIcon, CreditCardIcon } from "@heroicons/react/20/solid";
import {
  PaymentInstruction
} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/payment-instruction";


export default function DisbursementStatusPage() {
  return (
    <PageContent>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <CurrentStatus
            title="Transaksi sedang diproses"
            description="Kami sedang menyelesaikan transaksi Anda. Silakan periksa status di bawah."
          />
        </div>
        <PaymentInstruction />
        <div className="mb-6">
          <Timeline
            currentStatus={PaymentRequestStatus.PENDING_PAYMENT}
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
                status: PaymentRequestStatus.PROCESSING,
                icon: CreditCardIcon,
                iconBackground: "bg-blue-500"
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
        </div>
        <Actions />
      </div>
    </PageContent>
  );
}