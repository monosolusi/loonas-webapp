import { describe, expect, it, vi } from "vitest";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceServiceImpl } from "@/features/balance/data/sources/balance";
import { BalanceModel } from "@/features/balance/data/models/balance";

type CapturedRequest = {
  path?: string;
  method?: string;
  searchParams?: Record<string, any>;
  body?: Record<string, any>;
};

/**
 * Capture pattern per `src/features/inventory/data/sources/stock-adjustment.test.ts`: mock
 * `HttpRequest.request` with a `vi.fn()` and assert on what the service actually handed the
 * transport — the addressed path and params, not the params object the caller built.
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

// FR-6 AC-1 + AC-4 — the balance is the CALLER'S OWN: `/balance` carries no merchant
// identifier anywhere (the backend resolves the account from the JWT orgId), so a captured
// request naming an account/owner/merchant would be the cross-tenant leak this AC forbids.
describe("BalanceServiceImpl.get — request + parse", () => {
  it("issues a bare GET /balance with no searchParams and no body", async () => {
    const { http, captured } = captureRequest({ data: { balance: 12500, currency: "IDR" } });
    const service = new BalanceServiceImpl(http);

    await service.get(session);

    expect(captured.path).toBe("/balance");
    expect(captured.method).toBe("GET");
    expect(captured.searchParams).toBeUndefined();
    expect(captured.body).toBeUndefined();
  });

  it("carries no account, owner, merchant or balance_id identifier in the captured request", async () => {
    const { http, captured } = captureRequest({ data: { balance: 12500, currency: "IDR" } });
    const service = new BalanceServiceImpl(http);

    await service.get(session);

    const serialized = JSON.stringify({
      path: captured.path,
      method: captured.method,
      searchParams: captured.searchParams,
      body: captured.body,
    });

    expect(serialized).not.toMatch(/account|owner|merchant|balance_id/i);
  });

  it("parses the enveloped body into a BalanceModel whose entity carries balance + currency", async () => {
    const { http } = captureRequest({ data: { balance: 12500, currency: "IDR" } });
    const service = new BalanceServiceImpl(http);

    const model = await service.get(session);

    expect(model).toBeInstanceOf(BalanceModel);
    const entity = model.toEntity();
    expect(entity.balance).toBe(12500);
    expect(entity.currency).toBe("IDR");
  });

  it("accepts a zero balance — a merchant with no money-in still gets 200, not an error", async () => {
    const { http } = captureRequest({ data: { balance: 0, currency: "IDR" } });
    const service = new BalanceServiceImpl(http);

    const entity = (await service.get(session)).toEntity();

    expect(entity.balance).toBe(0);
  });
});
