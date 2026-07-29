import { describe, expect, it, vi } from "vitest";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductServiceImpl } from "@/features/product/data/sources/product";

/**
 * LNS-573 — `updateVariant`'s PUT is a partial update: an omitted key means "leave unchanged",
 * an explicit `null` means "clear". Asserted against the SERIALIZED payload, not merely against
 * the pre-serialization object — `JSON.stringify` silently drops undefined-valued keys, so a
 * check that only inspected `params.body.sku === undefined` would still pass even if the
 * `!== undefined` guard regressed back to a `sku.trim() || undefined` shape (the original
 * LNS-573 defect). Mirrors the precedent in create-pos-sale-body.test.ts.
 */
function captureBody() {
  const captured: { body?: Record<string, any> } = {};

  const http = {
    request: vi.fn(async (params: { body?: Record<string, any> }) => {
      captured.body = params.body;
      return {};
    }),
  } as unknown as HttpRequest;

  return { http, captured };
}

const session = { accessToken: "token" } as SessionEntity;

describe("ProductServiceImpl.updateVariant — request payload", () => {
  it("sends an explicit sku: null that survives serialization when clearing the SKU", async () => {
    const { http, captured } = captureBody();
    const service = new ProductServiceImpl(http);

    await service.updateVariant("product-1", "variant-1", { name: "Kecil", sku: null, price: 60_000 }, session);

    const serialized = JSON.stringify(captured.body);

    expect(serialized).toContain('"sku":null');

    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    expect(parsed).toEqual({ name: "Kecil", sku: null, price: 60_000 });
  });

  it("omits the sku key from the serialized body when the field is untouched, while name and price still send", async () => {
    const { http, captured } = captureBody();
    const service = new ProductServiceImpl(http);

    await service.updateVariant("product-1", "variant-1", { name: "Kecil", price: 65_000 }, session);

    const serialized = JSON.stringify(captured.body);

    expect(serialized).not.toContain("sku");

    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    expect("sku" in parsed).toBe(false);
    expect(parsed).toEqual({ name: "Kecil", price: 65_000 });
  });

  it("sends the trimmed-nonempty sku string as-is when setting a new SKU", async () => {
    const { http, captured } = captureBody();
    const service = new ProductServiceImpl(http);

    await service.updateVariant("product-1", "variant-1", { name: "Kecil", sku: "SKU-NEW", price: 60_000 }, session);

    const serialized = JSON.stringify(captured.body);

    expect(serialized).toContain('"sku":"SKU-NEW"');

    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    expect(parsed).toEqual({ name: "Kecil", sku: "SKU-NEW", price: 60_000 });
  });
});
