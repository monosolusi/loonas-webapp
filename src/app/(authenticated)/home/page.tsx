import { InvoiceSummary } from "@/app/(authenticated)/home/_components/invoice-summary";
import { Clients } from "@/app/(authenticated)/home/_components/clients";
import { RecentInvoices } from "@/app/(authenticated)/home/_components/recent-invoices";


export default function InvoiceHomePage() {
  return (
    <>
      <InvoiceSummary />
      <div className="space-y-16 py-16 xl:space-y-20">
        <RecentInvoices />
        <Clients />
      </div>
    </>
  );
}
