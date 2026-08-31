import { describe, expect, it, vi } from "vitest";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceMovementServiceImpl } from "@/features/balance/data/sources/balance-movement";
import { BalanceMovementModel } from "@/features/balance/data/models/balance-movement";
import { MovementDirection } from "@/features/balance/domain/enums/movement-direction";

type CapturedRequest = {
  path?: string;
  method?: string;
  searchParams?: Record<string, any>;
  body?: Record<string, any>;
};

const MOVEMENT_JSON = {
  id: "0b6c6d3e-0001-4a5a-9d3e-1a2b3c4d5e6f",
  direction: "debit",
  amount: 9000,
  currency: "IDR",
  source_ref_type: "payment.pay_in",
  source_ref_id: "7c2e1f90-0002-4b6b-8e4f-2b3c4d5e6f70",
  corrects_movement_id: null,
  created_at: "2026-08-30T11:00:00Z",
};

/**
 * Capture pattern per `src/features/inventory/data/sources/stock-adjustment.test.ts`: mock
 * `HttpRequest.request` with a `vi.fn()` and assert on the SERIALIZED request the service
 * handed the transport — never on a params object the caller built.
 */
function captureRequest(response: Record<string, any>) {
  const captured: CapturedRequest = {};

  const http = {
    request: vi.fn(async (params: CapturedRequest) => {
      captured.path = params.path;
      captured.method = params.method;
      captured.searchParams = params.searchParams;
      captured.body = params.body;
      return response;
    }),
  } as unknown as HttpRequest;

  return { http, captured };
}

const session = { accessToken: "token" } as SessionEntity;

function serializeCaptured(captured: CapturedRequest): string {
  return JSON.stringify({
    path: captured.path,
    method: captured.method,
    searchParams: captured.searchParams,
    body: captured.body,
  });
}

// FR-6 AC-2 + AC-4 — the operation takes exactly `page` + `limit` (LNS-753 removed the
// `offset` the earlier draft declared) and names no merchant: the account is resolved from
// the JWT orgId server-side.
describe("BalanceMovementServiceImpl.list — request", () => {
  it("sends exactly { page, limit } as strings and no offset key", async () => {
    const { http, captured } = captureRequest({
      data: [MOVEMENT_JSON],
      meta: { page: 2, limit: 10, total: 11, total_pages: 2 },
    });
    const service = new BalanceMovementServiceImpl(http);

    await service.list({ page: 2, limit: 10 }, session);

    expect(captured.path).toBe("/balance/movements");
    expect(captured.method).toBe("GET");
    expect(captured.searchParams).toEqual({ page: "2", limit: "10" });
    expect(Object.keys(captured.searchParams ?? {})).not.toContain("offset");
  });

  it("never serialises an offset anywhere in the request", async () => {
    const { http, captured } = captureRequest({
      data: [MOVEMENT_JSON],
      meta: { page: 2, limit: 10, total: 11, total_pages: 2 },
    });
    const service = new BalanceMovementServiceImpl(http);

    await service.list({ page: 2, limit: 10 }, session);

    expect(serializeCaptured(captured)).not.toMatch(/offset/i);
  });

  it("sends no account, owner or merchant identifier in path, searchParams or body", async () => {
    const { http, captured } = captureRequest({
      data: [MOVEMENT_JSON],
      meta: { page: 1, limit: 10, total: 1, total_pages: 1 },
    });
    const service = new BalanceMovementServiceImpl(http);

    await service.list({ page: 1, limit: 10 }, session);

    expect(serializeCaptured(captured)).not.toMatch(/account|owner|merchant|balance_id/i);
  });

  it("sends an empty searchParams when neither page nor limit is asked for", async () => {
    const { http, captured } = captureRequest({ data: [], meta: { page: 1, limit: 100, total: 0, total_pages: 1 } });
    const service = new BalanceMovementServiceImpl(http);

    await service.list({}, session);

    expect(captured.searchParams).toEqual({});
    expect(captured.body).toBeUndefined();
  });
});

describe("BalanceMovementServiceImpl.list — envelope mapping", () => {
  it("maps the meta envelope, including total_pages → totalPages", async () => {
    const { http } = captureRequest({ data: [MOVEMENT_JSON], meta: { page: 2, limit: 10, total: 21, total_pages: 3 } });
    const service = new BalanceMovementServiceImpl(http);

    const result = await service.list({ page: 2, limit: 10 }, session);

    expect(result.meta).toEqual({ page: 2, limit: 10, total: 21, totalPages: 3 });
  });

  it("parses each movement into a BalanceMovementModel", async () => {
    const { http } = captureRequest({ data: [MOVEMENT_JSON], meta: { page: 1, limit: 10, total: 1, total_pages: 1 } });
    const service = new BalanceMovementServiceImpl(http);

    const result = await service.list({ page: 1, limit: 10 }, session);

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toBeInstanceOf(BalanceMovementModel);

    const entity = result.data[0].toEntity();
    expect(entity.direction).toBe(MovementDirection.DEBIT);
    expect(entity.amount).toBe(9000);
    expect(entity.createdAt).toBe("2026-08-30T11:00:00Z");
  });

  it("returns an empty list for an empty page", async () => {
    const { http } = captureRequest({ data: [], meta: { page: 1, limit: 100, total: 0, total_pages: 1 } });
    const service = new BalanceMovementServiceImpl(http);

    const result = await service.list({}, session);

    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(0);
  });
});
