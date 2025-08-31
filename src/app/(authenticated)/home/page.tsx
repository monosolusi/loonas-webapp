import { Clients } from "@/app/(authenticated)/home/_components/clients";
import { RecentInvoices } from "@/app/(authenticated)/home/_components/recent-invoices";
import { QuickAccessApplication } from "@/app/(authenticated)/home/_components/quick-access-application";
import React from "react";

export default function InvoiceHomePage() {
  return (
    <div className="space-y-8 xl:space-y-20">
      <QuickAccessApplication />
      <RecentInvoices />
      <Clients />
    </div>
  );
}
