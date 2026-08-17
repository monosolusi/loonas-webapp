import { isNonEmptyString, isValidFile } from "@/core/utilities/validation-patterns";
import {
  AccountCompleteness,
  BusinessAccountData,
  FieldIssue,
  summariseIssues,
} from "@/app/(user)/onboarding/account/_utils/account-form-data";

/**
 * The business twin of `personal-account-completeness.ts`, same contract and same reasoning: the
 * form buffer is the only input, and each field's copy has exactly one owner here.
 *
 * The business submit button had the identical silently-disabled shape (`disabled={!isClean}`
 * over a single 12-condition expression), so it gets the identical treatment — fixing only the
 * personal side would have guaranteed the two drift apart.
 */

export type BusinessFieldKey =
  | "companyName"
  | "companyEmail"
  | "companyPhone"
  | "companyProvince"
  | "companyCity"
  | "companyDistrict"
  | "companySubdistrict"
  | "companyAddress"
  | "deedOfEstablishment"
  | "businessRegistrationNumber"
  | "directorNationalIdentityCard"
  | "bankStatement";

export type BusinessAccountCompleteness = AccountCompleteness<BusinessFieldKey>;

export const BUSINESS_FIELD_LABELS: Record<BusinessFieldKey, string> = {
  companyName: "Nama Perusahaan",
  companyEmail: "Email Perusahaan",
  companyPhone: "Nomor Telepon",
  companyProvince: "Provinsi",
  companyCity: "Kota/Kabupaten",
  companyDistrict: "Kecamatan",
  companySubdistrict: "Kelurahan",
  companyAddress: "Alamat",
  deedOfEstablishment: "Akta Pendirian",
  businessRegistrationNumber: "NIB (Nomor Induk Berusaha)",
  directorNationalIdentityCard: "KTP Direksi",
  bankStatement: "Rekening Koran Bank",
};

export const COPY_COMPANY_NAME_REQUIRED = "Nama perusahaan tidak boleh kosong";
export const COPY_COMPANY_EMAIL_REQUIRED = "Email perusahaan tidak boleh kosong";
export const COPY_COMPANY_PHONE_REQUIRED = "Nomor telepon tidak boleh kosong";
export const COPY_COMPANY_PROVINCE_REQUIRED = "Pilih provinsi";
export const COPY_COMPANY_CITY_REQUIRED = "Pilih kota/kabupaten";
export const COPY_COMPANY_DISTRICT_REQUIRED = "Pilih kecamatan";
export const COPY_COMPANY_SUB_DISTRICT_REQUIRED = "Pilih kelurahan";
export const COPY_COMPANY_ADDRESS_REQUIRED = "Alamat tidak boleh kosong";

/** Every legal document shares one rule, so it shares one message shape. */
export function documentRequiredCopy(label: string): string {
  return `Unggah ${label} (maksimal 5MB)`;
}

export function resolveBusinessAccountCompleteness(data: BusinessAccountData): BusinessAccountCompleteness {
  const issues: FieldIssue<BusinessFieldKey>[] = [];

  const add = (field: BusinessFieldKey, step: FieldIssue<BusinessFieldKey>["step"], message: string) =>
    issues.push({ field, step, label: BUSINESS_FIELD_LABELS[field], message });

  // Step 1 — Profil Perusahaan.
  if (!isNonEmptyString(data.companyName)) add("companyName", "business.personal", COPY_COMPANY_NAME_REQUIRED);
  if (!isNonEmptyString(data.companyEmail)) add("companyEmail", "business.personal", COPY_COMPANY_EMAIL_REQUIRED);
  if (!isNonEmptyString(data.companyPhone)) add("companyPhone", "business.personal", COPY_COMPANY_PHONE_REQUIRED);

  // Step 2 — Alamat Perusahaan.
  if (!data.companyProvince) add("companyProvince", "business.address", COPY_COMPANY_PROVINCE_REQUIRED);
  if (!data.companyCity) add("companyCity", "business.address", COPY_COMPANY_CITY_REQUIRED);
  if (!data.companyDistrict) add("companyDistrict", "business.address", COPY_COMPANY_DISTRICT_REQUIRED);
  if (!data.companySubdistrict) add("companySubdistrict", "business.address", COPY_COMPANY_SUB_DISTRICT_REQUIRED);
  if (!isNonEmptyString(data.companyAddress)) add("companyAddress", "business.address", COPY_COMPANY_ADDRESS_REQUIRED);

  // Step 3 — Dokumen Legal. `mostRecentDeededOfEstablishment` (sic — the buffer's own spelling)
  // is deliberately absent: it is the one optional document, and the payload sends it as
  // `undefined` when unset.
  const requiredDocuments: BusinessFieldKey[] = [
    "deedOfEstablishment",
    "businessRegistrationNumber",
    "directorNationalIdentityCard",
    "bankStatement",
  ];
  for (const field of requiredDocuments) {
    if (!isValidFile(data[field])) {
      add(field, "business.documents", documentRequiredCopy(BUSINESS_FIELD_LABELS[field]));
    }
  }

  return summariseIssues(issues);
}
