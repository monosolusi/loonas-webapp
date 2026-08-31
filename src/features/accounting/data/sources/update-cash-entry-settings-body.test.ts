import { describe, expect, it, vi } from "vitest";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntrySettingsServiceImpl } from "@/features/accounting/data/sources/cash-entry-settings";

/**
 * LNS-738 — the PATCH is a partial update where an omitted key means "unchanged" and an
 * explicit `null` means "clear the default". That distinction is only observable on the
 * SERIALIZED payload: `JSON.stringify` silently drops undefined-valued keys, so a test that
 * checked the pre-serialization object would pass even if a clear had regressed into a
 * no-op (LNS-573). Mirrors the `(params, config)` capture idiom of
 * `create-cash-category-body.test.ts`: the settings PATCH declares no `Idempotency-Key`, so
 * the config capture guards against one sneaking back in via the header contract.
 */
function captureRequest(responseData: Record<string, any>) {
  const captured: {
    body?: Record<string, any>;
    config?: { headers?: Record<string, string> };
  } = {};

  const http = {
    request: vi.fn(
      async (params: { body?: Record<string, any> }, config?: { headers?: Record<string, string> }) => {
        captured.body = params.body;
        captured.config = config;
        return responseData;
      },
    ),
  } as unknown as HttpRequest;

  return { http, captured };
}

const session = { accessToken: "token" } as SessionEntity;

const SETTINGS_JSON = { default_income_account_id: "acc-1", default_expense_account_id: "acc-2" };

describe("CashEntrySettingsServiceImpl.update — request payload", () => {
  it("sends both defaults under their wire keys", async () => {
    const { http, captured } = captureRequest({ data: SETTINGS_JSON });
    const service = new CashEntrySettingsServiceImpl(http);

    await service.update({ defaultIncomeAccountId: "acc-1", defaultExpenseAccountId: "acc-2" }, session);

    const parsed = JSON.parse(JSON.stringify(captured.body)) as Record<string, unknown>;
    expect(parsed).toEqual({ default_income_account_id: "acc-1", default_expense_account_id: "acc-2" });
  });

  it("omits the field the caller did not supply", async () => {
    const { http, captured } = captureRequest({ data: SETTINGS_JSON });
    const service = new CashEntrySettingsServiceImpl(http);

    await service.update({ defaultExpenseAccountId: "acc-2" }, session);

    const parsed = JSON.parse(JSON.stringify(captured.body)) as Record<string, unknown>;
    expect(parsed).toEqual({ default_expense_account_id: "acc-2" });
    expect("default_income_account_id" in parsed).toBe(false);
  });

  it("keeps an explicit null through serialization so a default can be cleared", async () => {
    const { http, captured } = captureRequest({ data: SETTINGS_JSON });
    const service = new CashEntrySettingsServiceImpl(http);

    await service.update({ defaultIncomeAccountId: null }, session);

    const serialized = JSON.stringify(captured.body);
    expect(serialized).toContain('"default_income_account_id":null');
    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    expect(parsed).toEqual({ default_income_account_id: null });
  });

  it("sends an empty object when nothing is supplied, leaving both defaults unchanged", async () => {
    const { http, captured } = captureRequest({ data: SETTINGS_JSON });
    const service = new CashEntrySettingsServiceImpl(http);

    await service.update({}, session);

    expect(JSON.stringify(captured.body)).toBe("{}");
  });

  it("sends no Idempotency-Key — the endpoint does not declare one", async () => {
    const { http, captured } = captureRequest({ data: SETTINGS_JSON });
    const service = new CashEntrySettingsServiceImpl(http);

    await service.update({ defaultIncomeAccountId: "acc-1" }, session);

    expect(captured.config?.headers?.["Idempotency-Key"]).toBeUndefined();
  });
});

describe("CashEntrySettingsServiceImpl.get — request shape", () => {
  it("issues a bare GET with no query params", async () => {
    const { http } = captureRequest({ data: SETTINGS_JSON });
    const service = new CashEntrySettingsServiceImpl(http);

    await service.get(session);

    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/accounting/cash-entry-settings", method: "GET" }),
    );
  });
});
