"use client";

import { createContext, useContext, useState } from "react";
import { DateTime } from "luxon";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { ProductionPreviewEntity } from "@/features/production/domain/entities/production-preview";
import { useCreateProductionRecord } from "@/features/production/presentations/hooks/use-create-production-record";
import { usePreviewProduction } from "@/features/production/presentations/hooks/use-preview-production";
import { PRODUCTION_SWR_KEYS } from "@/features/production/presentations/constants/swr-keys";
import { ManufacturedProductOption } from "@/app/(authenticated)/productions/create/_components/manufactured-product-combobox";

type ProductionCreateContextValue = {
  product: ManufacturedProductOption | null;
  variantId: string | null;
  quantity: number;
  date: DateTime | undefined;
  note: string;
  preview: ProductionPreviewEntity | null;
  previewLoading: boolean;
  isMutating: boolean;
  setProduct: (value: ManufacturedProductOption | null) => void;
  setVariantId: (value: string | null) => void;
  setQuantity: (value: number) => void;
  setDate: (value: DateTime | undefined) => void;
  setNote: (value: string) => void;
  handleSubmit: () => Promise<ProductionRecordEntity | null>;
};

const ProductionCreateContext = createContext<ProductionCreateContextValue | null>(null);

export function useProductionCreate() {
  const context = useContext(ProductionCreateContext);
  if (!context) throw new Error("useProductionCreate must be used within ProductionCreateProvider");
  return context;
}

type ProductionCreateProviderProps = {
  children: React.ReactNode;
};

export function ProductionCreateProvider({ children }: ProductionCreateProviderProps) {
  const { showToast } = useToast();
  const { trigger: createRecord, isMutating } = useCreateProductionRecord();

  const [product, setProduct] = useState<ManufacturedProductOption | null>(null);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [date, setDate] = useState<DateTime | undefined>(DateTime.now());
  const [note, setNote] = useState("");

  const debouncedQuantity = useDebounce(quantity, 500);

  const { preview, loading: previewLoading } = usePreviewProduction({
    productId: product?.productId ?? null,
    variantId,
    quantity: debouncedQuantity,
  });

  const handleSubmit = async (): Promise<ProductionRecordEntity | null> => {
    if (!product || !variantId || !quantity || !date || isMutating) return null;

    try {
      const result = await createRecord({
        productId: product.productId,
        variantId,
        quantity,
        producedAt: date.toISODate() ?? undefined,
        note: note.trim() || undefined,
      });
      await revalidateSWRKey(PRODUCTION_SWR_KEYS.LIST_PRODUCTION_RECORDS);
      showToast("Produksi berhasil dicatat");
      return result;
    } catch {
      showToast("Gagal mencatat produksi", "error");
      return null;
    }
  };

  return (
    <ProductionCreateContext.Provider
      value={{
        product,
        variantId,
        quantity,
        date,
        note,
        preview,
        previewLoading,
        isMutating,
        setProduct,
        setVariantId,
        setQuantity,
        setDate,
        setNote,
        handleSubmit,
      }}
    >
      {children}
    </ProductionCreateContext.Provider>
  );
}
