import { redirect } from "next/navigation";

export default function IncomingUnpaidPage() {
  redirect("/invoices/incoming?status=unpaid");
}
