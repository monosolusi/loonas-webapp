"use client";

import { createContext, useContext, useState } from "react";
import { DateTime } from "luxon";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";
import { useCreatePurchase } from "@/features/purchasing/presentations/hooks/use-create-purchase";
import { PURCHASE_SWR_KEYS } from "@/features/purchasing/presentations/constants/swr-keys";

export type PurchaseFormItem = {
  key: string;
  rawMaterialId: string | null;
  variantId: string | null;
  label: string;
  unit: string | null;
  quantity: string;
  unitPrice: string;
};

type PurchaseCreateContextValue = {
  date: DateTime | undefined;
  note: string;
  items: PurchaseFormItem[];
  isMutating: boolean;
  setDate: (value: DateTime | undefined) => void;
  setNote: (value: string) => void;
  addItem: () => void;
  removeItem: (key: string) => void;
  updateItem: (key: string, updates: Partial<PurchaseFormItem>) => void;
  handleSubmit: () => Promise<PurchaseEntity | null>;
};

const PurchaseCreateContext = createContext<PurchaseCreateContextValue | null>(null);

export function usePurchaseCreate() {
  const context = useContext(PurchaseCreateContext);
  if (!context) throw new Error("usePurchaseCreate must be used within PurchaseCreateProvider");
  return context;
}

type PurchaseCreateProviderProps = {
  children: React.ReactNode;
};

function createEmptyItem(): PurchaseFormItem {
  return {
    key: crypto.randomUUID(),
    rawMaterialId: null,
    variantId: null,
    label: "",
    unit: null,
    quantity: "",
    unitPrice: "",
  };
}

export function PurchaseCreateProvider({ children }: PurchaseCreateProviderProps) {
  const { showToast } = useToast();
  const { trigger: createPurchase, isMutating } = useCreatePurchase();

  const [date, setDate] = useState<DateTime | undefined>(DateTime.now());
  const [note, setNote] = useState("");
  const [items, setItems] = useState<PurchaseFormItem[]>([createEmptyItem()]);

  const addItem = () => setItems((prev) => [...prev, createEmptyItem()]);

  const removeItem = (key: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.key !== key);
      return filtered.length === 0 ? [createEmptyItem()] : filtered;
    });
  };

  const updateItem = (key: string, updates: Partial<PurchaseFormItem>) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...updates } : item)));
  };

  const handleSubmit = async (): Promise<PurchaseEntity | null> => {
    if (!date || isMutating) return null;

    const validItems = items.filter((item) => (item.rawMaterialId || item.variantId) && item.quantity && item.unitPrice);
    if (validItems.length === 0) return null;

    try {
      const result = await createPurchase({
        date: date.toISODate()!,
        note: note.trim() || undefined,
        items: validItems.map((item) => ({
          rawMaterialId: item.rawMaterialId ?? undefined,
          variantId: item.variantId ?? undefined,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      });
      await revalidateSWRKey(PURCHASE_SWR_KEYS.LIST_PURCHASES);
      showToast("Pembelian berhasil dicatat");
      return result;
    } catch {
      showToast("Gagal mencatat pembelian", "error");
      return null;
    }
  };

  return (
    <PurchaseCreateContext.Provider
      value={{ date, note, items, isMutating, setDate, setNote, addItem, removeItem, updateItem, handleSubmit }}
    >
      {children}
    </PurchaseCreateContext.Provider>
  );
}
