"use client";

import { useListPartnerBankAccountProvider } from "@/features/partner/presentation/providers/list-partner-bank-account";
import { Selector } from "@/features/invoice/presentations/components/selector";
import { SelectorItem } from "@/features/invoice/presentations/components/selector-item";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";

export function PartnerBankAccountSelector() {
  const { banks } = useListPartnerBankAccountProvider();
  const { bankAccount, setBankAccount } = useCreateIncomingInvoiceProvider();

  return (
    <Selector>
      {banks.map((bank) => {
        const description = `${bank.bankName} - ${bank.accountNumber}`;
        return (
          <SelectorItem
            key={bank.id}
            title={bank.accountHolderName}
            description={description}
            onClick={() => setBankAccount?.(bank)}
            state={bankAccount?.id === bank.id ? "active" : undefined}
          />
        );
      })}
    </Selector>
  );
}
