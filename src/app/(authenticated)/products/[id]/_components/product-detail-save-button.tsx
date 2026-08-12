"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailSaveButton() {
  const { hasChanges, isUpdating, handleSave, form } = useProductDetail();

  return (
    <PrimaryButton
      label="Simpan Perubahan"
      disabled={!hasChanges || !form.isValid()}
      loading={isUpdating}
      onClick={handleSave}
      className="w-full"
    />
  );
}
