"use client";

import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { CreatePartnerBankAccountProvider } from "@/features/partner/presentation/providers/create-partner-bank-account.provider";

type CreatePartnerBankAccountWrapperForIncomingInvoiceProps = {
  children: React.ReactNode;
};

export function CreatePartnerBankAccountWrapperForIncomingInvoice(
  props: CreatePartnerBankAccountWrapperForIncomingInvoiceProps,
) {
  const { recipient } = useCreateIncomingInvoiceProvider();

  return <CreatePartnerBankAccountProvider partner={recipient}>{props.children}</CreatePartnerBankAccountProvider>;
}
