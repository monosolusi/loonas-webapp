"use client";

import { useState } from "react";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ProductVariantEntity } from "@/features/product/domain/entities/product-variant";
import { RecipeItemEntity } from "@/features/product/domain/entities/recipe-item";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useGetRecipe } from "@/features/product/presentations/hooks/use-get-recipe";
import { useSaveRecipe } from "@/features/product/presentations/hooks/use-save-recipe";
import { RecipeRow, RecipeFormVariant } from "@/app/(authenticated)/products/_components/recipe-form-dialog";
import { RawMaterialOption } from "@/app/(authenticated)/products/_components/raw-material-combobox";

function recipeItemsToRows(items: RecipeItemEntity[]): RecipeRow[] {
  return items.map((item) => ({
    key: item.id,
    rawMaterial: { id: item.rawMaterial.id, label: item.rawMaterial.name, unit: item.rawMaterial.unit } as RawMaterialOption,
    quantity: item.quantity,
  }));
}

export function useRecipeEdit(productId: string, variants: ProductVariantEntity[]) {
  const { showToast } = useToast();
  const { trigger: saveRecipe } = useSaveRecipe();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formVariant, setFormVariant] = useState<RecipeFormVariant | null>(null);
  const [applyAll, setApplyAll] = useState(false);
  const [applyAllDialogOpen, setApplyAllDialogOpen] = useState(false);

  const isSingleVariant = variants.length === 1 || !variants.some((v) => !v.isDefault);
  const variantNames = variants.map((v) => v.name);

  const handleToggleApplyAll = (checked: boolean) => {
    if (checked && variants.length > 1) {
      setApplyAllDialogOpen(true);
    } else {
      setApplyAll(checked);
    }
  };

  const confirmApplyAll = () => {
    setApplyAll(true);
    setApplyAllDialogOpen(false);
  };

  const handleRecipeSave = async (items: RecipeRow[]) => {
    if (!formVariant) return;

    const saveItems = items
      .filter((item) => item.rawMaterial && item.quantity > 0)
      .map((item) => ({ rawMaterialId: item.rawMaterial!.id, quantity: item.quantity }));

    try {
      if (applyAll) {
        await Promise.all(variants.map((v) => saveRecipe({ productId, variantId: v.id, items: saveItems })));
      } else {
        await saveRecipe({ productId, variantId: formVariant.variantId, items: saveItems });
      }
      await revalidateSWRKey(PRODUCT_SWR_KEYS.GET_RECIPE);
      showToast("Resep berhasil disimpan", "success");
    } catch {
      showToast("Gagal menyimpan resep", "error");
    }
  };

  return {
    expandedId,
    setExpandedId,
    formVariant,
    setFormVariant,
    applyAll,
    applyAllDialogOpen,
    setApplyAllDialogOpen,
    isSingleVariant,
    variantNames,
    handleToggleApplyAll,
    confirmApplyAll,
    handleRecipeSave,
    recipeItemsToRows,
  };
}

export function useVariantRecipeData(productId: string, variantId: string) {
  const { recipeItems, loading } = useGetRecipe(productId, variantId);
  return { recipeItems, recipeRows: recipeItemsToRows(recipeItems), loading };
}
