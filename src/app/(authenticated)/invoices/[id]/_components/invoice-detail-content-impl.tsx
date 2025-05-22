import { InvoiceDetailContent } from "@/app/(authenticated)/invoices/[id]/_components/invoice-detail-content";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";

export function InvoiceDetailContentImpl() {

  return <InvoiceDetailContent data={{
    id: uuid(),
    documents: [{
      id: uuid(),
      name: "Nama_Yang_Tidak_Diketahui.pdf",
      invoiceNumber: "INV/2025/05/00001",
      invoiceDate: DateTime.now().minus({ days: 20 }),
      dueDate: DateTime.now().plus({ days: 20 }),
      amount: 100000000,
      note: "Untuk pembayaran yang keren"
    }],
    status: PaymentRequestStatus.COMPLETED,
    paymentDetail: {
      receiverName: "PT. Mono Solusi Indonesia",
      bankName: "PT BANK CENTRAL ASIA",
      accountNumber: "123456789",
      accountHolderName: "John Doe",
      total: 100000000,
      fee: 50000
    }
  }} />;
}
