import { describe, expect, it, vi } from "vitest";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntryServiceImpl } from "@/features/accounting/data/sources/cash-entry";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

/**
 * LNS-736 — widens the `captureBody()` idiom from `features/product/data/sources/product.test.ts`
 * to capture BOTH `HttpRequest.request` arguments: the body (first arg) and the config (second
 * arg), since `Idempotency-Key` is threaded through the second argument's `headers`, not the
 * first. Body assertions run against the SERIALIZED payload — `JSON.stringify` silently drops
 * undefined-valued keys, so a check against the pre-serialization object would not catch a
 * regressed `|| undefined` fallback.
 */
function captureRequest(responseData: Record<string, any>) {
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

const MINIMAL_CASH_ENTRY_JSON = {
  id: "entry-1",
  direction: "in",
  amount: 50000,
  reference_number: "KM-0001",
  status: "active",
  note: null,
  entry_date: "2026-08-27",
  category: { id: "cat-1", name: "Penjualan", direction: "in" },
  journal_entry_id: "journal-1",
  cancels_id: null,
  cancelled_by_id: null,
  created_by_user_id: "user-1",
  created_at: "2026-08-27T00:00:00.000Z",
  updated_at: "2026-08-27T00:00:00.000Z",
};

const MINIMAL_LIST_JSON = { data: [], meta: { page: 1, limit: 25, total: 0, total_pages: 1 } };

describe("CashEntryServiceImpl.create — request payload", () => {
  it("builds the create body with the wire keys and sends Idempotency-Key in the config headers", async () => {
    const { http, captured } = captureRequest({ data: MINIMAL_CASH_ENTRY_JSON });
    const service = new CashEntryServiceImpl(http);

    await service.create(
      {
        direction: CashEntryDirection.In,
        amount: 50000,
        categoryId: "cat-1",
        date: "2026-08-27",
        idempotencyKey: "idem-key-12345",
      },
      session,
    );

    const parsed = JSON.parse(JSON.stringify(captured.body)) as Record<string, unknown>;
    expect(parsed).toEqual({
      direction: "in",
      amount: 50000,
      category_id: "cat-1",
      date: "2026-08-27",
    });
    expect("note" in parsed).toBe(false);
    expect(captured.config?.headers?.["Idempotency-Key"]).toBe("idem-key-12345");
  });

  it("omits the note key from the serialized body when unset", async () => {
    const { http, captured } = captureRequest({ data: MINIMAL_CASH_ENTRY_JSON });
    const service = new CashEntryServiceImpl(http);

    await service.create(
      {
        direction: CashEntryDirection.Out,
        amount: 20000,
        categoryId: "cat-2",
        date: "2026-08-27",
        idempotencyKey: "idem-key-abcde",
      },
      session,
    );

    const parsed = JSON.parse(JSON.stringify(captured.body)) as Record<string, unknown>;
    expect("note" in parsed).toBe(false);
  });

  it("sends an explicit note: null that survives serialization when cleared", async () => {
    const { http, captured } = captureRequest({ data: MINIMAL_CASH_ENTRY_JSON });
    const service = new CashEntryServiceImpl(http);

    await service.create(
      {
        direction: CashEntryDirection.In,
        amount: 50000,
        categoryId: "cat-1",
        date: "2026-08-27",
        note: null,
        idempotencyKey: "idem-key-12345",
      },
      session,
    );

    const serialized = JSON.stringify(captured.body);
    expect(serialized).toContain('"note":null');
  });
});

describe("CashEntryServiceImpl.cancel — request", () => {
  it("sends Idempotency-Key in the config headers", async () => {
    const { http, captured } = captureRequest({ data: MINIMAL_CASH_ENTRY_JSON });
    const service = new CashEntryServiceImpl(http);

    await service.cancel({ id: "entry-1", idempotencyKey: "cancel-key-12345" }, session);

    expect(captured.config?.headers?.["Idempotency-Key"]).toBe("cancel-key-12345");
  });
});

describe("CashEntryServiceImpl.list — query params", () => {
  it("sends date_from and date_to together when both are supplied", async () => {
    const { http, captured } = captureRequest(MINIMAL_LIST_JSON);
    const service = new CashEntryServiceImpl(http);

    await service.list({ dateFrom: "2026-08-01", dateTo: "2026-08-31" }, session);

    expect(captured.searchParams).toEqual({ date_from: "2026-08-01", date_to: "2026-08-31" });
  });

  it("sends neither date_from nor date_to when only one is supplied", async () => {
    const { http, captured } = captureRequest(MINIMAL_LIST_JSON);
    const service = new CashEntryServiceImpl(http);

    await service.list({ dateFrom: "2026-08-01" }, session);

    expect(captured.searchParams).toEqual({});
  });

  it("never sends a search key", async () => {
    const { http, captured } = captureRequest(MINIMAL_LIST_JSON);
    const service = new CashEntryServiceImpl(http);

    await service.list({ page: 1, limit: 25, direction: CashEntryDirection.Out }, session);

    expect(captured.searchParams).toEqual({ page: "1", limit: "25", direction: "out" });
    expect("search" in (captured.searchParams ?? {})).toBe(false);
  });
});
