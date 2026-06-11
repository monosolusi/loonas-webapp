import { createContext, useContext } from "react";
import {
  ListPartnerBankAccountContextProps,
  ListPartnerBankAccountProviderProps,
} from "@/features/partner/presentation/providers/list-partner-bank-account.types";
import { useListPartnerBankAccount } from "@/features/partner/presentation/hooks/use-list-partner-bank-account";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";

const ListPartnerBankAccountContext = createContext<ListPartnerBankAccountContextProps>({
  banks: [],
});

export function ListPartnerBankAccountProvider(props: ListPartnerBankAccountProviderProps) {
  const { recipient } = useCreateIncomingInvoiceProvider();
  const { banks } = useListPartnerBankAccount({ partner: recipient });

  return (
    <ListPartnerBankAccountContext.Provider value={{ banks }}>
      {props.children}
    </ListPartnerBankAccountContext.Provider>
  );
}

export function useListPartnerBankAccountProvider() {
  const context = useContext(ListPartnerBankAccountContext);
  if (!context) throw new Error("Invalid Hook Call");
  return context;
}
