import { notFound } from "next/navigation";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import {
  GetPublicIncomingInvoiceUseCase,
  GetPublicIncomingInvoiceUseCaseParams,
} from "@/features/invoice/domain/usecases/get-public-incoming-invoice";
import { DataFailed } from "@/core/resources/data-state";
import { PaymentReceiptPreview } from "@/app/(external-app)/external-app/pdf-view/invoices/[id]/receipt/_components/payment-receipt-preview";

export default async function PaymentReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const useCase = new GetPublicIncomingInvoiceUseCase(invoiceRepository);

  const result = await useCase.execute(new GetPublicIncomingInvoiceUseCaseParams({ invoiceId: id }));
  if (result instanceof DataFailed || !result.data) return notFound();

  const invoice = result.data;

  return (
    <PaymentReceiptPreview
      id={invoice.id}
      payer={invoice.payer}
      supplier={invoice.supplier}
      supplierBank={invoice.supplierBank}
      netAmount={invoice.netAmount}
      paidAt={invoice.paidAt}
      documents={invoice.documents.map((doc) => ({
        invoiceNumber: doc.invoiceNumber,
        invoiceDate: doc.invoiceDate,
        dueDate: doc.dueDate,
        amount: doc.amount,
      }))}
    />
  );
}
