"use client";

import { useState } from "react";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductStatusCard } from "@/app/(authenticated)/products/_components/product-status-card";
import { ProductActivateBlockedDialog } from "@/app/(authenticated)/products/_components/product-activate-blocked-dialog";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailStatusCard() {
  const { product, form } = useProductDetail();
  const [blockedDialogOpen, setBlockedDialogOpen] = useState(false);

  const isManufactured = form.type === ProductType.MANUFACTURED;
  const recipeComplete = product?.metadata?.recipeComplete ?? true;

  const missingRecipeVariants =
    product?.variants.filter((v) => v.metadata?.hasRecipe === false).map((v) => v.name) ?? [];

  const handleActiveChange = (active: boolean) => {
    if (active && isManufactured && !recipeComplete) {
      setBlockedDialogOpen(true);
      return;
    }
    form.setActive(active);
  };

  return (
    <>
      <ProductStatusCard active={form.active} onActiveChange={handleActiveChange} />
      <ProductActivateBlockedDialog
        open={blockedDialogOpen}
        missingVariants={missingRecipeVariants}
        onClose={() => setBlockedDialogOpen(false)}
      />
    </>
  );
}
