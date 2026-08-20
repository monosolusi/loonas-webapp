import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import {
  dateOfBirthErrorCopy,
  DateOfBirthResolution,
  daysInMonth,
  EARLIEST_SELECTABLE_YEAR,
  latestSelectableYear,
  resolveDateOfBirth,
} from "@/app/(user)/onboarding/account/_utils/date-of-birth";

const NOW = DateTime.local(2026, 8, 14);

describe("resolveDateOfBirth — empty and incomplete picks", () => {
  it("is empty when nothing is picked", () => {
    expect(resolveDateOfBirth({}, NOW)).toEqual({ status: "empty" });
  });

  it("is incomplete with only day picked", () => {
    expect(resolveDateOfBirth({ day: 14 }, NOW)).toEqual({ status: "incomplete" });
  });

  it("is incomplete with only month picked", () => {
    expect(resolveDateOfBirth({ month: 8 }, NOW)).toEqual({ status: "incomplete" });
  });

  it("is incomplete with only year picked", () => {
    expect(resolveDateOfBirth({ year: 2000 }, NOW)).toEqual({ status: "incomplete" });
  });

  it("is incomplete with day + month picked", () => {
    expect(resolveDateOfBirth({ day: 14, month: 8 }, NOW)).toEqual({ status: "incomplete" });
  });

  it("is incomplete with day + year picked", () => {
    expect(resolveDateOfBirth({ day: 14, year: 2000 }, NOW)).toEqual({ status: "incomplete" });
  });

  it("is incomplete with month + year picked", () => {
    expect(resolveDateOfBirth({ month: 8, year: 2000 }, NOW)).toEqual({ status: "incomplete" });
  });

  it("never fabricates a missing component into a valid result", () => {
    // A partial pick that WOULD coincidentally be a valid, adult date if defaults were
    // filled in (e.g. day defaulting to 1) must still resolve as incomplete.
    const resolution = resolveDateOfBirth({ month: 1, year: 2000 }, NOW);
    expect(resolution.status).toBe("incomplete");
  });
});

describe("resolveDateOfBirth — invalid calendar dates", () => {
  it("rejects 31 Februari as invalid", () => {
    expect(resolveDateOfBirth({ day: 31, month: 2, year: 2000 }, NOW)).toEqual({ status: "invalid" });
  });

  it("rejects 29 Februari on a non-leap year as invalid", () => {
    expect(resolveDateOfBirth({ day: 29, month: 2, year: 2001 }, NOW)).toEqual({ status: "invalid" });
  });

  it("accepts 29 Februari on a leap year", () => {
    const resolution = resolveDateOfBirth({ day: 29, month: 2, year: 2000 }, NOW);
    expect(resolution.status).toBe("valid");
  });
});

describe("resolveDateOfBirth — minimum age boundary (exact birthday, not year subtraction)", () => {
  it("is valid the day before the 17th birthday's cutoff would make it underage (already past 17)", () => {
    // Born 2009-08-13: already 17 as of 2026-08-14 (birthday was yesterday).
    const resolution = resolveDateOfBirth({ day: 13, month: 8, year: 2009 }, NOW);
    expect(resolution.status).toBe("valid");
  });

  it("is valid exactly on the 17th birthday", () => {
    // Born 2009-08-14: turns exactly 17 today.
    const resolution = resolveDateOfBirth({ day: 14, month: 8, year: 2009 }, NOW);
    expect(resolution.status).toBe("valid");
  });

  it("is underage the day after — 17th birthday hasn't happened yet", () => {
    // Born 2009-08-15: still 16, turns 17 tomorrow.
    expect(resolveDateOfBirth({ day: 15, month: 8, year: 2009 }, NOW)).toEqual({ status: "underage" });
  });

  it("is underage for a birth year that is otherwise old enough but the birthday is later in the year", () => {
    // Born 2010-01-01: 16 years old as of 2026-08-14 (turns 17 in 2027), even though
    // 2026 - 2010 = 16 which already implies underage — this guards against a naive
    // year-subtraction implementation being off by one in the other direction too.
    expect(resolveDateOfBirth({ day: 1, month: 1, year: 2010 }, NOW)).toEqual({ status: "underage" });
  });
});

describe("resolveDateOfBirth — ordinary valid date", () => {
  it("resolves an ordinary adult birth date", () => {
    const resolution = resolveDateOfBirth({ day: 17, month: 5, year: 1990 }, NOW);
    expect(resolution.status).toBe("valid");
    if (resolution.status === "valid") {
      expect(resolution.value.toISODate()).toBe("1990-05-17");
    }
  });
});

describe("latestSelectableYear", () => {
  it("is now.year minus the minimum age", () => {
    expect(latestSelectableYear(NOW)).toBe(2009);
  });
});

describe("EARLIEST_SELECTABLE_YEAR", () => {
  it("is 1900", () => {
    expect(EARLIEST_SELECTABLE_YEAR).toBe(1900);
  });
});

describe("daysInMonth", () => {
  it("defaults to 31 when month is unknown", () => {
    expect(daysInMonth(undefined, undefined)).toBe(31);
    expect(daysInMonth(undefined, 2001)).toBe(31);
  });

  it("uses a leap-year probe when year is unknown, keeping 29 Februari reachable", () => {
    expect(daysInMonth(2, undefined)).toBe(29);
  });

  it("narrows to 28 once a non-leap year is picked", () => {
    expect(daysInMonth(2, 2001)).toBe(28);
  });

  it("stays 29 once a leap year is picked", () => {
    expect(daysInMonth(2, 2000)).toBe(29);
  });

  it("resolves 30 vs 31 day months correctly", () => {
    expect(daysInMonth(4, 2020)).toBe(30);
    expect(daysInMonth(1, 2020)).toBe(31);
  });
});

const EMPTY: DateOfBirthResolution = { status: "empty" };
const INCOMPLETE: DateOfBirthResolution = { status: "incomplete" };
const INVALID: DateOfBirthResolution = { status: "invalid" };
const UNDERAGE: DateOfBirthResolution = { status: "underage" };
const VALID: DateOfBirthResolution = { status: "valid", value: DateTime.local(1990, 5, 17) };

describe("dateOfBirthErrorCopy — day-cleared precedence", () => {
  it("shows the day-cleared message even when showError is false", () => {
    expect(dateOfBirthErrorCopy({ resolution: INCOMPLETE, dayWasCleared: true, showError: false })).toBe(
      "Tanggal tidak tersedia untuk bulan yang dipilih, silakan pilih ulang",
    );
  });

  it("day-cleared beats the incomplete message when both would otherwise apply", () => {
    expect(dateOfBirthErrorCopy({ resolution: INCOMPLETE, dayWasCleared: true, showError: true })).toBe(
      "Tanggal tidak tersedia untuk bulan yang dipilih, silakan pilih ulang",
    );
  });

  it("day-cleared beats every other status too", () => {
    for (const resolution of [EMPTY, INVALID, UNDERAGE, VALID]) {
      expect(dateOfBirthErrorCopy({ resolution, dayWasCleared: true, showError: true })).toBe(
        "Tanggal tidak tersedia untuk bulan yang dipilih, silakan pilih ulang",
      );
    }
  });
});

describe("dateOfBirthErrorCopy — showError gate", () => {
  it("shows nothing when showError is false and the day was not cleared, regardless of status", () => {
    for (const resolution of [EMPTY, INCOMPLETE, INVALID, UNDERAGE, VALID]) {
      expect(dateOfBirthErrorCopy({ resolution, dayWasCleared: false, showError: false })).toBeUndefined();
    }
  });
});

describe("dateOfBirthErrorCopy — status → copy mapping (showError true, day not cleared)", () => {
  it("empty shows nothing", () => {
    expect(dateOfBirthErrorCopy({ resolution: EMPTY, dayWasCleared: false, showError: true })).toBeUndefined();
  });

  it("incomplete", () => {
    expect(dateOfBirthErrorCopy({ resolution: INCOMPLETE, dayWasCleared: false, showError: true })).toBe(
      "Lengkapi tanggal, bulan, dan tahun lahir",
    );
  });

  it("invalid", () => {
    expect(dateOfBirthErrorCopy({ resolution: INVALID, dayWasCleared: false, showError: true })).toBe(
      "Tanggal lahir tidak valid",
    );
  });

  it("underage", () => {
    expect(dateOfBirthErrorCopy({ resolution: UNDERAGE, dayWasCleared: false, showError: true })).toBe(
      "Usia minimal 17 tahun untuk membuka akun",
    );
  });

  it("valid shows nothing", () => {
    expect(dateOfBirthErrorCopy({ resolution: VALID, dayWasCleared: false, showError: true })).toBeUndefined();
  });
});
