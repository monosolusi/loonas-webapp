import { describe, expect, it, vi } from "vitest";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";

/**
 * AC-18 — no entry of `items[]` may contain a `unit_price` key.
 *
 * Asserted against the SERIALIZED payload, not merely against an undefined property:
 * `JSON.stringify` drops undefined values, so a test that only checked
 * `item.unit_price === undefined` would pass even if the field were still being set.
 */
function captureBody() {
  const captured: { body?: Record<string, any> } = {};

  const http = {
    request: vi.fn(async (params: { body?: Record<string, any> }) => {
      captured.body = params.body;
      return { id: "inv-1", items: [], channel: "pos" };
    }),
  } as unknown as HttpRequest;

  return { http, captured };
}

const session = { accessToken: "token" } as SessionEntity;

describe("InvoiceServiceImpl.createPosSale — request payload", () => {
  it("omits unit_price from every serialized line", async () => {
    const { http, captured } = captureBody();
    const service = new InvoiceServiceImpl(http);

    await service.createPosSale(
      {
        date: "2026-01-01",
        paymentGatewayId: "pg-1",
        discount: 0,
        items: [
          { variantId: "v1", quantity: 12, discount: 0 },
          { variantId: "v2", quantity: 1.5, discount: 0 },
        ],
        idempotencyKey: "abcdefgh",
      },
      session,
    );

    const serialized = JSON.stringify(captured.body);

    expect(serialized).not.toContain("unit_price");

    // And structurally: the key is absent from each item, not present-and-undefined.
    const parsed = JSON.parse(serialized) as { items: Record<string, unknown>[] };
    expect(parsed.items).toHaveLength(2);
    for (const item of parsed.items) {
      expect(Object.keys(item)).not.toContain("unit_price");
      expect("unit_price" in item).toBe(false);
    }
  });

  it("still sends the fields the server needs", async () => {
    const { http, captured } = captureBody();
    const service = new InvoiceServiceImpl(http);

    await service.createPosSale(
      {
        date: "2026-01-01",
        paymentGatewayId: "pg-1",
        discount: 0,
        items: [{ variantId: "v1", quantity: 12, discount: 0 }],
        idempotencyKey: "abcdefgh",
      },
      session,
    );

    const parsed = JSON.parse(JSON.stringify(captured.body)) as {
      items: { variant: { id: string }; quantity: number; discount: number }[];
    };

    expect(parsed.items[0]).toEqual({ variant: { id: "v1" }, quantity: 12, discount: 0 });
  });

  it("sends the Idempotency-Key header", async () => {
    const { http } = captureBody();
    const service = new InvoiceServiceImpl(http);

    await service.createPosSale(
      {
        date: "2026-01-01",
        paymentGatewayId: "pg-1",
        discount: 0,
        items: [{ variantId: "v1", quantity: 1, discount: 0 }],
        idempotencyKey: "abcdefgh",
      },
      session,
    );

    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/pos/sales", method: "POST" }),
      expect.objectContaining({ headers: { "Idempotency-Key": "abcdefgh" } }),
    );
  });
});
