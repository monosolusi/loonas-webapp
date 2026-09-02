import { Settings } from "luxon";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildSourceReferenceDisplay,
  classifyCorrectionCell,
  formatMovementDate,
  resolveSourceRefTypeLabel,
} from "@/app/(authenticated)/balance/_utils/movement-row-display";

describe("classifyCorrectionCell", () => {
  it("returns 'none' when isCorrection is false", () => {
    expect(classifyCorrectionCell({ isCorrection: false, correctsMovementId: null })).toEqual({ kind: "none" });
  });

  it("truncates the correcting movement id to 8 chars with an ellipsis, keeping the full id as title", () => {
    expect(
      classifyCorrectionCell({
        isCorrection: true,
        correctsMovementId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      }),
    ).toEqual({
      kind: "correction",
      label: "a1b2c3d4…",
      title: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    });
  });
});

describe("resolveSourceRefTypeLabel (unrecognised sourceRefType falls back to raw string)", () => {
  it("resolves a known enum member to its Indonesian label", () => {
    expect(resolveSourceRefTypeLabel("payment.pay_in")).toBe("Pembayaran Masuk");
  });

  it("falls back to the raw string for a BE-added enum member the FE has no label for", () => {
    expect(resolveSourceRefTypeLabel("payment.some_future_type")).toBe("payment.some_future_type");
  });
});

describe("buildSourceReferenceDisplay", () => {
  it("composes '{label} · {first 8 chars}…' with the full id as title", () => {
    expect(buildSourceReferenceDisplay("payment.pay_in", "9f8e7d6c-5b4a-3210-9876-543210fedcba")).toEqual({
      label: "Pembayaran Masuk · 9f8e7d6c…",
      title: "9f8e7d6c-5b4a-3210-9876-543210fedcba",
    });
  });

  it("falls back to the raw sourceRefType in the composed label for an unknown type", () => {
    expect(buildSourceReferenceDisplay("payment.unknown", "abcdef12-0000-0000-0000-000000000000")).toEqual({
      label: "payment.unknown · abcdef12…",
      title: "abcdef12-0000-0000-0000-000000000000",
    });
  });
});

describe("formatMovementDate (Indonesian locale is load-bearing)", () => {
  // `DateTime.fromISO` resolves to the RUNNER's default zone, so an input near a day
  // boundary in UTC can format as a different calendar day on a machine at UTC+12/+13.
  // Pin Luxon's default zone for the assertion so the test is deterministic everywhere,
  // without touching the production expression under test.
  const originalDefaultZone = Settings.defaultZone;

  beforeEach(() => {
    Settings.defaultZone = "utc";
  });

  afterEach(() => {
    Settings.defaultZone = originalDefaultZone;
  });

  it("formats an ISO datetime as 'dd MMM yyyy' in Indonesian, not English", () => {
    expect(formatMovementDate("2026-08-26T12:00:00.000Z")).toBe("26 Agu 2026");
  });
});
