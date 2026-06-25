"use client";

// Tab router: owns only in-page activeTab state and mounts the active provider+impl.
// Inactive tabs are unmounted (no background fetching). Each impl renders its own
// ReportsTabStrip via the shell tabStrip prop, passing the shared onTabChange.
// No business logic lives here — this is a composition + routing component.
import { useState } from "react";
import { NeracaProvider } from "@/app/(authenticated)/finance/reports/_providers/neraca-provider";
import { NeracaImpl } from "@/app/(authenticated)/finance/reports/_components/neraca-impl";
import { TrialBalanceProvider } from "@/app/(authenticated)/finance/reports/_providers/trial-balance-provider";
import { TrialBalanceImpl } from "@/app/(authenticated)/finance/reports/_components/trial-balance-impl";
import { BukuBesarProvider } from "@/app/(authenticated)/finance/reports/_providers/buku-besar-provider";
import { BukuBesarImpl } from "@/app/(authenticated)/finance/reports/_components/buku-besar-impl";
import { LabaRugiProvider } from "@/app/(authenticated)/finance/reports/_providers/laba-rugi-provider";
import { LabaRugiImpl } from "@/app/(authenticated)/finance/reports/_components/laba-rugi-impl";
import { ArusKasProvider } from "@/app/(authenticated)/finance/reports/_providers/arus-kas-provider";
import { ArusKasImpl } from "@/app/(authenticated)/finance/reports/_components/arus-kas-impl";
import { CalkProvider } from "@/app/(authenticated)/finance/reports/_providers/calk-provider";
import { CalkImpl } from "@/app/(authenticated)/finance/reports/_components/calk-impl";

type ActiveTab = "neraca" | "trial-balance" | "buku-besar" | "laba-rugi" | "arus-kas" | "calk";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("neraca");

  const handleTabChange = (id: string) => {
    if (id === "neraca" || id === "trial-balance" || id === "buku-besar" || id === "laba-rugi" || id === "arus-kas" || id === "calk") {
      setActiveTab(id);
    }
  };

  return (
    <>
      {activeTab === "neraca" && (
        <NeracaProvider>
          <NeracaImpl onTabChange={handleTabChange} />
        </NeracaProvider>
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
      {activeTab === "laba-rugi" && (
        <LabaRugiProvider>
          <LabaRugiImpl onTabChange={handleTabChange} />
        </LabaRugiProvider>
      )}
      {activeTab === "arus-kas" && (
        <ArusKasProvider>
          <ArusKasImpl onTabChange={handleTabChange} />
        </ArusKasProvider>
      )}
      {activeTab === "calk" && (
        <CalkProvider>
          <CalkImpl onTabChange={handleTabChange} />
        </CalkProvider>
      )}
    </>
  );
}
