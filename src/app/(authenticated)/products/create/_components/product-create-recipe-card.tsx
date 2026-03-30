"use client";

import { useState } from "react";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { useProductCreate } from "@/app/(authenticated)/products/create/_providers/product-create-provider";
import { RecipeCard } from "@/app/(authenticated)/products/_components/recipe-card";
import { RecipeApplyAllToggle } from "@/app/(authenticated)/products/_components/recipe-apply-all-toggle";
import { RecipeApplyAllDialog } from "@/app/(authenticated)/products/_components/recipe-apply-all-dialog";
import { RecipeVariantRow } from "@/app/(authenticated)/products/_components/recipe-variant-row";
import { RecipeFormDialog, RecipeFormVariant, RecipeRow } from "@/app/(authenticated)/products/_components/recipe-form-dialog";

export function ProductCreateRecipeCard() {
  const { form, getVariantRecipe, setVariantRecipe } = useProductCreate();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formVariant, setRecipeFormVariant] = useState<RecipeFormVariant | null>(null);
  const [applyAll, setApplyAll] = useState(false);
  const [applyAllDialogOpen, setApplyAllDialogOpen] = useState(false);

  if (form.type !== ProductType.MANUFACTURED) return null;

  const variants = form.hasVariants ? form.variants : [{ key: "default", name: "Default", sku: "", price: form.singlePrice }];
  const isSingleVariant = variants.length <= 1;
  const variantNames = variants.map((v) => v.name);
  const displayVariants = applyAll ? [variants[0]] : variants;

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

    if (applyAll) {
      for (const v of variants) {
        setVariantRecipe(v.key, items);
      }
    } else {
      setVariantRecipe(formVariant.variantId, items);
    }
  };

  return (
    <>
      <RecipeCard>
        {!isSingleVariant && (
          <RecipeApplyAllToggle applyAll={applyAll} variantNames={variantNames} onToggle={handleToggleApplyAll} />
        )}
        <div className="flex flex-col rounded-lg border border-neutral-100">
          {displayVariants.map((variant, index) => (
            <RecipeVariantRow
              key={variant.key}
              variantId={variant.key}
              variantName={applyAll ? "Semua Varian" : variant.name}
              hasRecipe={getVariantRecipe(variant.key).length > 0}
              recipeItems={getVariantRecipe(variant.key)}
              loading={false}
              expanded={applyAll || expandedId === variant.key}
              isLast={index === displayVariants.length - 1}
              onToggleExpand={() => setExpandedId(expandedId === variant.key ? null : variant.key)}
              onEdit={() =>
                setRecipeFormVariant({
                  variantId: variant.key,
                  variantName: applyAll ? "Semua Varian" : variant.name,
                  items: getVariantRecipe(variant.key),
                })
              }
            />
          ))}
        </div>
      </RecipeCard>

      <RecipeFormDialog
        open={!!formVariant}
        variant={formVariant}
        onClose={() => setRecipeFormVariant(null)}
        onSave={handleRecipeSave}
      />

      <RecipeApplyAllDialog
        open={applyAllDialogOpen}
        variantNames={variantNames}
        onClose={() => setApplyAllDialogOpen(false)}
        onConfirm={confirmApplyAll}
      />
    </>
  );
}
