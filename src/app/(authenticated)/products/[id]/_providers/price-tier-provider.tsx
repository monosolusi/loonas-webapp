"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { VariantEntity } from "@/features/product/domain/entities/variant";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export type PriceTierEditorTarget = {
  variantId: string;
  variantName: string;
  basePrice: number;
};

type PriceTierContextValue = {
  productId: string;
  /** Only variants whose schedule was actually hydrated. */
  hydratedVariants: VariantEntity[];
  canCopyToAll: boolean;
  expandedVariantId: string | null;
  setExpandedVariantId: (id: string | null) => void;
  editorTarget: PriceTierEditorTarget | null;
  openEditor: (target: PriceTierEditorTarget) => void;
  closeEditor: () => void;
  copyOpen: boolean;
  openCopy: () => void;
  closeCopy: () => void;
};

const PriceTierContext = createContext<PriceTierContextValue | null>(null);

export function usePriceTier() {
  const context = useContext(PriceTierContext);
  if (!context) throw new Error("usePriceTier must be used within PriceTierProvider");
  return context;
}

type PriceTierProviderProps = {
  children: React.ReactNode;
};

/**
 * Holds only what the card, the editor dialog and the copy dialog all need — which
 * dialog is open and for which variant. Row state, tier mode and the mutations live
 * inside each dialog, because each is used by exactly one component.
 */
export function PriceTierProvider({ children }: PriceTierProviderProps) {
  const { id, product } = useProductDetail();

  const [expandedVariantId, setExpandedVariantId] = useState<string | null>(null);
  const [editorTarget, setEditorTarget] = useState<PriceTierEditorTarget | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);

  const hydratedVariants = useMemo(
    () => (product?.variants ?? []).filter((variant) => variant.priceTierSchedule !== null),
    [product],
  );

  const value: PriceTierContextValue = {
    productId: id,
    hydratedVariants,
    canCopyToAll: hydratedVariants.length > 1,
    expandedVariantId,
    setExpandedVariantId,
    editorTarget,
    openEditor: setEditorTarget,
    closeEditor: () => setEditorTarget(null),
    copyOpen,
    openCopy: () => setCopyOpen(true),
    closeCopy: () => setCopyOpen(false),
  };

  return <PriceTierContext.Provider value={value}>{children}</PriceTierContext.Provider>;
}
