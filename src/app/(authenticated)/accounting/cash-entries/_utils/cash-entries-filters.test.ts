import { describe, expect, it } from "vitest";
import { parseDirectionParam, resolveListParams } from "@/app/(authenticated)/accounting/cash-entries/_utils/cash-entries-filters";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";

describe("parseDirectionParam", () => {
  it("parses 'in' to CashEntryDirection.In", () => {
    expect(parseDirectionParam("in")).toBe(CashEntryDirection.In);
  });

  it("parses 'out' to CashEntryDirection.Out", () => {
    expect(parseDirectionParam("out")).toBe(CashEntryDirection.Out);
  });

  it("resolves null to undefined (no filter)", () => {
    expect(parseDirectionParam(null)).toBeUndefined();
  });

  it("resolves an unknown/stale value to undefined — never throws", () => {
    expect(parseDirectionParam("money_in")).toBeUndefined();
    expect(parseDirectionParam("")).toBeUndefined();
    expect(parseDirectionParam("garbage")).toBeUndefined();
  });
});

describe("resolveListParams", () => {
  it("emits both dateFrom and dateTo when the range is complete", () => {
    const params = resolveListParams({
      page: 2,
      direction: undefined,
      range: { from: new Date(2026, 7, 1), to: new Date(2026, 7, 27) },
    });

    expect(params.dateFrom).toBe("2026-08-01");
    expect(params.dateTo).toBe("2026-08-27");
    expect(params.page).toBe(2);
    expect(params.limit).toBe(DEFAULT_PAGE_SIZE);
  });

  it("emits neither date when the range is a partial pick (from only)", () => {
    const params = resolveListParams({
      page: 1,
      direction: undefined,
      range: { from: new Date(2026, 7, 1), to: undefined },
    });

    expect(params.dateFrom).toBeUndefined();
    expect(params.dateTo).toBeUndefined();
  });

  it("emits neither date when the range is a partial pick (to only)", () => {
    const params = resolveListParams({
      page: 1,
      direction: undefined,
      range: { from: undefined, to: new Date(2026, 7, 27) },
    });

    expect(params.dateFrom).toBeUndefined();
    expect(params.dateTo).toBeUndefined();
  });

  it("emits neither date when both bounds are undefined", () => {
    const params = resolveListParams({ page: 1, direction: undefined, range: { from: undefined, to: undefined } });

    expect(params.dateFrom).toBeUndefined();
    expect(params.dateTo).toBeUndefined();
  });

  it("passes an unknown direction through as undefined (no filter)", () => {
    const params = resolveListParams({
      page: 1,
      direction: undefined,
      range: { from: undefined, to: undefined },
    });

    expect(params.direction).toBeUndefined();
  });

  it("passes a resolved direction through unchanged", () => {
    const params = resolveListParams({
      page: 1,
      direction: CashEntryDirection.Out,
      range: { from: undefined, to: undefined },
    });

    expect(params.direction).toBe(CashEntryDirection.Out);
  });

  it("always uses DEFAULT_PAGE_SIZE as the limit", () => {
    const params = resolveListParams({ page: 5, direction: undefined, range: { from: undefined, to: undefined } });

    expect(params.limit).toBe(DEFAULT_PAGE_SIZE);
  });
});
