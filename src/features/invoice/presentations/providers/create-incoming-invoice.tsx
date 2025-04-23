"use client";

import React, { useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";

interface CreateIncomingInvoiceContextProps {
  receiver?: PartnerEntity;
  setReceiver?: React.Dispatch<React.SetStateAction<PartnerEntity | undefined>>;
}

const CreateIncomingInvoiceContext = React.createContext<CreateIncomingInvoiceContextProps>({});

export function CreateIncomingInvoiceProvider({ children }: { children: React.ReactNode }) {
  const [receiver, setReceiver] = useState<PartnerEntity>();

  return (
    <CreateIncomingInvoiceContext.Provider
      value={{
        receiver,
        setReceiver
      }}
    >
      {children}
    </CreateIncomingInvoiceContext.Provider>
  );
}

export function useCreateIncomingInvoice() {
  return React.useContext(CreateIncomingInvoiceContext);
}