import { describe, expect, it } from "vitest";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import type { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";
import type { RecipeRow } from "@/app/(authenticated)/products/_components/recipe-form-dialog";
import type { RawMaterialOption } from "@/app/(authenticated)/products/_components/raw-material-combobox";
import { buildVariantParams, resolveVariantRows } from "@/app/(authenticated)/products/create/_utils/build-variant-params";

function row(key: string, args: { name?: string; sku?: string; price?: number } = {}): VariantFormRow {
  return { key, name: args.name ?? "", sku: args.sku ?? "", price: args.price ?? 0 };
}

function rawMaterial(id: string, args: { label?: string; unit?: string } = {}): RawMaterialOption {
  return { id, label: args.label ?? "Bahan", unit: args.unit ?? "gram" };
}

function recipeRow(args: { rawMaterial?: RawMaterialOption | null; quantity?: number } = {}): RecipeRow {
  return {
    key: crypto.randomUUID(),
    rawMaterial: args.rawMaterial === undefined ? rawMaterial("rm-1") : args.rawMaterial,
    quantity: args.quantity ?? 1,
  };
}

describe("resolveVariantRows — mode split", () => {
  it("yields one Default-named row carrying the current singlePrice in single-price mode", () => {
    const rows = resolveVariantRows({ hasVariants: false, variants: [], singlePrice: 80_000 });

    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe(DEFAULT_VARIANT_NAME);
    expect(rows[0].sku).toBe("");
    expect(rows[0].price).toBe(80_000);
  });

  it("returns the form rows untouched in multi-variant mode", () => {
    const variants = [row("v-1", { name: "Kecil", price: 60_000 }), row("v-2", { name: "Besar", price: 90_000 })];

    const rows = resolveVariantRows({ hasVariants: true, variants, singlePrice: 999_999 });

    // Ignores singlePrice entirely — the multi-variant path carries its own per-row prices.
    expect(rows).toBe(variants);
  });
});

describe("buildVariantParams — single-price mode, MANUFACTURED", () => {
  it("attaches the entered recipe (regression: previously discarded entirely — LNS-572)", () => {
    const rows = resolveVariantRows({ hasVariants: false, variants: [], singlePrice: 50_000 });
    const recipes = new Map<string, RecipeRow[]>([
      [rows[0].key, [recipeRow({ rawMaterial: rawMaterial("rm-1"), quantity: 2 })]],
    ]);

    const params = buildVariantParams({ rows, isManufactured: true, recipes });

    expect(params[0].recipe).toEqual([{ rawMaterialId: "rm-1", quantity: 2 }]);
  });

  it("drops rows with no raw material and rows with quantity <= 0", () => {
    const rows = resolveVariantRows({ hasVariants: false, variants: [], singlePrice: 50_000 });
    const recipes = new Map<string, RecipeRow[]>([
      [
        rows[0].key,
        [
          recipeRow({ rawMaterial: rawMaterial("rm-1"), quantity: 2 }),
          recipeRow({ rawMaterial: null, quantity: 3 }),
          recipeRow({ rawMaterial: rawMaterial("rm-2"), quantity: 0 }),
        ],
      ],
    ]);

    const params = buildVariantParams({ rows, isManufactured: true, recipes });

    expect(params[0].recipe).toEqual([{ rawMaterialId: "rm-1", quantity: 2 }]);
  });

  it("emits no recipe key when the recipe filters down to empty", () => {
    const rows = resolveVariantRows({ hasVariants: false, variants: [], singlePrice: 50_000 });
    const recipes = new Map<string, RecipeRow[]>([[rows[0].key, [recipeRow({ rawMaterial: null })]]]);

    const params = buildVariantParams({ rows, isManufactured: true, recipes });

    // toEqual cannot distinguish "absent" from "present but undefined" — assert against the
    // serialized payload instead (precedent: sync-variants.test.ts:154-159).
    expect(params[0].recipe).toBeUndefined();
    expect(JSON.stringify(params[0])).not.toContain("recipe");
  });

  it("emits no sku key for the single-price row", () => {
    const rows = resolveVariantRows({ hasVariants: false, variants: [], singlePrice: 50_000 });

    const params = buildVariantParams({ rows, isManufactured: true, recipes: new Map() });

    expect(params[0].sku).toBeUndefined();
    expect(JSON.stringify(params[0])).not.toContain("sku");
  });
});

describe("buildVariantParams — non-MANUFACTURED", () => {
  it("never attaches a recipe, even when the Map holds an entry under the default key", () => {
    const rows = resolveVariantRows({ hasVariants: false, variants: [], singlePrice: 50_000 });
    const recipes = new Map<string, RecipeRow[]>([[rows[0].key, [recipeRow({ quantity: 5 })]]]);

    const params = buildVariantParams({ rows, isManufactured: false, recipes });

    expect(params[0].recipe).toBeUndefined();
    expect(JSON.stringify(params[0])).not.toContain("recipe");
  });
});

describe("buildVariantParams — multi-variant mode", () => {
  it("gives each row its own recipe keyed by its own key (path unchanged)", () => {
    const rows = [row("v-1", { name: "Kecil", price: 60_000 }), row("v-2", { name: "Besar", price: 90_000 })];
    const recipes = new Map<string, RecipeRow[]>([
      ["v-1", [recipeRow({ rawMaterial: rawMaterial("rm-1"), quantity: 1 })]],
      ["v-2", [recipeRow({ rawMaterial: rawMaterial("rm-2"), quantity: 3 })]],
    ]);

    const params = buildVariantParams({ rows, isManufactured: true, recipes });

    expect(params[0].recipe).toEqual([{ rawMaterialId: "rm-1", quantity: 1 }]);
    expect(params[1].recipe).toEqual([{ rawMaterialId: "rm-2", quantity: 3 }]);
  });

  it("omits the recipe key when every recipe row filters out (deliberate change from emitting recipe: [])", () => {
    const rows = [row("v-1", { name: "Kecil", price: 60_000 })];
    const recipes = new Map<string, RecipeRow[]>([["v-1", [recipeRow({ rawMaterial: null })]]]);

    const params = buildVariantParams({ rows, isManufactured: true, recipes });

    expect(params[0].recipe).toBeUndefined();
    expect(JSON.stringify(params[0])).not.toContain("recipe");
  });
});

describe("buildVariantParams — structural guard against LNS-572 regressing", () => {
  it("attaches a recipe written under the key resolveVariantRows hands out, without a second copy of that key anywhere", () => {
    // Simulates exactly what the recipe card does: read the row key resolveVariantRows produced,
    // and write the recipe into the Map under that same key. If this test passes only by
    // coincidence (e.g. two independently hardcoded "default" literals), a rename of the
    // sentinel in one file and not the other would silently reopen LNS-572.
    const rows = resolveVariantRows({ hasVariants: false, variants: [], singlePrice: 45_000 });
    const recipes = new Map<string, RecipeRow[]>([
      [rows[0].key, [recipeRow({ rawMaterial: rawMaterial("rm-9"), quantity: 7 })]],
    ]);

    const params = buildVariantParams({ rows, isManufactured: true, recipes });

    expect(params[0].recipe).toEqual([{ rawMaterialId: "rm-9", quantity: 7 }]);
  });
});
