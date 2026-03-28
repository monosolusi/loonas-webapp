"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useProductCreate } from "@/app/(authenticated)/products/create/_providers/product-create-provider";

export function ProductCreateSaveButton() {
  const { form, isMutating, handleSubmit } = useProductCreate();

  return (
    <PrimaryButton
      label="Simpan Produk"
      disabled={!form.isValid()}
      loading={isMutating}
      onClick={handleSubmit}
      className="w-full"
    />
  );
}
