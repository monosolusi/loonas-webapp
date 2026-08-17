import { DateTime } from "luxon";
import { isNonEmptyString, isValidFile } from "@/core/utilities/validation-patterns";
import { NIK_PATTERN, PASSPORT_PATTERN } from "@/features/account/domain/constants/identity-field-limits";
import {
  AccountCompleteness,
  FieldIssue,
  PersonalAccountData,
  summariseIssues,
} from "@/app/(user)/onboarding/account/_utils/account-form-data";
import { dateOfBirthIssueCopy, resolveDateOfBirth } from "@/app/(user)/onboarding/account/_utils/date-of-birth";

/**
 * Every gate on the personal-account form, as data rather than as one boolean.
 *
 * This replaces a 13-condition `isClean` useMemo that spanned all three wizard steps and whose
 * only output was `disabled={!isClean}` — so whichever condition failed, the user saw the same
 * grey button and had no way to find out which. That was QA finding F8. Two rules follow from it
 * and both are load-bearing:
 *
 *  1. The input is the form buffer and NOTHING else. The old expression ended in `&& isLoaded`
 *     from Clerk's `useOrganizationList()`, which never becomes true for a signed-out visitor and
 *     reverts to false while auth state updates — a permanently dead button for a form that was
 *     actually complete. Session readiness is not form validity; making the buffer the only input
 *     makes that class of bug unrepresentable here.
 *  2. This module owns each field's copy. The banner's missing-field list and the field's own
 *     inline error read the same `FieldIssue`, so they cannot drift.
 */

export type PersonalFieldKey =
  | "nationality"
  | "fullName"
  | "identityNumber"
  | "occupation"
  | "placeOfBirth"
  | "dateOfBirth"
  | "province"
  | "city"
  | "district"
  | "subDistrict"
  | "address"
  | "identityFile";

export type PersonalAccountCompleteness = AccountCompleteness<PersonalFieldKey>;

export const PERSONAL_FIELD_LABELS: Record<PersonalFieldKey, string> = {
  nationality: "Status Kewarganegaraan",
  fullName: "Nama Lengkap",
  identityNumber: "Nomor Identitas",
  occupation: "Pekerjaan",
  placeOfBirth: "Tempat Lahir",
  dateOfBirth: "Tanggal Lahir",
  province: "Provinsi",
  city: "Kota/Kabupaten",
  district: "Kecamatan",
  subDistrict: "Kelurahan",
  address: "Alamat",
  identityFile: "Dokumen Identitas / KTP",
};

export const COPY_NATIONALITY_REQUIRED = "Pilih status kewarganegaraan Anda";
export const COPY_FULL_NAME_REQUIRED = "Nama lengkap tidak boleh kosong";
// Mirrors `identity-number-input.tsx`, which switches both its label and its error on nationality.
export const COPY_NIK_INVALID = "NIK harus terdiri dari 16 digit";
export const COPY_PASSPORT_INVALID = "Nomor paspor tidak boleh kosong";
export const COPY_OCCUPATION_REQUIRED = "Pilih pekerjaan Anda";
export const COPY_PLACE_OF_BIRTH_REQUIRED = "Tempat lahir tidak boleh kosong";
export const COPY_PROVINCE_REQUIRED = "Pilih provinsi";
export const COPY_CITY_REQUIRED = "Pilih kota/kabupaten";
export const COPY_DISTRICT_REQUIRED = "Pilih kecamatan";
export const COPY_SUB_DISTRICT_REQUIRED = "Pilih kelurahan";
export const COPY_ADDRESS_REQUIRED = "Alamat tidak boleh kosong";
export const COPY_IDENTITY_FILE_REQUIRED = "Unggah dokumen identitas / KTP (maksimal 5MB)";

/** The identity field is labelled by nationality, exactly as the input itself is. */
export function identityNumberLabel(nationality: string | undefined): string {
  return nationality === "WNA" ? "Nomor Paspor" : "Nomor Induk Kependudukan (NIK)";
}

export function resolvePersonalAccountCompleteness(
  data: PersonalAccountData,
  now: DateTime = DateTime.now(),
): PersonalAccountCompleteness {
  const issues: FieldIssue<PersonalFieldKey>[] = [];

  const add = (field: PersonalFieldKey, step: FieldIssue<PersonalFieldKey>["step"], message: string, label?: string) =>
    issues.push({ field, step, label: label ?? PERSONAL_FIELD_LABELS[field], message });

  // Step 1 — Data Diri, in the order the fields appear on screen.
  const isWNA = data.nationality === "WNA";

  if (!isNonEmptyString(data.nationality)) {
    add("nationality", "personal.personal", COPY_NATIONALITY_REQUIRED);
  }

  if (!isNonEmptyString(data.fullName)) {
    add("fullName", "personal.personal", COPY_FULL_NAME_REQUIRED);
  }

  const identityPattern = isWNA ? PASSPORT_PATTERN : NIK_PATTERN;
  if (!identityPattern.test(data.identityNumber ?? "")) {
    add(
      "identityNumber",
      "personal.personal",
      isWNA ? COPY_PASSPORT_INVALID : COPY_NIK_INVALID,
      identityNumberLabel(data.nationality),
    );
  }

  if (!data.occupation) {
    add("occupation", "personal.personal", COPY_OCCUPATION_REQUIRED);
  }

  if (!isNonEmptyString(data.placeOfBirth)) {
    add("placeOfBirth", "personal.personal", COPY_PLACE_OF_BIRTH_REQUIRED);
  }

  // Derived through the single birth-date owner — never re-spelled here, so the gate and the
  // submitted payload can never disagree about what date was chosen.
  const dateOfBirthCopy = dateOfBirthIssueCopy(resolveDateOfBirth(data.dateOfBirth ?? {}, now));
  if (dateOfBirthCopy) {
    add("dateOfBirth", "personal.personal", dateOfBirthCopy);
  }

  // Step 2 — Alamat Domisili.
  if (!data.province) add("province", "personal.address", COPY_PROVINCE_REQUIRED);
  if (!data.city) add("city", "personal.address", COPY_CITY_REQUIRED);
  if (!data.district) add("district", "personal.address", COPY_DISTRICT_REQUIRED);
  if (!data.subDistrict) add("subDistrict", "personal.address", COPY_SUB_DISTRICT_REQUIRED);
  if (!isNonEmptyString(data.address)) add("address", "personal.address", COPY_ADDRESS_REQUIRED);

  // Step 3 — Upload Dokumen. `isValidFile` already means "a real File, non-empty, within 5MB";
  // the old hook hand-inlined those same four clauses instead of calling it.
  if (!isValidFile(data.identityFile)) {
    add("identityFile", "personal.documents", COPY_IDENTITY_FILE_REQUIRED);
  }

  return summariseIssues(issues);
}
