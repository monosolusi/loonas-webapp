import { ProtectedPage } from "@/app/(authentication)/_presentation/_components/protected-page";
import { Header } from "@/app/(home)/home/_components/header";
import { InvoiceSummary } from "@/app/(home)/home/_components/invoice-summary";
import { RecentInvoices } from "@/app/(home)/home/_components/recent-invoices";
import { Clients } from "@/app/(home)/home/_components/clients";


export default function InvoiceHomePage() {
  return (
    <ProtectedPage>
      <Header />
      <main className="bg-white-pure">
        <InvoiceSummary />
        <div className="space-y-16 py-16 xl:space-y-20">
          <RecentInvoices />
          <Clients />
        </div>
      </main>
    </ProtectedPage>
  )
    ;
}