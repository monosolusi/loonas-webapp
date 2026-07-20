import { redirect } from "next/navigation";

export default function OutgoingPaidPage() {
  redirect("/invoices/outgoing?status=paid");
}
