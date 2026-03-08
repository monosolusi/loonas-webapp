"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { Step } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps.types";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { useMemo } from "react";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { PayInType } from "@/features/payment/domain/enums/pay-in-type";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

const VISIBLE_STATE: Step[] = ["select-payment-method"];

export function CreateIncomingSaveButton() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const { isClean, createInvoice, isCreating } = useCreateIncomingInvoiceProvider();

  const disabled = useMemo(() => {
    return !isClean || isCreating;
  }, [isClean, isCreating]);

  const onClick = async () => {
    if (!createInvoice) return;

    const result = await createInvoice();
    const type = result.paymentMethod.type;
    // Hard replace to fully remove the create flow from browser history,
    // preventing router.back() on downstream pages from returning here.
    let paymentPath: string;
    if (type === PayInType.VIRTUAL_ACCOUNT) {
      paymentPath = `/invoices/incoming/${result.id}/va-pay-in-detail`;
    } else if (type === PayInType.QRIS) {
      paymentPath = `/invoices/incoming/${result.id}/qris-pay-in-detail`;
    } else if (
      type === PayInType.CREDIT_CARD_FULL_REDIRECT ||
      type === PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_3_MONTHS ||
      type === PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_6_MONTHS ||
      type === PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_12_MONTHS
    ) {
      paymentPath = `/invoices/incoming/${result.id}/cc-enter-card-detail`;
    } else {
      throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
    }
    window.location.replace(paymentPath);
  };

  if (!VISIBLE_STATE.includes(currentStep)) return null;
  return <PrimaryButton label="Simpan & Bayar" disabled={disabled} onClick={onClick} loading={isCreating} />;
}
