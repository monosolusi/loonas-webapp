import { redirect } from "next/navigation";

export default function OutgoingUnpaidPage() {
  redirect("/invoices/outgoing?status=unpaid");
}
