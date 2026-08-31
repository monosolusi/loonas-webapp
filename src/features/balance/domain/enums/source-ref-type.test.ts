import { describe, expect, it } from "vitest";
import { SourceRefType } from "@/features/balance/domain/enums/source-ref-type";

/**
 * Pins the enum to the merged balance openapi.yaml (LNS-744 / LNS-753). Deep-equals against
 * an explicit literal array, so a one-sided edit to either the `SourceRefType` declaration
 * or this array fails CI — the FE cannot silently drift from the published contract.
 */
describe("SourceRefType", () => {
  it("declares exactly the members the spec publishes", () => {
    expect(Object.values(SourceRefType)).toEqual(["payment.pay_in"]);
  });

  it("exposes each member as an accessible key", () => {
    expect(SourceRefType.PAYMENT_PAY_IN).toBe("payment.pay_in");
  });
});
