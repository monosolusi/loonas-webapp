"use client";

import { FilledButton } from "@/core/presentations/components/filled-button";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";
import { useMemo } from "react";
import { useCreateAccountBankAccount } from "@/features/bank/presentation/hooks/use-create-account-bank-account";
import { useRouter } from "next/navigation";

interface CreateAccountBankAccountButtonProps {
  accountNumber?: string;
  bank?: BankEntity | null | undefined;
  inquiredAccount?: AccountInquiryResultEntity;
}

export function CreateAccountBankAccountButton(props: CreateAccountBankAccountButtonProps) {
  const { trigger, isMutating } = useCreateAccountBankAccount();
  const router = useRouter();

  const isDisabled = useMemo((): boolean => {
    if (!props.accountNumber) return true;
    if (!props.bank) return true;
    if (!props.inquiredAccount) return true;
    return false;
  }, [props.accountNumber, props.bank, props.inquiredAccount]);

  const handleSubmit = async () => {
    if (!props.bank || !props.accountNumber) return;
    if (!props.inquiredAccount) return;
    if (isMutating) return;

    await trigger({
      bankId: props.bank.id,
      accountNumber: props.accountNumber,
    });

    // Navigating to /home for this case
    // TODO: We should implement something like window.history
    router.push("/");
  };

  return (
    <FilledButton disabled={isDisabled} onClick={handleSubmit}>
      Tambah Rekening Baru
    </FilledButton>
  );
}
