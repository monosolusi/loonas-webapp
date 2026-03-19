"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ProductVariantEntity } from "@/features/product/domain/entities/product-variant";
import { RecipeItemEntity } from "@/features/product/domain/entities/recipe-item";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useGetRecipe } from "@/features/product/presentations/hooks/use-get-recipe";
import { useSaveRecipe } from "@/features/product/presentations/hooks/use-save-recipe";
import { RecipeEditDialog, RecipeRow } from "@/app/(authenticated)/products/_components/recipe-edit-dialog";
import { RawMaterialUnitLabel, RawMaterialUnitType } from "@/features/raw-material/domain/enums/raw-material-unit";

type RecipeCardProps = {
  productId: string;
  variants: ProductVariantEntity[];
};

function recipeItemsToRows(items: RecipeItemEntity[]): RecipeRow[] {
  return items.map((item) => ({
    key: item.id,
    rawMaterial: { id: item.rawMaterial.id, label: item.rawMaterial.name, unit: item.rawMaterial.unit },
    quantity: item.quantity,
  }));
}

function VariantRecipeRow({
  productId,
  variant,
  expanded,
  onToggleExpand,
  onEdit,
  isLast,
}: {
  productId: string;
  variant: ProductVariantEntity;
  expanded: boolean;
  onToggleExpand: () => void;
  onEdit: (items: RecipeRow[]) => void;
  isLast?: boolean;
}) {
  const { recipeItems, loading } = useGetRecipe(productId, variant.id);
  const hasRecipe = recipeItems.length > 0;

  return (
    <div className={clsx(!isLast && "border-b border-neutral-100")}>
      <div className="flex flex-row items-center gap-x-3 px-4 py-3">
        <button type="button" onClick={onToggleExpand} className="shrink-0 text-neutral-300">
          <ChevronRightIcon className={clsx("size-4 transition-transform", expanded && "rotate-90")} />
        </button>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-medium text-neutral-500">{variant.name}</span>
          {loading ? (
            <span className="text-xs text-neutral-200">Memuat...</span>
          ) : hasRecipe ? (
            <span className="text-xs text-neutral-200">{recipeItems.length} bahan</span>
          ) : (
            <span className="text-xs text-warning-300">⚠ Belum ada resep</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onEdit(recipeItemsToRows(recipeItems))}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-50 hover:text-neutral-400"
        >
          <Image src="/assets/images/edit-icon-neutral-400-w16-h16.svg" alt="edit" width={16} height={16} />
        </button>
      </div>

      {expanded && hasRecipe && (
        <div className="border-t border-neutral-50 bg-neutral-50/50 px-11 py-2">
          {recipeItems.map((item) => (
            <div key={item.id} className="py-1 text-sm text-neutral-400">
              {item.rawMaterial.name}{" "}
              <span className="text-neutral-300">
                {item.quantity}{" "}
                {RawMaterialUnitLabel[item.rawMaterial.unit as RawMaterialUnitType]?.split(" ")[0]?.toLowerCase() ??
                  item.rawMaterial.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RecipeCard({ productId, variants }: RecipeCardProps) {
  const { showToast } = useToast();
  const { trigger: saveRecipe } = useSaveRecipe();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingVariant, setEditingVariant] = useState<{ variantId: string; variantName: string; items: RecipeRow[] } | null>(null);
  const [applyAll, setApplyAll] = useState(false);
  const [applyAllDialogOpen, setApplyAllDialogOpen] = useState(false);

  const handleToggleApplyAll = (checked: boolean) => {
    if (checked && variants.length > 1) {
      setApplyAllDialogOpen(true);
    } else {
      setApplyAll(checked);
    }
  };

  const handleRecipeSave = async (items: RecipeRow[]) => {
    if (!editingVariant) return;

    const saveItems = items
      .filter((item) => item.rawMaterial && item.quantity > 0)
      .map((item) => ({ rawMaterialId: item.rawMaterial!.id, quantity: item.quantity }));

    try {
      if (applyAll) {
        await Promise.all(
          variants.map((v) => saveRecipe({ productId, variantId: v.id, items: saveItems })),
        );
      } else {
        await saveRecipe({ productId, variantId: editingVariant.variantId, items: saveItems });
      }
      await revalidateSWRKey(PRODUCT_SWR_KEYS.GET_RECIPE);
      showToast("Resep berhasil disimpan", "success");
    } catch {
      showToast("Gagal menyimpan resep", "error");
    }
  };

  const confirmApplyAll = () => {
    setApplyAll(true);
    setApplyAllDialogOpen(false);
  };

  if (variants.length === 0) return null;

  const isSingleVariant = variants.length === 1 || !variants.some((v) => !v.isDefault);

  return (
    <>
      <SectionCard title="Resep / Bill of Materials" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
        <div className="flex flex-col gap-y-4">
          {/* Apply all toggle — only for multi-variant */}
          {!isSingleVariant && (
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-y-0.5">
                <span className="text-sm font-medium text-neutral-500">Apply untuk semua varian</span>
                {applyAll && (
                  <span className="text-xs text-neutral-200">
                    Resep berlaku untuk: {variants.map((v) => v.name).join(", ")}
                  </span>
                )}
              </div>
              <Switch
                checked={applyAll}
                onChange={handleToggleApplyAll}
                className={clsx(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                  applyAll ? "bg-primary-300" : "bg-neutral-100",
                )}
              >
                <span
                  className={clsx(
                    "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    applyAll ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </Switch>
            </div>
          )}

          {/* Variant rows */}
          <div className="flex flex-col rounded-lg border border-neutral-100">
            {(applyAll ? [variants[0]] : variants).map((variant, index) => (
              <VariantRecipeRow
                key={variant.id}
                productId={productId}
                variant={variant}
                expanded={applyAll || expandedId === variant.id}
                onToggleExpand={() => setExpandedId(expandedId === variant.id ? null : variant.id)}
                onEdit={(items) =>
                  setEditingVariant({
                    variantId: variant.id,
                    variantName: applyAll ? "Semua Varian" : variant.name,
                    items,
                  })
                }
                isLast={applyAll || index === variants.length - 1}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Recipe edit dialog */}
      {editingVariant && (
        <RecipeEditDialog
          open={true}
          onClose={() => setEditingVariant(null)}
          variantName={editingVariant.variantName}
          initialItems={editingVariant.items}
          onSave={handleRecipeSave}
        />
      )}

      {/* Apply all confirmation */}
      <ConfirmationDialog
        open={applyAllDialogOpen}
        onClose={() => setApplyAllDialogOpen(false)}
        title="Apply Resep untuk Semua Varian"
        warning="Resep dari varian pertama akan digunakan untuk semua varian. Resep varian lain akan ditimpa saat disimpan."
        description={
          <p>
            Resep yang disimpan akan diterapkan ke semua varian:{" "}
            <span className="font-semibold">{variants.map((v) => v.name).join(", ")}</span>
          </p>
        }
        confirmLabel="Terapkan"
        onConfirm={confirmApplyAll}
      />
    </>
  );
}
