import { InvoicePreview } from "@/app/(authenticated)/invoices/_components/invoice-preview";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";

export function InvoicePreviewImpl() {
  const { items, recipient, signature, dueDate, invoiceNumber, invoiceDate, note, tnc } = useCreateOutgoingInvoice();
  const { selectedAccount } = useSelectedAccountProvider();

  if (!recipient) return null;
  if (!selectedAccount) return null;
  if (!invoiceNumber) return null;
  return (
    <InvoicePreview
      invoice={{ invoiceNumber, invoiceDate, dueDate, note, tnc }}
      items={items}
      recipient={{ name: recipient.name, phoneNumber: recipient.phoneNumber, email: recipient.email }}
      sender={{ name: selectedAccount.fullName, address: selectedAccount?.fullAddress }}
      signature={{ file: signature, signerName: selectedAccount.fullName }}
    />
  );
}
