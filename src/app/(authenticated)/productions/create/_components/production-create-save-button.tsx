"use client";

import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useProductionCreate } from "@/app/(authenticated)/productions/create/_providers/production-create-provider";

export function ProductionCreateSaveButton() {
  const router = useRouter();
  const { product, variantId, quantity, date, preview, isMutating, handleSubmit } = useProductionCreate();

  const isValid = !!product && !!variantId && quantity > 0 && !!date;
  const canProduce = preview?.canProduce !== false;

  const handleClick = async () => {
    const result = await handleSubmit();
    if (result) router.push(`/productions/${result.id}`);
  };

  return (
    <PrimaryButton
      label="Simpan"
      disabled={!isValid || !canProduce}
      loading={isMutating}
      onClick={handleClick}
    />
  );
}
