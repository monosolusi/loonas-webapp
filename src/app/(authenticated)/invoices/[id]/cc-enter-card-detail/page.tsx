import { PaymentRequestProvider } from "@/features/payment/presentations/providers/payment-request";
import { EnterCardDetailContent } from "./_components/content";

export default async function EnterCardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PaymentRequestProvider requestId={id}>
      {/*<CreditCardFullRedirectPayInDetailProvider requestId={id}>*/}
      <EnterCardDetailContent />
      {/*</CreditCardFullRedirectPayInDetailProvider>*/}
    </PaymentRequestProvider>
  );
}
