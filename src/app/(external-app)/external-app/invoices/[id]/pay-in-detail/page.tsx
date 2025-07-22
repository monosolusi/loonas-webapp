"use client";

import { LogoImage } from "@/core/presentations/components/logo-image";
import { InvoiceMetadataImpl } from "../pay/_components/invoice-metadata-impl";
import { PaymentSummaryImpl } from "@/app/(external-app)/external-app/invoices/[id]/pay-in-detail/_components/payment-summary-impl";
import { VirtualAccountPayInDetail } from "@/app/(external-app)/external-app/invoices/[id]/pay-in-detail/_components/va-pay-in-detail";
import { useGetPublicPayInDetailForOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-pay-in-detail-for-outgoing-invoice";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PayInStatus } from "@/features/payment/domain/enums/pay-in";

export default function PayInDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { payIn, loading } = useGetPublicPayInDetailForOutgoingInvoice({ invoiceId: id });
  const router = useRouter();

  useEffect(() => {
    if (!payIn) return;
    if (payIn.status === PayInStatus.PENDING_PAYMENT) return; // The current page is for payment

    const routerMap = {
      [PayInStatus.EXPIRED]: "expired-failed",
      [PayInStatus.FAILED]: "expired-failed",
      [PayInStatus.PAID]: "paid",
      [PayInStatus.PENDING_CREATION]: "pending-creation",
    };

    const path = routerMap[payIn.status];
    if (path) router.replace(path);
  }, [payIn]);

  if (!payIn || loading) return null;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex-1 self-start">
          <LogoImage />
        </div>
        <div className="flex-1">
          <InvoiceMetadataImpl />
        </div>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-gray-900">Lakukan Pembayaran</h1>
            <p className="mt-2 text-sm text-gray-700">
              Silahkan membayar sesuai dengan instruksi yang diberikan di bawah ini.
            </p>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex-2">
              <VirtualAccountPayInDetail />
            </div>
            <div className="flex-1">
              <PaymentSummaryImpl />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
