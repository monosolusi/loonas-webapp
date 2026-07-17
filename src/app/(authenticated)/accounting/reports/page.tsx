"use client";

// Tab router: owns only in-page activeTab state and mounts the active provider+impl.
// Inactive tabs are unmounted (no background fetching). Each impl renders its own
// ReportsTabStrip via the shell tabStrip prop, passing the shared onTabChange.
// No business logic lives here — this is a composition + routing component.
import { useState } from "react";
import { BalanceSheetProvider } from "@/app/(authenticated)/accounting/reports/_providers/balance-sheet-provider";
import { BalanceSheetImpl } from "@/app/(authenticated)/accounting/reports/_components/balance-sheet-impl";
import { TrialBalanceProvider } from "@/app/(authenticated)/accounting/reports/_providers/trial-balance-provider";
import { TrialBalanceImpl } from "@/app/(authenticated)/accounting/reports/_components/trial-balance-impl";
import { BukuBesarProvider } from "@/app/(authenticated)/accounting/reports/_providers/buku-besar-provider";
import { BukuBesarImpl } from "@/app/(authenticated)/accounting/reports/_components/buku-besar-impl";
import { IncomeStatementProvider } from "@/app/(authenticated)/accounting/reports/_providers/income-statement-provider";
import { IncomeStatementImpl } from "@/app/(authenticated)/accounting/reports/_components/income-statement-impl";
import { CashFlowProvider } from "@/app/(authenticated)/accounting/reports/_providers/cash-flow-provider";
import { CashFlowImpl } from "@/app/(authenticated)/accounting/reports/_components/cash-flow-impl";
import { NotesProvider } from "@/app/(authenticated)/accounting/reports/_providers/notes-provider";
import { NotesImpl } from "@/app/(authenticated)/accounting/reports/_components/notes-impl";

type ActiveTab = "balance-sheet" | "trial-balance" | "buku-besar" | "income-statement" | "cash-flow" | "notes";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("balance-sheet");

  const handleTabChange = (id: string) => {
    if (
      id === "balance-sheet" ||
      id === "trial-balance" ||
      id === "buku-besar" ||
      id === "income-statement" ||
      id === "cash-flow" ||
      id === "notes"
    ) {
      setActiveTab(id);
    }
  };

  return (
    <>
      {activeTab === "balance-sheet" && (
        <BalanceSheetProvider>
          <BalanceSheetImpl onTabChange={handleTabChange} />
        </BalanceSheetProvider>
      )}
      {activeTab === "trial-balance" && (
        <TrialBalanceProvider>
          <TrialBalanceImpl onTabChange={handleTabChange} />
        </TrialBalanceProvider>
      )}
      {activeTab === "buku-besar" && (
        <BukuBesarProvider>
          <BukuBesarImpl onTabChange={handleTabChange} />
        </BukuBesarProvider>
      )}
      {activeTab === "income-statement" && (
        <IncomeStatementProvider>
          <IncomeStatementImpl onTabChange={handleTabChange} />
        </IncomeStatementProvider>
      )}
      {activeTab === "cash-flow" && (
        <CashFlowProvider>
          <CashFlowImpl onTabChange={handleTabChange} />
        </CashFlowProvider>
      )}
      {activeTab === "notes" && (
        <NotesProvider>
          <NotesImpl onTabChange={handleTabChange} />
        </NotesProvider>
      )}
    </>
  );
}
