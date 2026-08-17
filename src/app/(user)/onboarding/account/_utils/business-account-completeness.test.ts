import { describe, expect, it } from "vitest";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { BusinessAccountData } from "@/app/(user)/onboarding/account/_utils/account-form-data";
import {
  BUSINESS_FIELD_LABELS,
  BusinessFieldKey,
  COPY_COMPANY_NAME_REQUIRED,
  documentRequiredCopy,
  resolveBusinessAccountCompleteness,
} from "@/app/(user)/onboarding/account/_utils/business-account-completeness";

const MAX_FILE_BYTES = 1024 * 1024 * 5;

function fileOfSize(bytes: number): File {
  return new File([new Uint8Array(bytes)], "dokumen.pdf", { type: "application/pdf" });
}

const COMPLETE: BusinessAccountData = {
  companyName: "PT Loonas Jaya",
  companyEmail: "halo@loonas.id",
  companyPhone: "081234567890",
  companyProvince: new ProvinceEntity({ id: "31", label: "DKI Jakarta" }),
  companyCity: new CityEntity({ id: "3171", label: "Jakarta Selatan" }),
  companyDistrict: new DistrictEntity({ id: "317101", label: "Kebayoran Baru" }),
  companySubdistrict: new SubdistrictEntity({ id: "31710101", label: "Senayan" }),
  companyAddress: "Jl. Sudirman No. 1",
  deedOfEstablishment: fileOfSize(1024),
  businessRegistrationNumber: fileOfSize(1024),
  directorNationalIdentityCard: fileOfSize(1024),
  bankStatement: fileOfSize(1024),
};

const fieldsOf = (data: BusinessAccountData): BusinessFieldKey[] =>
  resolveBusinessAccountCompleteness(data).issues.map((issue) => issue.field);

describe("resolveBusinessAccountCompleteness — completeness", () => {
  it("reports a fully filled buffer as complete", () => {
    expect(resolveBusinessAccountCompleteness(COMPLETE)).toEqual({
      issues: [],
      isComplete: true,
      firstIncompleteStep: null,
    });
  });

  it("names every missing field on an empty buffer, in step order", () => {
    expect(fieldsOf({})).toEqual([
      "companyName",
      "companyEmail",
      "companyPhone",
      "companyProvince",
      "companyCity",
      "companyDistrict",
      "companySubdistrict",
      "companyAddress",
      "deedOfEstablishment",
      "businessRegistrationNumber",
      "directorNationalIdentityCard",
      "bankStatement",
    ]);
  });

  it("reports the company-profile step first when the earliest gap is there", () => {
    const noName = { ...COMPLETE, companyName: "" };
    const result = resolveBusinessAccountCompleteness(noName);
    expect(result.firstIncompleteStep).toBe("business.personal");
    expect(result.issues[0].message).toBe(COPY_COMPANY_NAME_REQUIRED);
  });
});

describe("resolveBusinessAccountCompleteness — legal documents", () => {
  it("leaves the amendment deed optional, matching the payload that sends it as undefined", () => {
    const withoutAmendment = { ...COMPLETE, mostRecentDeededOfEstablishment: null };
    expect(resolveBusinessAccountCompleteness(withoutAmendment).isComplete).toBe(true);
  });

  it("names the document that is missing rather than 'a document'", () => {
    const noBankStatement = { ...COMPLETE, bankStatement: null };
    expect(resolveBusinessAccountCompleteness(noBankStatement).issues).toEqual([
      {
        field: "bankStatement",
        step: "business.documents",
        label: BUSINESS_FIELD_LABELS.bankStatement,
        message: documentRequiredCopy(BUSINESS_FIELD_LABELS.bankStatement),
      },
    ]);
  });

  it("rejects a zero-byte and an over-cap document alike", () => {
    expect(fieldsOf({ ...COMPLETE, deedOfEstablishment: fileOfSize(0) })).toEqual(["deedOfEstablishment"]);
    expect(fieldsOf({ ...COMPLETE, deedOfEstablishment: fileOfSize(MAX_FILE_BYTES + 1) })).toEqual([
      "deedOfEstablishment",
    ]);
  });

  it("accepts a document exactly at the 5MB cap", () => {
    const atCap = { ...COMPLETE, bankStatement: fileOfSize(MAX_FILE_BYTES) };
    expect(resolveBusinessAccountCompleteness(atCap).isComplete).toBe(true);
  });
});
