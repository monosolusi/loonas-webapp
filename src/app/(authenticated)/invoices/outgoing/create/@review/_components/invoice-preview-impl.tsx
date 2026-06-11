import { InvoicePreview } from "@/app/(authenticated)/invoices/_components/invoice-preview";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function InvoicePreviewImpl() {
  const { items, recipient, signature, dueDate, invoiceNumber, invoiceDate, note, tnc } = useCreateOutgoingInvoice();
  const { account, loading } = useGetCurrentAccount();

  if (!recipient) return null;
  if (loading || !account) return null;
  if (!invoiceNumber) return null;
  return (
    <InvoicePreview
      invoice={{ invoiceNumber, invoiceDate, dueDate, note, tnc }}
      items={items}
      recipient={{ name: recipient.name, phoneNumber: recipient.phoneNumber, email: recipient.email }}
      sender={{ name: account.fullName, address: account.fullAddress }}
      signature={{ file: signature, signerName: account.fullName }}
    />
  );
}
