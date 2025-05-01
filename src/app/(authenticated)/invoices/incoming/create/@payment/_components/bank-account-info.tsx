import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { DetailLineItem } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/detail-line-item";

export function BankAccountInfo() {
  const { bankAccount } = useCreateIncomingInvoice();

  if (!bankAccount) return;
  return (
    <>
      <DetailLineItem title="Bank Tujuan" description={bankAccount.bankName} />
      <DetailLineItem title="Nomor Rekening" description={bankAccount.accountNumber} />
      <DetailLineItem title="Nama Pemilik Rekening" description={bankAccount.accountHolderName} />
    </>
  );
}