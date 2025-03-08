import { ProtectedPage } from "@/app/(authentication)/_presentation/_components/protected-page";

export default function InvoiceHomePage() {
  return (
    <ProtectedPage>
      <h1>Invoices</h1>
    </ProtectedPage>
  );
}