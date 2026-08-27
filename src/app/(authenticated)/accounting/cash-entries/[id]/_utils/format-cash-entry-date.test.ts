import { Settings } from "luxon";
import { describe, expect, it } from "vitest";
import { formatEntryDate, formatTimestamp } from "@/app/(authenticated)/accounting/cash-entries/[id]/_utils/format-cash-entry-date";

// formatTimestamp does not `.setZone()` (mirrors journal-detail-info-card.tsx), so it renders
// in Luxon's default zone — the CI/dev machine's system zone otherwise, which makes an exact
// HH:mm assertion flaky across environments. Pin it so the test is deterministic without
// changing the function's own behavior.
Settings.defaultZone = "Asia/Jakarta";

describe("formatEntryDate", () => {
  it("formats a calendar date in Indonesian locale", () => {
    expect(formatEntryDate("2026-08-27")).toBe("27 Agu 2026");
  });

  it("returns an em-dash for null", () => {
    expect(formatEntryDate(null)).toBe("—");
  });

  it("returns an em-dash for an unparseable string", () => {
    expect(formatEntryDate("not-a-date")).toBe("—");
  });
});

describe("formatTimestamp", () => {
  it("formats a full timestamp in Indonesian locale", () => {
    expect(formatTimestamp("2026-08-27T09:15:00.000+07:00")).toBe("27 Agu 2026, 09:15");
  });

  it("returns an em-dash for null", () => {
    expect(formatTimestamp(null)).toBe("—");
  });

  it("returns an em-dash for an unparseable string", () => {
    expect(formatTimestamp("not-a-date")).toBe("—");
  });
});
