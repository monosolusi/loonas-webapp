import { useParams } from "next/navigation";
import { useGetPublicPayInDetailForOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-pay-in-detail-for-outgoing-invoice";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";

export function CreditCardFullRedirectPayInDetail() {
  const { id } = useParams<{ id: string }>();
  const { payIn, loading } = useGetPublicPayInDetailForOutgoingInvoice({ invoiceId: id });

  if (!payIn || loading) return null;
  if (payIn.payIn.type !== PayInType.CREDIT_CARD_FULL_REDIRECT) return null;
  return (
    <div>
      <iframe src={payIn.payIn.paymentUrl} className="min-h-[500px] w-full" allowFullScreen />
    </div>
  );
}
