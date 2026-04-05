"use client";

import { createContext, useContext } from "react";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { useGetRawMaterial } from "@/features/raw-material/presentations/hooks/use-get-raw-material";

type RawMaterialDetailContextValue = {
  rawMaterial: RawMaterialEntity;
};

const RawMaterialDetailContext = createContext<RawMaterialDetailContextValue | null>(null);

export function useRawMaterialDetail() {
  const context = useContext(RawMaterialDetailContext);
  if (!context) throw new Error("useRawMaterialDetail must be used within RawMaterialDetailProvider");
  return context;
}

type RawMaterialDetailProviderProps = {
  id: string;
  loading: React.ReactNode;
  children: React.ReactNode;
};

export function RawMaterialDetailProvider({ id, loading: loadingIndicator, children }: RawMaterialDetailProviderProps) {
  const { rawMaterial, loading } = useGetRawMaterial(id);

  if (loading || !rawMaterial) return <>{loadingIndicator}</>;

  return (
    <RawMaterialDetailContext.Provider value={{ rawMaterial }}>
      {children}
    </RawMaterialDetailContext.Provider>
  );
}
