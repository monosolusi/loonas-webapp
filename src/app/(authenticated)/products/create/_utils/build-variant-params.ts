import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import type { CreateProductParams } from "@/features/product/domain/repositories/product";
import type { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";
import type { RecipeRow } from "@/app/(authenticated)/products/_components/recipe-form-dialog";

// LNS-572: sentinel key for the synthetic row that stands in for the "Harga Jual" input when the
// form is in single-price mode. Never exported and never leaves this module — this module is the
// sole writer (`resolveVariantRows`) and the sole reader (`buildVariantParams`) of the key, so it
// cannot drift from whatever the recipe card renders under. Collision with a real variant row is
// structurally impossible: real rows key on `crypto.randomUUID()`.
const DEFAULT_VARIANT_KEY = "default";

/**
 * The variant row(s) the form currently represents in its current mode — the single source of
 * truth consumed by the recipe card (via `variantRows` on context) and by `buildVariantParams`
 * below when it builds the submit body.
 *
 * LNS-572: single-price mode is not a separate shape, it is exactly one `VariantFormRow` named
 * "Default" — this is the create-page counterpart to `ProductEntity.defaultVariant` on the detail
 * side. Before this fix, `product-create-provider.tsx` and `product-create-recipe-card.tsx` each
 * re-derived their own copy of that single synthetic row: the provider's copy fed the submit body
 * and never read the recipe Map, the card's copy fed the recipe editor and was keyed on the same
 * literal `"default"` by coincidence, not by contract. A merchant could fill in a recipe, watch it
 * render as saved, submit successfully — and the product would be born with no recipe at all. Both
 * call sites now derive their row from this single function, so there is no second copy left to
 * drift.
 */
export function resolveVariantRows(params: {
  hasVariants: boolean;
  variants: VariantFormRow[];
  singlePrice: number;
}): VariantFormRow[] {
  if (params.hasVariants) return params.variants;
  return [{ key: DEFAULT_VARIANT_KEY, name: DEFAULT_VARIANT_NAME, sku: "", price: params.singlePrice }];
}

/**
 * Maps resolved variant rows to the `POST /products` `variants[]` payload shape. A single
 * `rows.map()` with no branch on `hasVariants` — the mode split lives entirely in
 * `resolveVariantRows`, so there is no second path here that can forget to read `recipes`.
 *
 * Deliberate, approved behaviour change on the multi-variant path: previously a row whose recipe
 * entry existed but filtered down to zero items still emitted `recipe: []`. This now omits the key
 * entirely instead. The HTTP body is unaffected either way — the service only attaches `recipe`
 * when `v.recipe && v.recipe.length > 0` — so this is wire-identical, not a behaviour change from
 * the API's perspective.
 */
export function buildVariantParams(params: {
  rows: VariantFormRow[];
  isManufactured: boolean;
  recipes: Map<string, RecipeRow[]>;
}): CreateProductParams["variants"] {
  return params.rows.map((row) => {
    const variant: CreateProductParams["variants"][number] = {
      name: row.name.trim(),
      sku: row.sku.trim() || undefined,
      price: row.price,
    };

    if (params.isManufactured) {
      const recipeItems = (params.recipes.get(row.key) ?? []).filter((r) => r.rawMaterial && r.quantity > 0);
      if (recipeItems.length > 0) {
        variant.recipe = recipeItems.map((r) => ({ rawMaterialId: r.rawMaterial!.id, quantity: r.quantity }));
      }
    }

    return variant;
  });
}
