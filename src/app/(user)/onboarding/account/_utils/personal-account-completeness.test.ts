import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { PersonalAccountData } from "@/app/(user)/onboarding/account/_utils/account-form-data";
import { NIK_PATTERN, PASSPORT_PATTERN } from "@/features/account/domain/constants/identity-field-limits";
import {
  COPY_ADDRESS_REQUIRED,
  COPY_IDENTITY_FILE_REQUIRED,
  COPY_NATIONALITY_REQUIRED,
  COPY_NIK_INVALID,
  COPY_PASSPORT_INVALID,
  PersonalFieldKey,
  identityNumberPattern,
  resolvePersonalAccountCompleteness,
  sanitizeIdentityNumber,
} from "@/app/(user)/onboarding/account/_utils/personal-account-completeness";
import {
  DOB_COPY_INCOMPLETE,
  DOB_COPY_UNDERAGE,
} from "@/app/(user)/onboarding/account/_utils/date-of-birth";

const NOW = DateTime.local(2026, 8, 14);
const MAX_FILE_BYTES = 1024 * 1024 * 5;

function fileOfSize(bytes: number): File {
  return new File([new Uint8Array(bytes)], "ktp.jpg", { type: "image/jpeg" });
}

const COMPLETE: PersonalAccountData = {
  nationality: "WNI",
  fullName: "Budi Santoso",
  identityNumber: "3201234567890123",
  occupation: new OccupationEntity({ id: "occ-1", label: "Wiraswasta" }),
  placeOfBirth: "Bandung",
  dateOfBirth: { day: 14, month: 5, year: 2000 },
  province: new ProvinceEntity({ id: "31", label: "DKI Jakarta" }),
  city: new CityEntity({ id: "3171", label: "Jakarta Selatan" }),
  district: new DistrictEntity({ id: "317101", label: "Kebayoran Baru" }),
  subDistrict: new SubdistrictEntity({ id: "31710101", label: "Senayan" }),
  address: "Jl. Merdeka No. 1",
  identityFile: fileOfSize(1024),
};

const fieldsOf = (data: PersonalAccountData): PersonalFieldKey[] =>
  resolvePersonalAccountCompleteness(data, NOW).issues.map((issue) => issue.field);

describe("resolvePersonalAccountCompleteness — the F8 regression", () => {
  it("takes the form buffer as its only input, so no session state can ever gate the form", () => {
    // The expression this replaced ended in `&& isLoaded` from Clerk's useOrganizationList(),
    // which never becomes true for a signed-out visitor and reverts to false while auth state
    // updates — a permanently disabled submit button on a form that was actually complete, with
    // nothing on screen to explain it. A complete buffer must be complete, full stop.
    expect(resolvePersonalAccountCompleteness(COMPLETE, NOW)).toEqual({
      issues: [],
      isComplete: true,
      firstIncompleteStep: null,
    });
  });

  it("names every missing field rather than collapsing them to one boolean", () => {
    const result = resolvePersonalAccountCompleteness({}, NOW);
    expect(result.isComplete).toBe(false);
    expect(result.issues).toHaveLength(12);
    for (const issue of result.issues) {
      expect(issue.label.length).toBeGreaterThan(0);
      expect(issue.message.length).toBeGreaterThan(0);
    }
  });

  it("orders issues by step so the first one is the earliest step the user must return to", () => {
    expect(fieldsOf({})).toEqual([
      "nationality",
      "fullName",
      "identityNumber",
      "occupation",
      "placeOfBirth",
      "dateOfBirth",
      "province",
      "city",
      "district",
      "subDistrict",
      "address",
      "identityFile",
    ]);
  });
});

describe("resolvePersonalAccountCompleteness — firstIncompleteStep", () => {
  it("is the earliest step carrying an issue, not the step the user is standing on", () => {
    // The whole point: a KTP uploaded on step 3 cannot rescue a blank field on step 1, and the
    // handler has to navigate the user back to where that field actually lives.
    const missingPlaceOfBirth = { ...COMPLETE, placeOfBirth: "" };
    expect(resolvePersonalAccountCompleteness(missingPlaceOfBirth, NOW).firstIncompleteStep).toBe("personal.personal");
  });

  it("points at the address step when only address data is missing", () => {
    const missingSubDistrict = { ...COMPLETE, subDistrict: undefined };
    expect(resolvePersonalAccountCompleteness(missingSubDistrict, NOW).firstIncompleteStep).toBe("personal.address");
  });

  it("points at the documents step when only the KTP is missing", () => {
    const missingFile = { ...COMPLETE, identityFile: null };
    const result = resolvePersonalAccountCompleteness(missingFile, NOW);
    expect(result.firstIncompleteStep).toBe("personal.documents");
    expect(result.issues).toEqual([
      {
        field: "identityFile",
        step: "personal.documents",
        label: "Dokumen Identitas / KTP",
        message: COPY_IDENTITY_FILE_REQUIRED,
      },
    ]);
  });

  it("is null when nothing is missing", () => {
    expect(resolvePersonalAccountCompleteness(COMPLETE, NOW).firstIncompleteStep).toBeNull();
  });
});

describe("resolvePersonalAccountCompleteness — identity number by nationality", () => {
  it("requires a 16-digit NIK for WNI and says so", () => {
    const shortNik = { ...COMPLETE, identityNumber: "320123" };
    const issue = resolvePersonalAccountCompleteness(shortNik, NOW).issues[0];
    expect(issue.field).toBe("identityNumber");
    expect(issue.message).toBe(COPY_NIK_INVALID);
    expect(issue.label).toBe("Nomor Induk Kependudukan (NIK)");
  });

  it("accepts an alphanumeric passport for WNA, which the NIK rule would have rejected", () => {
    const wna: PersonalAccountData = { ...COMPLETE, nationality: "WNA", identityNumber: "X1234567" };
    expect(resolvePersonalAccountCompleteness(wna, NOW).isComplete).toBe(true);
  });

  it("reports the passport copy and label for an empty WNA identity number", () => {
    const wna: PersonalAccountData = { ...COMPLETE, nationality: "WNA", identityNumber: "" };
    const issue = resolvePersonalAccountCompleteness(wna, NOW).issues[0];
    expect(issue.message).toBe(COPY_PASSPORT_INVALID);
    expect(issue.label).toBe("Nomor Paspor");
  });

  it("reports nationality itself when it has never been chosen", () => {
    const noNationality = { ...COMPLETE, nationality: undefined };
    const issue = resolvePersonalAccountCompleteness(noNationality, NOW).issues[0];
    expect(issue.field).toBe("nationality");
    expect(issue.message).toBe(COPY_NATIONALITY_REQUIRED);
  });
});

describe("resolvePersonalAccountCompleteness — birth date", () => {
  it("treats a partially picked date as incomplete and never fabricates the missing parts", () => {
    // The F2 regression: picking only a year used to commit 1 Januari of the current year and
    // pass the submit gate — a KYC birth date the user never entered.
    const yearOnly = { ...COMPLETE, dateOfBirth: { year: 2000 } };
    const issue = resolvePersonalAccountCompleteness(yearOnly, NOW).issues[0];
    expect(issue.field).toBe("dateOfBirth");
    expect(issue.message).toBe(DOB_COPY_INCOMPLETE);
  });

  it("treats an untouched date as a blocker even though the field renders no inline error yet", () => {
    const noDate = { ...COMPLETE, dateOfBirth: undefined };
    expect(fieldsOf(noDate)).toEqual(["dateOfBirth"]);
  });

  it("enforces the age floor against the injected now, not the wall clock", () => {
    const tooYoung = { ...COMPLETE, dateOfBirth: { day: 14, month: 8, year: 2015 } };
    const issue = resolvePersonalAccountCompleteness(tooYoung, NOW).issues[0];
    expect(issue.message).toBe(DOB_COPY_UNDERAGE);
  });
});

describe("resolvePersonalAccountCompleteness — identity file", () => {
  it("rejects a zero-byte file with exactly one issue", () => {
    const empty = { ...COMPLETE, identityFile: fileOfSize(0) };
    expect(fieldsOf(empty)).toEqual(["identityFile"]);
  });

  it("rejects a file one byte over the 5MB cap", () => {
    const tooBig = { ...COMPLETE, identityFile: fileOfSize(MAX_FILE_BYTES + 1) };
    expect(fieldsOf(tooBig)).toEqual(["identityFile"]);
  });

  it("accepts a file exactly at the cap", () => {
    const atCap = { ...COMPLETE, identityFile: fileOfSize(MAX_FILE_BYTES) };
    expect(resolvePersonalAccountCompleteness(atCap, NOW).isComplete).toBe(true);
  });
});

describe("resolvePersonalAccountCompleteness — whitespace", () => {
  it("does not accept a whitespace-only address as filled in", () => {
    const blank = { ...COMPLETE, address: "   " };
    const issue = resolvePersonalAccountCompleteness(blank, NOW).issues[0];
    expect(issue.field).toBe("address");
    expect(issue.message).toBe(COPY_ADDRESS_REQUIRED);
  });
});

describe("sanitizeIdentityNumber", () => {
  it("strips non-digits for WNI", () => {
    expect(sanitizeIdentityNumber("32-01 23a4567890123", "WNI")).toBe("3201234567890123");
  });

  it("caps at 16 characters for WNI", () => {
    expect(sanitizeIdentityNumber("123456789012345678", "WNI")).toBe("1234567890123456");
  });

  it("keeps alphanumerics and strips punctuation/spaces for WNA", () => {
    expect(sanitizeIdentityNumber("X-1234 5678!", "WNA")).toBe("X12345678");
  });

  it("caps at 16 characters for WNA", () => {
    expect(sanitizeIdentityNumber("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "WNA")).toBe("ABCDEFGHIJKLMNOP");
  });

  it("treats an undefined nationality as WNI", () => {
    expect(sanitizeIdentityNumber("32-0123", undefined)).toBe("320123");
  });
});

describe("identityNumberPattern", () => {
  it("returns the NIK pattern for an undefined nationality", () => {
    expect(identityNumberPattern(undefined)).toBe(NIK_PATTERN);
  });

  it("returns the NIK pattern for WNI", () => {
    expect(identityNumberPattern("WNI")).toBe(NIK_PATTERN);
  });

  it("returns the passport pattern for WNA", () => {
    expect(identityNumberPattern("WNA")).toBe(PASSPORT_PATTERN);
  });
});
