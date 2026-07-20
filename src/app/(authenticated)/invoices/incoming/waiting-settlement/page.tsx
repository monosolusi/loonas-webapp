import { redirect } from "next/navigation";

export default function IncomingWaitingSettlementPage() {
  redirect("/invoices/incoming?status=waiting_settlement");
}
