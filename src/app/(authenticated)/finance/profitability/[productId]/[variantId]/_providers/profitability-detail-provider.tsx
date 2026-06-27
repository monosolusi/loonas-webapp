"use client";

import { createContext, useContext, useMemo } from "react";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { VariantEntity } from "@/features/product/domain/entities/variant";
import { useGetProduct } from "@/features/product/presentations/hooks/use-get-product";
import { ProfitabilityDetailError } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/profitability-detail-error";

type ProfitabilityDetailContextValue = {
  productId: string;
  variantId: string;
  product: ProductEntity;
  variant: VariantEntity | null;
};

const ProfitabilityDetailContext = createContext<ProfitabilityDetailContextValue | null>(null);

export function useProfitabilityDetail() {
  const context = useContext(ProfitabilityDetailContext);
  if (!context) throw new Error("useProfitabilityDetail must be used within ProfitabilityDetailProvider");
  return context;
}

type ProfitabilityDetailProviderProps = {
  productId: string;
  variantId: string;
  loading: React.ReactNode;
  children: React.ReactNode;
};

export function ProfitabilityDetailProvider({ productId, variantId, loading, children }: ProfitabilityDetailProviderProps) {
  const { product, loading: productLoading, error } = useGetProduct(productId);

  const variant = useMemo(() => {
    if (!product) return null;
    return product.variants.find((v) => v.id === variantId) ?? null;
  }, [product, variantId]);

  if (productLoading) return <>{loading}</>;
  if (error) return <ProfitabilityDetailError onRetry={() => window.location.reload()} />;
  if (!product) return <ProfitabilityDetailError onRetry={() => window.location.reload()} />;

  return (
    <ProfitabilityDetailContext.Provider value={{ productId, variantId, product, variant }}>
      {children}
    </ProfitabilityDetailContext.Provider>
  );
}
