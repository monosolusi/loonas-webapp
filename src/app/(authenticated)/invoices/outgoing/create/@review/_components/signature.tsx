import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";

export function Signature() {
  const { invoiceDate, signature } = useCreateOutgoingInvoice();
  const { selectedAccount } = useSelectedAccountProvider();

  if (!selectedAccount) return null;
  return (
    <div className="flex flex-col items-end space-y-4">
      <div className="text-gray-500">{invoiceDate.setLocale("id-id").toFormat("dd MMMM yyyy")}</div>
      {signature ? (
        <img alt="signature" className="w-1/2" src={URL.createObjectURL(signature)} />
      ) : (
        <div className="w-1/2 bg-gray-50 py-16 text-center font-semibold text-gray-500">
          Tidak memiliki tanda tangan
        </div>
      )}

      <div className="text-gray-500">{selectedAccount.fullName}</div>
    </div>
  );
}
