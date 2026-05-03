"use client";

import { createContext, useContext, useState } from "react";

type CashContextValue = {
  tenderedAmount: number | null;
  setTenderedAmount: (n: number | null) => void;
};

const CashContext = createContext<CashContextValue | null>(null);

export function useCash(): CashContextValue {
  const ctx = useContext(CashContext);
  if (!ctx) throw new Error("useCash must be used within a CashProvider");
  return ctx;
}

export function CashProvider({ children }: { children: React.ReactNode }) {
  const [tenderedAmount, setTenderedAmount] = useState<number | null>(null);
  return <CashContext.Provider value={{ tenderedAmount, setTenderedAmount }}>{children}</CashContext.Provider>;
}
