import { describe, expect, it, vi } from "vitest";
import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { StockAdjustmentServiceImpl } from "@/features/inventory/data/sources/stock-adjustment";

/**
 * Asserts on the SERIALIZED payload (JSON.stringify(body)), not the pre-serialization
 * object — `JSON.stringify` silently drops undefined-valued keys, so asserting on the
 * params object would pass whether the channel-key bug is present or not. The field name
 * is the sole channel discriminator: counted → counted_quantity + expected_book_quantity
 * (no removed_quantity); removed → removed_quantity (no counted_quantity AND no
 * expected_book_quantity). Per the serialized-payload testing rule (LNS-573).
 */
function captureRequest() {
  const captured: { body?: Record<string, any>; headers?: Record<string, string> } = {};

  const http = {
    request: vi.fn(async (params: { body?: Record<string, any> }, config?: { headers?: Record<string, string> }) => {
      captured.body = params.body;
      captured.headers = config?.headers;
      return {
        id: "movement-1",
        type: "opname_adjustment",
        quantity: -5,
        reference_type: null,
        reference_id: null,
        note: null,
        stock_item: { id: "stock-item-1" },
        created_at: "2026-08-06T00:00:00Z",
        effective_at: "2026-08-06T00:00:00Z",
        reason: "shrinkage",
      };
    }),
  } as unknown as HttpRequest;

  return { http, captured };
}

const session = { accessToken: "token" } as SessionEntity;

describe("StockAdjustmentServiceImpl.adjust — request payload", () => {
  it("counted channel sends counted_quantity + expected_book_quantity, no removed_quantity", async () => {
    const { http, captured } = captureRequest();
    const service = new StockAdjustmentServiceImpl(http);

    await service.adjust(
      {
        stockItemId: "stock-item-1",
        channel: "counted",
        quantity: 95,
        reason: "recount_overage",
        note: null,
        expectedBookQuantity: 100,
        idempotencyKey: "key-12345678",
      },
      session,
    );

    const serialized = JSON.stringify(captured.body);
    const parsed = JSON.parse(serialized) as Record<string, unknown>;

    expect(parsed).toEqual({
      reason: "recount_overage",
      counted_quantity: 95,
      expected_book_quantity: 100,
    });
    expect(serialized).toContain("counted_quantity");
    expect(serialized).toContain("expected_book_quantity");
    expect(serialized).not.toContain("removed_quantity");
  });

  it("counted channel includes the note when present", async () => {
    const { http, captured } = captureRequest();
    const service = new StockAdjustmentServiceImpl(http);

    await service.adjust(
      {
        stockItemId: "stock-item-1",
        channel: "counted",
        quantity: 95,
        reason: "shrinkage",
        note: "Hilang 5 unit",
        expectedBookQuantity: 100,
        idempotencyKey: "key-12345678",
      },
      session,
    );

    const parsed = JSON.parse(JSON.stringify(captured.body)) as Record<string, unknown>;
    expect(parsed).toEqual({
      reason: "shrinkage",
      counted_quantity: 95,
      expected_book_quantity: 100,
      note: "Hilang 5 unit",
    });
  });

  it("removed channel sends removed_quantity, no counted_quantity AND no expected_book_quantity", async () => {
    const { http, captured } = captureRequest();
    const service = new StockAdjustmentServiceImpl(http);

    await service.adjust(
      {
        stockItemId: "stock-item-1",
        channel: "removed",
        quantity: 5,
        reason: "owner_withdrawal",
        note: "Diambil pemilik untuk konsumsi pribadi",
        idempotencyKey: "key-12345678",
      },
      session,
    );

    const serialized = JSON.stringify(captured.body);
    const parsed = JSON.parse(serialized) as Record<string, unknown>;

    expect(parsed).toEqual({
      reason: "owner_withdrawal",
      removed_quantity: 5,
      note: "Diambil pemilik untuk konsumsi pribadi",
    });
    expect(serialized).toContain("removed_quantity");
    expect(serialized).not.toContain("counted_quantity");
    expect(serialized).not.toContain("expected_book_quantity");
  });

  it("removed channel includes the required note", async () => {
    const { http, captured } = captureRequest();
    const service = new StockAdjustmentServiceImpl(http);

    await service.adjust(
      {
        stockItemId: "stock-item-1",
        channel: "removed",
        quantity: 3,
        reason: "staff_consumption",
        note: "Makan siang semua karyawan",
        idempotencyKey: "key-12345678",
      },
      session,
    );

    const parsed = JSON.parse(JSON.stringify(captured.body)) as Record<string, unknown>;
    expect(parsed.note).toBe("Makan siang semua karyawan");
    expect(parsed.removed_quantity).toBe(3);
  });

  it("omits the note key from the serialized body when note is null", async () => {
    const { http, captured } = captureRequest();
    const service = new StockAdjustmentServiceImpl(http);

    await service.adjust(
      {
        stockItemId: "stock-item-1",
        channel: "counted",
        quantity: 105,
        reason: "recount_overage",
        note: null,
        expectedBookQuantity: 100,
        idempotencyKey: "key-12345678",
      },
      session,
    );

    const serialized = JSON.stringify(captured.body);
    expect(serialized).not.toContain('"note"');
  });

  it("sends the Idempotency-Key header", async () => {
    const { http, captured } = captureRequest();
    const service = new StockAdjustmentServiceImpl(http);

    await service.adjust(
      {
        stockItemId: "stock-item-1",
        channel: "removed",
        quantity: 5,
        reason: "business_use",
        note: "Uji coba resep",
        idempotencyKey: "fresh-key-abcd",
      },
      session,
    );

    expect(captured.headers?.["Idempotency-Key"]).toBe("fresh-key-abcd");
  });
});