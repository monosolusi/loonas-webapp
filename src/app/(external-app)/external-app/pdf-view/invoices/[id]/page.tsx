import { notFound } from "next/navigation";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import {
  GetPublicOutgoingInvoiceUseCase,
  GetPublicOutgoingInvoiceUseCaseParams,
} from "@/features/invoice/domain/usecases/get-public-outgoing-invoice";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { DataFailed } from "@/core/resources/data-state";
import { InvoicePreview } from "@/app/(authenticated)/invoices/_components/invoice-preview";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const http = new HttpRequest();
  const invoiceService = new InvoiceServiceImpl(http);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const useCase = new GetPublicOutgoingInvoiceUseCase(invoiceRepository);

  const result = await useCase.execute(new GetPublicOutgoingInvoiceUseCaseParams({ invoiceId: id }));
  if (result instanceof DataFailed || !result.data) return notFound();

  const invoice = result.data;

  return (
    <InvoicePreview
      forceDesktop
      invoice={{
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        note: invoice.note,
        tnc: invoice.tnc,
      }}
      items={invoice.items.map((item) => ({
        name: item.name,
        description: item.description,
        qty: item.qty,
        price: item.price,
        taxType: item.taxType,
        tax: item.tax,
        taxBase: item.taxBase,
        total: item.total,
        discountType: item.discountType,
        discount: item.discount,
      }))}
      recipient={{
        name: invoice.recipient.name,
        email: invoice.recipient.email,
        phoneNumber: invoice.recipient.phoneNumber,
      }}
      sender={{
        name: invoice.sender.name,
        address: invoice.sender.address,
      }}
      signature={{
        signerName: invoice.signature.signerName,
        url: invoice.signature.url,
      }}
    />
  );
}
