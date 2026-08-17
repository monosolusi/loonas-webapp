import { describe, expect, it } from "vitest";
import { PASSPORT_PATTERN } from "@/features/account/domain/constants/identity-field-limits";
import {
  identityNumberClearedCopy,
  identityNumberErrorCopy,
  resolveNationalityChange,
} from "@/app/(user)/onboarding/account/_utils/nationality-change";
import {
  identityNumberLabel,
  resolvePersonalAccountCompleteness,
} from "@/app/(user)/onboarding/account/_utils/personal-account-completeness";
import { PersonalAccountData } from "@/app/(user)/onboarding/account/_utils/account-form-data";

const COMPLETE: PersonalAccountData = {
  nationality: "WNI",
  fullName: "Budi Santoso",
  identityNumber: "3201234567890123",
  placeOfBirth: "Bandung",
  dateOfBirth: { day: 14, month: 5, year: 2000 },
  address: "Jl. Merdeka No. 1",
};

describe("resolveNationalityChange — the F9 regression", () => {
  it("preserves a filled identity number on the FIRST citizenship selection", () => {
    const result = resolveNationalityChange({ nationality: undefined, identityNumber: "3201234567890123" }, "WNI");
    expect(result.patch).toEqual({ nationality: "WNI" });
    expect(result.patch).not.toHaveProperty("identityNumber");
    expect(result.didClearIdentityNumber).toBe(false);
  });
});

describe("resolveNationalityChange — first selection", () => {
  it("on an empty buffer patches only nationality, with no clear", () => {
    const result = resolveNationalityChange({ nationality: undefined, identityNumber: undefined }, "WNI");
    expect(result.patch).toEqual({ nationality: "WNI" });
    expect(result.didClearIdentityNumber).toBe(false);
  });

  it("preserves a PARTIALLY typed value — only the user may discard their own input", () => {
    const result = resolveNationalityChange({ nationality: undefined, identityNumber: "123" }, "WNI");
    expect(result.patch).toEqual({ nationality: "WNI" });
    expect(result.patch).not.toHaveProperty("identityNumber");
    expect(result.didClearIdentityNumber).toBe(false);
  });
});

describe("resolveNationalityChange — same value re-selected (defensive, unreachable via radios)", () => {
  it("patches nationality only, with no clear", () => {
    const result = resolveNationalityChange({ nationality: "WNI", identityNumber: "3201234567890123" }, "WNI");
    expect(result.patch).toEqual({ nationality: "WNI" });
    expect(result.patch).not.toHaveProperty("identityNumber");
    expect(result.didClearIdentityNumber).toBe(false);
  });
});

describe("resolveNationalityChange — genuine switch with nothing to lose", () => {
  it("clears an empty-string identity number without reporting a clear", () => {
    const result = resolveNationalityChange({ nationality: "WNI", identityNumber: "" }, "WNA");
    expect(result.patch).toEqual({ nationality: "WNA", identityNumber: "" });
    expect(result.didClearIdentityNumber).toBe(false);
  });

  it("clears an undefined identity number without reporting a clear (guards \"\" !== undefined)", () => {
    const result = resolveNationalityChange({ nationality: "WNI", identityNumber: undefined }, "WNA");
    expect(result.patch).toEqual({ nationality: "WNA", identityNumber: "" });
    expect(result.didClearIdentityNumber).toBe(false);
  });
});

describe("resolveNationalityChange — genuine switch with a filled identity number", () => {
  it("clears a filled NIK on WNI -> WNA and reports the clear", () => {
    const result = resolveNationalityChange({ nationality: "WNI", identityNumber: "3201234567890123" }, "WNA");
    expect(result.patch).toEqual({ nationality: "WNA", identityNumber: "" });
    expect(result.didClearIdentityNumber).toBe(true);
  });

  it("clears a filled passport on WNA -> WNI and reports the clear", () => {
    const result = resolveNationalityChange({ nationality: "WNA", identityNumber: "X1234567" }, "WNI");
    expect(result.patch).toEqual({ nationality: "WNI", identityNumber: "" });
    expect(result.didClearIdentityNumber).toBe(true);
  });
});

describe("resolveNationalityChange — why the clear on a genuine switch is load-bearing", () => {
  it("a 16-digit NIK satisfies PASSPORT_PATTERN, so an un-cleared switch would pass validation as a passport", () => {
    expect(PASSPORT_PATTERN.test("3201234567890123")).toBe(true);
    const wouldBeValidIfNotCleared = resolvePersonalAccountCompleteness({ ...COMPLETE, nationality: "WNA" });
    expect(wouldBeValidIfNotCleared.issues.find((issue) => issue.field === "identityNumber")).toBeUndefined();
  });

  it("clears the NIK on the real switch, so it is not silently reused as a passport number", () => {
    const result = resolveNationalityChange({ nationality: "WNI", identityNumber: "3201234567890123" }, "WNA");
    expect(result.patch.identityNumber).toBe("");
    expect(result.didClearIdentityNumber).toBe(true);
  });
});

describe("resolveNationalityChange — purity", () => {
  it("does not mutate its input", () => {
    const current = { nationality: "WNI" as const, identityNumber: "3201234567890123" };
    const snapshot = { ...current };
    resolveNationalityChange(current, "WNA");
    expect(current).toEqual(snapshot);
  });
});

describe("identityNumberClearedCopy", () => {
  it("mentions the WNI label", () => {
    expect(identityNumberClearedCopy("WNI")).toContain(identityNumberLabel("WNI"));
  });

  it("mentions the WNA label", () => {
    expect(identityNumberClearedCopy("WNA")).toContain(identityNumberLabel("WNA"));
  });
});

describe("identityNumberErrorCopy", () => {
  it("the cleared notice wins over issue copy when showError is true", () => {
    expect(
      identityNumberErrorCopy({ clearedNotice: "cleared", issueCopy: "issue", showError: true }),
    ).toBe("cleared");
  });

  it("the cleared notice still renders when showError is false (ungated precedence)", () => {
    expect(
      identityNumberErrorCopy({ clearedNotice: "cleared", issueCopy: "issue", showError: false }),
    ).toBe("cleared");
  });

  it("showError false with no notice returns undefined", () => {
    expect(identityNumberErrorCopy({ issueCopy: "issue", showError: false })).toBeUndefined();
  });

  it("showError true with no notice returns the issue copy verbatim", () => {
    expect(identityNumberErrorCopy({ issueCopy: "issue", showError: true })).toBe("issue");
  });

  it("nothing at all returns undefined", () => {
    expect(identityNumberErrorCopy({ showError: false })).toBeUndefined();
  });
});
