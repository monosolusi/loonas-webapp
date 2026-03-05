import { SectionCard } from "@/core/presentations/components/section-card";
import { RemainingPaymentTime } from "@/core/presentations/components/remaining-payment-time";
import { VirtualAccountDetailBox } from "@/core/presentations/components/va-detail";
import { useParams } from "next/navigation";
import { useGetPublicPayInDetailForOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-pay-in-detail-for-outgoing-invoice";
import { PayInType } from "@/features/payment/domain/enums/pay-in-type";

export function VirtualAccountPayInDetail() {
  const { id } = useParams<{ id: string }>();
  const { payIn, loading } = useGetPublicPayInDetailForOutgoingInvoice({ invoiceId: id });

  if (!payIn || loading) return null;
  if (payIn.payIn.type !== PayInType.VIRTUAL_ACCOUNT) return null;
  return (
    <SectionCard title="Detail Pembayaran">
      <div className="flex flex-col space-y-4">
        <RemainingPaymentTime deadline={payIn.payIn.expirationTime} />
        <VirtualAccountDetailBox
          logoUrl={payIn.payIn.bank.logoUrl}
          bankName={payIn.payIn.bank.name}
          accountNumber={payIn.payIn.accountNumber}
          totalPayment={payIn.summary.totalPayable}
        />
      </div>
    </SectionCard>
  );
}
