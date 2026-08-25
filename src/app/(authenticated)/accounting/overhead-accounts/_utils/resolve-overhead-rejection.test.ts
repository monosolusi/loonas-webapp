import { describe, expect, it } from "vitest";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { resolveOverheadRejection } from "@/app/(authenticated)/accounting/overhead-accounts/_utils/resolve-overhead-rejection";

function notSelectableError(accounts: unknown): ServerError {
  return new ServerError(ErrorCodes.OVERHEAD_ACCOUNT_NOT_SELECTABLE, { accounts });
}

describe("resolveOverheadRejection — 422 OVERHEAD_ACCOUNT_NOT_SELECTABLE", () => {
  it("names every rejected account with its own reason copy", () => {
    const err = notSelectableError([
      { id: "acc-1", code: "1001", name: "Kas", reason: "reserved_code" },
      { id: "acc-2", code: "5100", name: "Beban Sewa", reason: "coa_mapping_target" },
      { id: "acc-3", code: "8110", name: "PPh Final", reason: "system_posting_code" },
    ]);

    const info = resolveOverheadRejection(err);

    expect(info.kind).toBe("not-selectable");
    if (info.kind !== "not-selectable") throw new Error("expected not-selectable");
    expect(info.accounts).toHaveLength(3);
    expect(info.accounts[0]).toEqual({
      id: "acc-1",
      code: "1001",
      name: "Kas",
      reason: "reserved_code",
      message: "Kode akun ini dicadangkan untuk sistem.",
    });
    expect(info.accounts[1].message).toBe("Akun ini menjadi target Pemetaan Akun.");
    expect(info.accounts[2].message).toBe("Akun ini digunakan untuk posting otomatis sistem.");
  });

  it("falls back to a generic reason message for an unrecognised reason value", () => {
    const err = notSelectableError([{ id: "acc-1", code: "1001", name: "Kas", reason: "something_new" }]);

    const info = resolveOverheadRejection(err);

    expect(info.kind).toBe("not-selectable");
    if (info.kind !== "not-selectable") throw new Error("expected not-selectable");
    expect(info.accounts[0].message).toBe("Akun ini tidak dapat dipilih sebagai akun overhead.");
  });
});

describe("resolveOverheadRejection — non-422 errors", () => {
  it("falls back to a generic message for an unrelated ServerError", () => {
    const err = new ServerError(ErrorCodes.VALIDATION_FAILED);

    const info = resolveOverheadRejection(err);

    expect(info).toEqual({ kind: "generic", message: ErrorCodes.VALIDATION_FAILED.message });
  });

  it("falls back to a generic network message for a non-ServerError value", () => {
    const info = resolveOverheadRejection(new Error("network down"));

    expect(info).toEqual({ kind: "generic", message: "Terjadi gangguan jaringan. Silakan coba lagi." });
  });
});

describe("resolveOverheadRejection — malformed 422 shape", () => {
  it("falls back to generic when accounts is missing", () => {
    const err = new ServerError(ErrorCodes.OVERHEAD_ACCOUNT_NOT_SELECTABLE, {});

    const info = resolveOverheadRejection(err);

    expect(info).toEqual({ kind: "generic", message: ErrorCodes.OVERHEAD_ACCOUNT_NOT_SELECTABLE.message });
  });

  it("falls back to generic when accounts is not an array, without crashing", () => {
    const err = notSelectableError({ unexpected: "shape" });

    const info = resolveOverheadRejection(err);

    expect(info).toEqual({ kind: "generic", message: ErrorCodes.OVERHEAD_ACCOUNT_NOT_SELECTABLE.message });
  });

  it("drops malformed entries and falls back to generic when nothing survives parsing", () => {
    const err = notSelectableError([null, "not-an-object", 42]);

    const info = resolveOverheadRejection(err);

    expect(info).toEqual({ kind: "generic", message: ErrorCodes.OVERHEAD_ACCOUNT_NOT_SELECTABLE.message });
  });
});
