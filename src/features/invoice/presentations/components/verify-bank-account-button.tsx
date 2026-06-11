"use client";

import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { InquiryBankAccount } from "@/features/bank/presentation/components/inquiry-bank-account";
import { useCreatePartnerBankAccountProvider } from "@/features/partner/presentation/providers/create-partner-bank-account.provider";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";
import { useMemo } from "react";

const VISIBLE_STATE: string[] = ["client-bank-account.create-new"];

export function VerifyBankAccountButton() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const { bank, accountNumber, isVerified, setIsVerified, setAccountHolderName } =
    useCreatePartnerBankAccountProvider();

  const onInquired = (result: AccountInquiryResultEntity) => {
    if (!setAccountHolderName || !setIsVerified) return null;
    setAccountHolderName(result.accountHolderName);
    setIsVerified(true);
  };

  const isVisible = useMemo(() => {
    // Anything not in the VISIBLE_STATE is not visible. This is top priority.
    if (!VISIBLE_STATE.includes(currentStep)) return false;

    // Assuming we are in the VISIBLE_STATE
    if (isVerified) return false;
    else return true;
  }, [currentStep, isVerified]);

  if (!isVisible) return null;
  return <InquiryBankAccount onInquired={onInquired} bankId={bank?.id} accountNumber={accountNumber} />;
}
