import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import React from "react";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";

export function RowItem({ partner }: { partner: PartnerEntity }) {
  const { setReceiver } = useCreateIncomingInvoice();
  const { nextStep } = useCreateIncomingInvoiceSteps();

  function handleSelectClick() {
    setReceiver?.(partner);
    nextStep?.();
  }

  return (
    <tr>
      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
        {partner.name}
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{partner.email}</td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{partner.phoneNumber}</td>
      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
        <span
          className="text-primary-default hover:text-primary-900 cursor-pointer"
          onClick={handleSelectClick}
        >
          Pilih<span className="sr-only">, {partner.name}</span>
        </span>
      </td>
    </tr>
  );
}