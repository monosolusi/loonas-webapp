"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { usePurchaseCreate } from "@/app/(authenticated)/purchasing/create/_providers/purchase-create-provider";

export function PurchaseCreateSaveButton() {
  const router = useRouter();
  const { date, items, isMutating, handleSubmit } = usePurchaseCreate();

  const isValid = useMemo(() => {
    if (!date) return false;
    return items.some((item) => (item.rawMaterialId || item.variantId) && item.quantity && item.unitPrice);
  }, [date, items]);

  const handleClick = async () => {
    const result = await handleSubmit();
    if (result) router.push(`/purchasing/${result.id}`);
  };

  return <PrimaryButton label="Simpan" disabled={!isValid} loading={isMutating} onClick={handleClick} />;
}
