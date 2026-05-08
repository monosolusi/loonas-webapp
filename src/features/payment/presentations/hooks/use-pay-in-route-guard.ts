"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentMethodPayInDetailEntity } from "@/features/payment/domain/entities/payment-method-pay-in-detail-entity";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { QrisPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/qris-pay-in-detail";
import { CreditCardFullRedirectPayInDetailEntity } from "@/features/payment/domain/entities/cc-full-redirect-pay-in-detail";

type PayInRoute = "va-pay-in-detail" | "qris-pay-in-detail" | "cc-enter-card-detail";

function resolvePayInRoute(entity: PaymentMethodPayInDetailEntity): PayInRoute | null {
  if (entity instanceof VirtualAccountPayInDetailEntity) return "va-pay-in-detail";
  if (entity instanceof QrisPayInDetailEntity) return "qris-pay-in-detail";
  if (entity instanceof CreditCardFullRedirectPayInDetailEntity) return "cc-enter-card-detail";
  return null;
}

/**
 * Redirects to the correct payment page if the current route doesn't match
 * the actual payment type. Returns true if redirecting (page should not render).
 */
export function usePayInRouteGuard(params: {
  invoiceId: string;
  currentRoute: PayInRoute;
  payInDetail: PaymentMethodPayInDetailEntity | undefined;
  loading: boolean;
}): boolean {
  const router = useRouter();
  const { invoiceId, currentRoute, payInDetail, loading } = params;

  const correctRoute = payInDetail ? resolvePayInRoute(payInDetail) : null;
  const shouldRedirect = !loading && payInDetail != null && correctRoute != null && correctRoute !== currentRoute;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(`/invoices/incoming/${invoiceId}/${correctRoute}`);
    }
  }, [shouldRedirect, invoiceId, correctRoute, router]);

  return shouldRedirect;
}
