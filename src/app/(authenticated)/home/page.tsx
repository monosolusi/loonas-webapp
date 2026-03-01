import { DashboardStatistics } from "@/app/(authenticated)/home/_components/dashboard-statistics";
import { DashboardRecentInvoices } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices";
import { DashboardAttentionItems } from "@/app/(authenticated)/home/_components/dashboard-attention-items";
import { DashboardCashflowSummary } from "@/app/(authenticated)/home/_components/dashboard-cashflow-summary";
import { DashboardWelcomeHeader } from "@/app/(authenticated)/home/_components/dashboard-welcome-header";
import React from "react";

export default function InvoiceHomePage() {
  return (
    <div className="space-y-6">
      <DashboardWelcomeHeader />
      <DashboardStatistics />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <DashboardRecentInvoices />
        </div>
        <div className="space-y-4 xl:col-span-2">
          <DashboardAttentionItems />
          <DashboardCashflowSummary />
        </div>
      </div>
    </div>
  );
}
