import { describe, expect, it } from "vitest";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { VariantEntity } from "@/features/product/domain/entities/variant";
import { PriceTierEntity } from "@/features/product/domain/entities/price-tier";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { TierMode } from "@/features/product/domain/enums/tier-mode";
import type { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";
import { isVariantChanged, syncVariants } from "@/app/(authenticated)/products/[id]/_utils/sync-variants";

function variant(args: {
  id: string;
  name?: string;
  sku?: string | null;
  price?: number;
  hasRecipe?: boolean;
  tiers?: [number, number][];
}): VariantEntity {
  return new VariantEntity({
    id: args.id,
    name: args.name ?? DEFAULT_VARIANT_NAME,
    sku: args.sku === undefined ? null : args.sku,
    price: args.price ?? 70_000,
    metadata: args.hasRecipe !== undefined ? { hasRecipe: args.hasRecipe } : null,
    product: null,
    priceTierSchedule: args.tiers
      ? new PriceTierScheduleEntity({
          tierMode: TierMode.VOLUME,
          tiers: args.tiers.map(([minQty, unitPrice]) => new PriceTierEntity({ minQty, unitPrice })),
        })
      : null,
  });
}

function product(variants: VariantEntity[]): ProductEntity {
  return new ProductEntity({
    id: "product-1",
    name: "Produk",
    sku: "PRD-1",
    type: "TRADING",
    productionMode: null,
    active: true,
    category: null,
    photos: [],
    variants,
    metadata: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });
}

function row(key: string, args: { name?: string; sku?: string; price?: number } = {}): VariantFormRow {
  return { key, name: args.name ?? "", sku: args.sku ?? "", price: args.price ?? 0 };
}

// Hand-rolled recorder, not vi.fn() — the repo has zero vi.fn() usage (precedent:
// idempotency-rotation.test.ts). toHaveBeenCalledWith uses toEqual semantics, which ignore
// undefined-valued keys, so several of these cases read `calls` directly instead.
function recorder() {
  const calls = {
    adds: [] as { productId: string; name: string; sku?: string; price: number }[],
    updates: [] as { productId: string; variantId: string; name: string; sku?: string; price: number }[],
    deletes: [] as { productId: string; variantId: string }[],
  };

  return {
    calls,
    addVariant: async (params: { productId: string; name: string; sku?: string; price: number }) => {
      calls.adds.push(params);
    },
    updateVariant: async (params: { productId: string; variantId: string; name: string; sku?: string; price: number }) => {
      calls.updates.push(params);
    },
    deleteVariant: async (params: { productId: string; variantId: string }) => {
      calls.deletes.push(params);
    },
  };
}

describe("syncVariants — single-price mode, existing Default variant", () => {
  it("plans a single update carrying the real variant id on a price-only edit (regression: previously delete+add)", async () => {
    const existing = variant({ id: "v-1", sku: "SKU-A", price: 70_000 });
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: false,
      variants: [],
      singlePrice: 80_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.deletes).toHaveLength(0);
    expect(calls.adds).toHaveLength(0);
    expect(calls.updates).toHaveLength(1);
    expect(calls.updates[0].variantId).toBe("v-1");
    expect(calls.updates[0].price).toBe(80_000);
  });

  it("keeps the variant id stable across a price edit when tiers and a recipe are attached", async () => {
    const existing = variant({ id: "v-1", price: 70_000, hasRecipe: true, tiers: [[10, 65_000]] });
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: false,
      variants: [],
      singlePrice: 80_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    // Id stability is the unit-level proxy for grosir-tier and recipe survival — both hang
    // off this id as separate variant-scoped sub-resources.
    expect(calls.deletes).toHaveLength(0);
    expect(calls.updates).toHaveLength(1);
    expect(calls.updates[0].variantId).toBe("v-1");
  });

  it("carries the existing SKU through a price-only edit", async () => {
    const existing = variant({ id: "v-1", sku: "SKU-A", price: 70_000 });
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: false,
      variants: [],
      singlePrice: 80_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.updates[0].sku).toBe("SKU-A");
  });

  it("sends sku: undefined (dropped by JSON serialization) when the server variant has no SKU", async () => {
    const existing = variant({ id: "v-1", sku: null, price: 70_000 });
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: false,
      variants: [],
      singlePrice: 80_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    // The `sku` key is always a literal property in the call params (`sku: v.sku.trim() ||
    // undefined`), so `"sku" in obj` is always true regardless of value — the omission that
    // matters is at the JSON-serialization boundary, which strips undefined-valued keys. That
    // is exactly why this suite reads `.sku` directly instead of a toEqual-based matcher.
    expect(calls.updates[0].sku).toBeUndefined();
    expect(JSON.stringify(calls.updates[0])).not.toContain("sku");
  });

  it("produces byte-identical plans whether the server SKU is null or an empty string", async () => {
    const nullSkuPlan = recorder();
    await syncVariants({
      product: product([variant({ id: "v-1", sku: null, price: 70_000 })]),
      formHasVariants: false,
      variants: [],
      singlePrice: 80_000,
      addVariant: nullSkuPlan.addVariant,
      updateVariant: nullSkuPlan.updateVariant,
      deleteVariant: nullSkuPlan.deleteVariant,
    });

    const emptySkuPlan = recorder();
    await syncVariants({
      product: product([variant({ id: "v-1", sku: "", price: 70_000 })]),
      formHasVariants: false,
      variants: [],
      singlePrice: 80_000,
      addVariant: emptySkuPlan.addVariant,
      updateVariant: emptySkuPlan.updateVariant,
      deleteVariant: emptySkuPlan.deleteVariant,
    });

    expect(nullSkuPlan.calls).toEqual(emptySkuPlan.calls);
  });

  it("plans zero requests when the price has not changed (regression: previously delete+add on every save)", async () => {
    const existing = variant({ id: "v-1", sku: null, price: 70_000 });
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: false,
      variants: [],
      singlePrice: 70_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.adds).toHaveLength(0);
    expect(calls.updates).toHaveLength(0);
    expect(calls.deletes).toHaveLength(0);
  });

  it("plans zero requests when the price has not changed and the variant has a SKU (a hardcoded sku: \"\" would phantom-diff this)", async () => {
    const existing = variant({ id: "v-1", sku: "SKU-A", price: 70_000 });
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: false,
      variants: [],
      singlePrice: 70_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.adds).toHaveLength(0);
    expect(calls.updates).toHaveLength(0);
    expect(calls.deletes).toHaveLength(0);
  });

  it("propagates a rejected update so handleSave's catch can classify it", async () => {
    const err = new Error("boom");
    const existing = variant({ id: "v-1", price: 70_000 });

    await expect(
      syncVariants({
        product: product([existing]),
        formHasVariants: false,
        variants: [],
        singlePrice: 80_000,
        addVariant: async () => undefined,
        updateVariant: async () => {
          throw err;
        },
        deleteVariant: async () => undefined,
      }),
    ).rejects.toBe(err);
  });
});

describe("syncVariants — single-price mode, no server variant yet", () => {
  it("adds a single Default-named variant, with zero deletes", async () => {
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([]),
      formHasVariants: false,
      variants: [],
      singlePrice: 50_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.deletes).toHaveLength(0);
    expect(calls.updates).toHaveLength(0);
    expect(calls.adds).toHaveLength(1);
    expect(calls.adds[0].name).toBe(DEFAULT_VARIANT_NAME);
    expect(calls.adds[0].price).toBe(50_000);
  });
});

describe("syncVariants — multi-to-single collapse", () => {
  it("deletes every real variant (unordered) and adds one Default row, zero updates", async () => {
    const v1 = variant({ id: "v-1", name: "Kecil", price: 60_000 });
    const v2 = variant({ id: "v-2", name: "Besar", price: 90_000 });
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([v1, v2]),
      formHasVariants: false,
      variants: [],
      singlePrice: 70_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.updates).toHaveLength(0);
    expect(calls.adds).toHaveLength(1);
    // Promise.all ordering is not a guarantee worth pinning — assert as an unordered set.
    expect(new Set(calls.deletes.map((d) => d.variantId))).toEqual(new Set(["v-1", "v-2"]));
  });

  it("deletes then adds — not an in-place PUT — when the single existing variant is not named Default", async () => {
    // Edge the ticket misses: a naive `variants.length === 1` predicate would rename this
    // variant in place, leaving a product the UI shows as single-price while the server
    // still reports it multi-variant. `product.defaultVariant` is null here because
    // `hasVariants` is true (one variant, not named "Default"), so the sentinel key is used.
    const existing = variant({ id: "v-1", name: "Satuan", price: 70_000 });
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: false,
      variants: [],
      singlePrice: 80_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.updates).toHaveLength(0);
    expect(calls.deletes).toHaveLength(1);
    expect(calls.deletes[0].variantId).toBe("v-1");
    expect(calls.adds).toHaveLength(1);
  });

  it("still records the add when a sibling delete rejects (the collapse path can partially apply)", async () => {
    const toRemove = variant({ id: "v-1", name: "Lama", price: 60_000 });
    const err = new Error("delete failed");
    let addCompleted = false;

    await expect(
      syncVariants({
        product: product([toRemove]),
        formHasVariants: false,
        variants: [],
        singlePrice: 80_000,
        addVariant: async () => {
          addCompleted = true;
        },
        updateVariant: async () => undefined,
        deleteVariant: async () => {
          throw err;
        },
      }),
    ).rejects.toBe(err);

    expect(addCompleted).toBe(true);
  });
});

describe("syncVariants — multi-variant mode", () => {
  it("plans add, update, and delete independently, with no update for an unchanged row", async () => {
    const unchanged = variant({ id: "v-1", name: "Kecil", sku: "SKU-A", price: 60_000 });
    const toChange = variant({ id: "v-2", name: "Besar", sku: "SKU-B", price: 90_000 });
    const toRemove = variant({ id: "v-3", name: "Jumbo", price: 120_000 });

    const currentVariants: VariantFormRow[] = [
      row("v-1", { name: "Kecil", sku: "SKU-A", price: 60_000 }),
      row("v-2", { name: "Besar", sku: "SKU-B", price: 95_000 }),
      row("new-row", { name: "Baru", sku: "", price: 50_000 }),
    ];

    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([unchanged, toChange, toRemove]),
      formHasVariants: true,
      variants: currentVariants,
      singlePrice: 999_999, // must be ignored entirely in this mode
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.deletes).toHaveLength(1);
    expect(calls.deletes[0].variantId).toBe("v-3");
    expect(calls.adds).toHaveLength(1);
    expect(calls.adds[0].name).toBe("Baru");
    expect(calls.updates).toHaveLength(1);
    expect(calls.updates[0].variantId).toBe("v-2");
    expect(calls.updates[0].price).toBe(95_000);
  });

  it("ignores singlePrice entirely when formHasVariants is true", async () => {
    const existing = variant({ id: "v-1", name: "Kecil", price: 60_000 });
    const currentVariants: VariantFormRow[] = [row("v-1", { name: "Kecil", price: 60_000 })];
    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: true,
      variants: currentVariants,
      singlePrice: 1_000_000,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.adds).toHaveLength(0);
    expect(calls.updates).toHaveLength(0);
    expect(calls.deletes).toHaveLength(0);
  });

  it("trims name and SKU on add and update, and sends undefined for a whitespace-only SKU", async () => {
    const existing = variant({ id: "v-1", name: "Kecil", sku: "SKU-A", price: 60_000 });
    const currentVariants: VariantFormRow[] = [
      row("v-1", { name: "  Kecil Sekali  ", sku: "   ", price: 60_000 }),
      row("new-row", { name: "  Baru  ", sku: "  SKU-C  ", price: 40_000 }),
    ];

    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: true,
      variants: currentVariants,
      singlePrice: 0,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    expect(calls.updates[0].name).toBe("Kecil Sekali");
    expect(calls.updates[0].sku).toBeUndefined();
    expect(calls.adds[0].name).toBe("Baru");
    expect(calls.adds[0].sku).toBe("SKU-C");
  });

  it("plans a no-op update for a whitespace-only diff (pre-existing asymmetry: isVariantChanged compares untrimmed)", async () => {
    const existing = variant({ id: "v-1", name: "Kecil", sku: "SKU-A", price: 60_000 });
    const currentVariants: VariantFormRow[] = [row("v-1", { name: "Kecil ", sku: "SKU-A", price: 60_000 })];

    const { calls, addVariant, updateVariant, deleteVariant } = recorder();

    await syncVariants({
      product: product([existing]),
      formHasVariants: true,
      variants: currentVariants,
      singlePrice: 0,
      addVariant,
      updateVariant,
      deleteVariant,
    });

    // isVariantChanged sees "Kecil " !== "Kecil" and fires a PUT whose trimmed body is
    // byte-identical to what's already stored. Pre-existing, not introduced by this fix.
    expect(calls.updates).toHaveLength(1);
    expect(calls.updates[0].name).toBe("Kecil");
  });
});

describe("isVariantChanged", () => {
  it("reports no change for a matching row, including a null server SKU against an empty local SKU", () => {
    const original = variant({ id: "v-1", name: "Kecil", sku: null, price: 60_000 });
    expect(isVariantChanged(row("v-1", { name: "Kecil", sku: "", price: 60_000 }), original)).toBe(false);
  });

  it("reports a change on price alone", () => {
    const original = variant({ id: "v-1", name: "Kecil", sku: "SKU-A", price: 60_000 });
    expect(isVariantChanged(row("v-1", { name: "Kecil", sku: "SKU-A", price: 65_000 }), original)).toBe(true);
  });

  it("reports a change on name alone", () => {
    const original = variant({ id: "v-1", name: "Kecil", sku: "SKU-A", price: 60_000 });
    expect(isVariantChanged(row("v-1", { name: "Besar", sku: "SKU-A", price: 60_000 }), original)).toBe(true);
  });

  it("reports a change on SKU alone", () => {
    const original = variant({ id: "v-1", name: "Kecil", sku: "SKU-A", price: 60_000 });
    expect(isVariantChanged(row("v-1", { name: "Kecil", sku: "SKU-B", price: 60_000 }), original)).toBe(true);
  });

  it("reports no change for a row shaped exactly as singlePriceRow seeds it — the invariant the no-op-save AC rests on", () => {
    const original = variant({ id: "v-1", name: DEFAULT_VARIANT_NAME, sku: "SKU-A", price: 70_000 });
    // Mirrors singlePriceRow(existing, singlePrice) when singlePrice === existing.price.
    const seeded: VariantFormRow = {
      key: original.id,
      name: original.name,
      sku: original.sku ?? "",
      price: original.price,
    };
    expect(isVariantChanged(seeded, original)).toBe(false);
  });
});
