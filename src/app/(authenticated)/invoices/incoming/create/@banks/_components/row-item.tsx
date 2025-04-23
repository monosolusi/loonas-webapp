import { BankAccountEntity } from "@/features/bank/domain/entities/bank";
import React from "react";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";

export function RowItem({ bankAccount }: { bankAccount: BankAccountEntity }) {
  const { setBankAccount } = useCreateIncomingInvoice();
  const { nextStep } = useCreateIncomingInvoiceSteps();

  function handleSelectClick() {
    setBankAccount?.(bankAccount);
    nextStep?.();
  }

  return (
    <tr>
      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
        {bankAccount.bankName}
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{bankAccount.accountNumber}</td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{bankAccount.accountHolderName}</td>
      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
        <span
          className="text-primary-default hover:text-primary-900 cursor-pointer"
          onClick={handleSelectClick}
        >
          Pilih<span className="sr-only">, {bankAccount.accountHolderName}</span>
        </span>
      </td>
    </tr>
  );
}