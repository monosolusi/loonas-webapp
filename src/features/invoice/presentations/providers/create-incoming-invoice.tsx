"use client";

import React, { useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";

interface CreateIncomingInvoiceContextProps {
  receiver?: PartnerEntity;
  bankAccount?: BankAccountEntity;
  setReceiver?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
  setBankAccount?: React.Dispatch<React.SetStateAction<BankAccountEntity | undefined>>;
}

const CreateIncomingInvoiceContext = React.createContext<CreateIncomingInvoiceContextProps>({});

export function CreateIncomingInvoiceProvider({ children }: { children: React.ReactNode }) {
  const [receiver, setReceiver] = useState<PartnerEntity>();
  const [bankAccount, setBankAccount] = useState<BankAccountEntity>();

  return (
    <CreateIncomingInvoiceContext.Provider
      value={{
        receiver,
        bankAccount,
        setReceiver,
        setBankAccount
      }}
    >
      {children}
    </CreateIncomingInvoiceContext.Provider>
  );
}

export function useCreateIncomingInvoice() {
  return React.useContext(CreateIncomingInvoiceContext);
}