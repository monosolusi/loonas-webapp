"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { useMemo } from "react";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { useRouter } from "next/navigation";
import { PayInType } from "@/features/payment/domain/enums/pay-in-type";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

const VISIBLE_STATE: Step[] = ["select-payment-method"];

export function CreateIncomingSaveButton() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const { isClean, createInvoice, isCreating } = useCreateIncomingInvoiceProvider();
  const router = useRouter();

  const disabled = useMemo(() => {
    return !isClean || isCreating;
  }, [isClean, isCreating]);

  const onClick = async () => {
    if (!createInvoice) return;

    const result = await createInvoice();
    const type = result.paymentMethod.type;
    if (type === PayInType.VIRTUAL_ACCOUNT) {
      router.replace(`/invoices/incoming/${result.id}/va-pay-in-detail`);
    } else if (type === PayInType.QRIS) {
      router.replace(`/invoices/incoming/${result.id}/qris-pay-in-detail`);
    } else if (
      type === PayInType.CREDIT_CARD_FULL_REDIRECT ||
      type === PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_3_MONTHS ||
      type === PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_6_MONTHS ||
      type === PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_12_MONTHS
    ) {
      router.replace(`/invoices/incoming/${result.id}/cc-enter-card-detail`);
    } else {
      throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
    }
  };

  if (!VISIBLE_STATE.includes(currentStep)) return null;
  return <PrimaryButton label="Simpan & Bayar" disabled={disabled} onClick={onClick} loading={isCreating} />;
}
