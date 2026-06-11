"use client";

import { useProductList } from "@/app/(authenticated)/products/_providers/product-list-provider";
import { ProductActivateBlockedDialog } from "@/app/(authenticated)/products/_components/product-activate-blocked-dialog";

export function ProductListBlockedDialog() {
  const { blockedDialogOpen, blockedVariants, setBlockedDialogOpen } = useProductList();

  return (
    <ProductActivateBlockedDialog
      open={blockedDialogOpen}
      missingVariants={blockedVariants}
      onClose={() => setBlockedDialogOpen(false)}
    />
  );
}
