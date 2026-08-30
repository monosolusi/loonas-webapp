import { describe, expect, it, vi } from "vitest";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashCategoryServiceImpl } from "@/features/accounting/data/sources/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

/**
 * LNS-738 — asserts the SERIALIZED payload, not the params object: `JSON.stringify` drops
 * undefined-valued keys, so only the stringified body reveals whether a partial PATCH omits
 * a key (server: "unchanged") or sends it. Mirrors the `(params, config)` capture idiom of
 * `cash-entry.test.ts`. None of these endpoints declare an `Idempotency-Key`, so the config
 * capture also guards against one sneaking back in.
 */
function captureRequest(responseData: Record<string, any> | undefined) {
  const captured: {
    body?: Record<string, any>;
    searchParams?: Record<string, any>;
    config?: { headers?: Record<string, string> };
  } = {};

  const http = {
    request: vi.fn(
      async (
        params: { body?: Record<string, any>; searchParams?: Record<string, any> },
        config?: { headers?: Record<string, string> },
      ) => {
        captured.body = params.body;
        captured.searchParams = params.searchParams;
        captured.config = config;
        return responseData;
      },
    ),
  } as unknown as HttpRequest;

  return { http, captured };
}

const session = { accessToken: "token" } as SessionEntity;

const MINIMAL_CATEGORY_JSON = {
  id: "cat-1",
  direction: "in",
  name: "Penjualan Tunai",
  is_curated: false,
  account: { id: "acc-1", code: "4100", name: "Pendapatan Penjualan" },
  created_at: "2026-08-27T00:00:00.000Z",
  updated_at: "2026-08-27T00:00:00.000Z",
};

describe("CashCategoryServiceImpl.create — request payload", () => {
  it("builds the create body with the wire keys, direction on the in/out wire format", async () => {
    const { http, captured } = captureRequest({ data: MINIMAL_CATEGORY_JSON });
    const service = new CashCategoryServiceImpl(http);

    await service.create({ name: "Penjualan Tunai", accountId: "acc-1", direction: CashEntryDirection.In }, session);

    const parsed = JSON.parse(JSON.stringify(captured.body)) as Record<string, unknown>;
    expect(parsed).toEqual({ name: "Penjualan Tunai", account_id: "acc-1", direction: "in" });
  });

  it("sends no Idempotency-Key — the endpoint does not declare one", async () => {
    const { http, captured } = captureRequest({ data: MINIMAL_CATEGORY_JSON });
    const service = new CashCategoryServiceImpl(http);

    await service.create({ name: "Penjualan Tunai", accountId: "acc-1", direction: CashEntryDirection.Out }, session);

    expect(captured.config).toBeUndefined();
  });
});

describe("CashCategoryServiceImpl.update — partial body", () => {
  it("sends only the keys the caller supplied", async () => {
    const { http, captured } = captureRequest({ data: MINIMAL_CATEGORY_JSON });
    const service = new CashCategoryServiceImpl(http);

    await service.update({ id: "cat-1", name: "Penjualan QRIS" }, session);

    const parsed = JSON.parse(JSON.stringify(captured.body)) as Record<string, unknown>;
    expect(parsed).toEqual({ name: "Penjualan QRIS" });
    expect("account_id" in parsed).toBe(false);
  });

  it("remaps the account without touching the name", async () => {
    const { http, captured } = captureRequest({ data: MINIMAL_CATEGORY_JSON });
    const service = new CashCategoryServiceImpl(http);

    await service.update({ id: "cat-1", accountId: "acc-2" }, session);

    const parsed = JSON.parse(JSON.stringify(captured.body)) as Record<string, unknown>;
    expect(parsed).toEqual({ account_id: "acc-2" });
    expect("name" in parsed).toBe(false);
  });

  it("patches against the /{id} path", async () => {
    const { http } = captureRequest({ data: MINIMAL_CATEGORY_JSON });
    const service = new CashCategoryServiceImpl(http);

    await service.update({ id: "cat-1", name: "Penjualan QRIS" }, session);

    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/accounting/cash-categories/cat-1", method: "PATCH" }),
    );
  });
});

describe("CashCategoryServiceImpl.list / delete — request shape", () => {
  it("sends direction as the only filter and never page/limit/search", async () => {
    const { http, captured } = captureRequest({ data: [], meta: { page: 1, limit: 25, total: 0, total_pages: 1 } });
    const service = new CashCategoryServiceImpl(http);

    await service.list({ direction: CashEntryDirection.Out }, session);

    expect(captured.searchParams).toEqual({ direction: "out" });
  });

  it("sends no query params when unfiltered", async () => {
    const { http, captured } = captureRequest({ data: [], meta: { page: 1, limit: 25, total: 0, total_pages: 1 } });
    const service = new CashCategoryServiceImpl(http);

    await service.list({}, session);

    expect(captured.searchParams).toEqual({});
  });

  it("issues a bare DELETE against the /{id} path with no body", async () => {
    const { http, captured } = captureRequest(undefined);
    const service = new CashCategoryServiceImpl(http);

    await service.delete({ id: "cat-1" }, session);

    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/accounting/cash-categories/cat-1", method: "DELETE" }),
    );
    expect(captured.body).toBeUndefined();
  });
});
