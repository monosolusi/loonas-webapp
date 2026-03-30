"use client";

import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { RawMaterialUnitLabel, RawMaterialUnitType } from "@/features/raw-material/domain/enums/raw-material-unit";
import { RecipeRow } from "@/app/(authenticated)/products/_components/recipe-form-dialog";

type RecipeVariantRowProps = {
  variantId: string;
  variantName: string;
  hasRecipe: boolean;
  recipeItems: RecipeRow[];
  loading: boolean;
  expanded: boolean;
  isLast?: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
};

export function RecipeVariantRow({
  variantName,
  hasRecipe,
  recipeItems,
  loading,
  expanded,
  isLast,
  onToggleExpand,
  onEdit,
}: RecipeVariantRowProps) {

  return (
    <div className={clsx(!isLast && "border-b border-neutral-100")}>
      <div className="flex flex-row items-center gap-x-3 px-4 py-3">
        <button type="button" onClick={onToggleExpand} className="shrink-0 text-neutral-300">
          <ChevronRightIcon className={clsx("size-4 transition-transform", expanded && "rotate-90")} />
        </button>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-medium text-neutral-500">{variantName}</span>
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
          onClick={onEdit}
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-50 hover:text-neutral-400"
        >
          <Image src="/assets/images/edit-icon-neutral-400-w16-h16.svg" alt="edit" width={16} height={16} />
        </button>
      </div>

      {expanded && hasRecipe && (
        <div className="border-t border-neutral-50 bg-neutral-50/50 px-11 py-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-neutral-300">
                <th className="pb-1 font-medium">Bahan Baku</th>
                <th className="pb-1 font-medium">Jumlah</th>
                <th className="pb-1 font-medium">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {recipeItems.map((item) => (
                <tr key={item.key}>
                  <td className="py-1 text-neutral-400">{item.rawMaterial?.label}</td>
                  <td className="py-1 text-neutral-400">{item.quantity}</td>
                  <td className="py-1 text-neutral-300">
                    {item.rawMaterial
                      ? (RawMaterialUnitLabel[item.rawMaterial.unit as RawMaterialUnitType]?.split(" ")[0]?.toLowerCase() ??
                          item.rawMaterial.unit)
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
