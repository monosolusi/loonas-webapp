"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  CreatePartnerBankAccountContextProps,
  CreatePartnerBankAccountProviderProps,
} from "@/features/partner/presentation/providers/create-partner-bank-account.types";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { useCreatePartnerBankAccount } from "@/features/partner/presentation/hooks/use-create-partner-bank-account";
import { isNonEmptyString } from "@/core/utilities/validation-patterns";

const CreatePartnerBankAccountContext = createContext<CreatePartnerBankAccountContextProps>({
  isVerified: false,
  isCreating: false,
});

export function CreatePartnerBankAccountProvider(props: CreatePartnerBankAccountProviderProps) {
  const [bank, setBank] = useState<BankEntity>();
  const [accountNumber, setAccountNumber] = useState<string>();
  const [accountHolderName, setAccountHolderName] = useState<string>();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { trigger, isMutating } = useCreatePartnerBankAccount();

  useEffect(() => {
    setIsVerified(false);
  }, [bank, accountNumber]);

  const isClean = useMemo(() => {
    return (
      !!bank && isNonEmptyString(accountNumber) && isNonEmptyString(accountHolderName) && isVerified && !!props.partner
    );
  }, [bank, accountNumber, accountHolderName, isVerified]);

  const clearInput = () => {
    setBank(undefined);
    setAccountNumber("");
    setAccountHolderName("");
  };

  const createBankAccount = async () => {
    if (!isClean) throw new ServerError(ErrorCodes.INCOMPLETE_FORM);

    const bankAccount = await trigger({
      bank: bank!,
      accountNumber: accountNumber!,
      accountHolderName: accountHolderName!,
      partner: props.partner!,
    });

    clearInput();

    return bankAccount;
  };

  return (
    <CreatePartnerBankAccountContext.Provider
      value={{
        bank,
        accountNumber,
        accountHolderName,
        isVerified,
        isCreating: isMutating,
        setIsVerified,
        setBank,
        setAccountNumber,
        setAccountHolderName,
        createBankAccount,
      }}
    >
      {props.children}
    </CreatePartnerBankAccountContext.Provider>
  );
}

export function useCreatePartnerBankAccountProvider() {
  const context = useContext(CreatePartnerBankAccountContext);
  if (!context) throw new ServerError(ErrorCodes.INVALID_HOOK_CALL);
  return context;
}
