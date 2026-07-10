import { redirect } from "next/navigation";

export default function IncomingPaidPage() {
  redirect("/invoices/incoming?status=paid");
}
