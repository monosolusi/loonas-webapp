"use client";

import { ProductType } from "@/features/product/domain/enums/product-type";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";
import { useRecipeEdit, useVariantRecipeData } from "@/app/(authenticated)/products/[id]/_providers/recipe-edit-provider";
import { RecipeCard } from "@/app/(authenticated)/products/_components/recipe-card";
import { RecipeApplyAllToggle } from "@/app/(authenticated)/products/_components/recipe-apply-all-toggle";
import { RecipeApplyAllDialog } from "@/app/(authenticated)/products/_components/recipe-apply-all-dialog";
import { RecipeVariantRow } from "@/app/(authenticated)/products/_components/recipe-variant-row";
import { RecipeFormDialog, RecipeRow } from "@/app/(authenticated)/products/_components/recipe-form-dialog";

export function ProductDetailRecipeCard() {
  const { product, form } = useProductDetail();

  if (form.type !== ProductType.MANUFACTURED || !product) return null;

  return <ProductDetailRecipeCardInner />;
}

function ProductDetailRecipeCardInner() {
  const { product } = useProductDetail();
  if (!product) return null;

  const recipe = useRecipeEdit(product.id, product.variants);
  const displayVariants = recipe.applyAll ? [product.variants[0]] : product.variants;

  return (
    <>
      <RecipeCard>
        {!recipe.isSingleVariant && (
          <RecipeApplyAllToggle
            applyAll={recipe.applyAll}
            variantNames={recipe.variantNames}
            onToggle={recipe.handleToggleApplyAll}
          />
        )}
        <div className="flex flex-col rounded-lg border border-neutral-100">
          {displayVariants.map((variant, index) => (
            <VariantRowWithData
              key={variant.id}
              productId={product.id}
              variantId={variant.id}
              variantName={recipe.applyAll ? "Semua Varian" : variant.name}
              expanded={recipe.applyAll || recipe.expandedId === variant.id}
              isLast={index === displayVariants.length - 1}
              onToggleExpand={() => recipe.setExpandedId(recipe.expandedId === variant.id ? null : variant.id)}
              onEdit={(items) => recipe.setFormVariant({ variantId: variant.id, variantName: recipe.applyAll ? "Semua Varian" : variant.name, items })}
            />
          ))}
        </div>
      </RecipeCard>

      <RecipeFormDialog
        open={!!recipe.formVariant}
        variant={recipe.formVariant}
        onClose={() => recipe.setFormVariant(null)}
        onSave={recipe.handleRecipeSave}
      />

      <RecipeApplyAllDialog
        open={recipe.applyAllDialogOpen}
        variantNames={recipe.variantNames}
        onClose={() => recipe.setApplyAllDialogOpen(false)}
        onConfirm={recipe.confirmApplyAll}
      />
    </>
  );
}

function VariantRowWithData({
  productId,
  variantId,
  variantName,
  expanded,
  isLast,
  onToggleExpand,
  onEdit,
}: {
  productId: string;
  variantId: string;
  variantName: string;
  expanded: boolean;
  isLast: boolean;
  onToggleExpand: () => void;
  onEdit: (items: RecipeRow[]) => void;
}) {
  const { recipeRows, loading } = useVariantRecipeData(productId, variantId);

  return (
    <RecipeVariantRow
      variantId={variantId}
      variantName={variantName}
      recipeItems={recipeRows}
      loading={loading}
      expanded={expanded}
      isLast={isLast}
      onToggleExpand={onToggleExpand}
      onEdit={() => onEdit(recipeRows)}
    />
  );
}
