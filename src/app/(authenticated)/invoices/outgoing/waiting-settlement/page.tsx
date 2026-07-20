import { redirect } from "next/navigation";

export default function OutgoingWaitingSettlementPage() {
  redirect("/invoices/outgoing?status=waiting_settlement");
}
