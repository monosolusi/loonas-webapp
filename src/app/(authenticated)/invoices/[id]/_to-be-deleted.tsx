// import React from "react";
// import { PageContent } from "@/core/presentations/components/page-content";
// import { InvoiceDetailContentImpl } from "@/app/(authenticated)/invoices/[id]/_components/invoice-detail-content-impl";
// import { GetInvoiceProvider } from "@/features/invoice/presentations/providers/get-invoice";
// import { PageHeadingImpl } from "@/app/(authenticated)/invoices/[id]/_components/page-heading-impl";
//
// export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//
//   return (
//     <GetInvoiceProvider id={id} includes="documents">
//       <PageHeadingImpl />
//       <PageContent>
//         <InvoiceDetailContentImpl />
//       </PageContent>
//     </GetInvoiceProvider>
//   );
// }

export default function InvoiceDetailPage() {
  return null;
}
