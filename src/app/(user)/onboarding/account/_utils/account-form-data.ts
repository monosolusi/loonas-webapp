import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { DateOfBirthParts } from "@/app/(user)/onboarding/account/_utils/date-of-birth";

/**
 * The account-creation wizard's vocabulary and form buffers.
 *
 * These live in a plain `.ts` module rather than in `_providers/create-account.tsx` on purpose:
 * the vitest suite is node-env and its include glob matches `src/**\/*.test.ts` only, so a pure
 * resolver that took its input type from a `.tsx` provider would drag a React module into a suite
 * that cannot render one. Keeping the buffer types here is what makes the completeness resolvers
 * (and their tests) possible at all.
 */

export type AccountType = "personal" | "business";

export type PersonalStep = "personal.personal" | "personal.address" | "personal.documents";
export type BusinessStep = "business.personal" | "business.address" | "business.documents";
export type Step = PersonalStep | BusinessStep;

export const ACCOUNT_STEPS: Record<AccountType, Step[]> = {
  personal: ["personal.personal", "personal.address", "personal.documents"],
  business: ["business.personal", "business.address", "business.documents"],
} as const;

/**
 * Human name of each step, mirroring the heading each step page renders. The submit banner names
 * the step a missing field belongs to, so this map and those headings must not drift.
 */
export const STEP_LABELS: Record<Step, string> = {
  "personal.personal": "Data Diri",
  "personal.address": "Alamat Domisili",
  "personal.documents": "Upload Dokumen",
  "business.personal": "Profil Perusahaan",
  "business.address": "Alamat Perusahaan",
  "business.documents": "Dokumen Legal",
} as const;

export type BusinessAccountData = {
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyProvince?: ProvinceEntity;
  companyCity?: CityEntity;
  companyDistrict?: DistrictEntity;
  companySubdistrict?: SubdistrictEntity;
  companyAddress?: string;
  deedOfEstablishment?: File | null;
  mostRecentDeededOfEstablishment?: File | null;
  businessRegistrationNumber?: File | null;
  directorNationalIdentityCard?: File | null;
  bankStatement?: File | null;
};

export type PersonalAccountData = {
  nationality?: string;
  identityFile?: File | null;
  identityNumber?: string;
  fullName?: string;
  occupation?: OccupationEntity;
  placeOfBirth?: string;
  // Raw three-part form buffer — the provider holds this, never the derived DateTime.
  // See `resolveDateOfBirth` for the single-owner derivation.
  dateOfBirth?: DateOfBirthParts;
  province?: ProvinceEntity;
  city?: CityEntity;
  district?: DistrictEntity;
  subDistrict?: SubdistrictEntity;
  address?: string;
};

export type AccountData =
  | { type: "personal"; data: PersonalAccountData }
  | { type: "business"; data: BusinessAccountData };

/**
 * One missing/invalid field, as reported by a completeness resolver.
 *
 * `label` is the field's human name (for the submit banner's list) and `message` is the inline
 * error copy the field itself renders. Both live here so a field's inline message and the banner
 * entry can never disagree — the copy has exactly one owner.
 */
export type FieldIssue<K extends string = string> = {
  field: K;
  step: Step;
  label: string;
  message: string;
};

/**
 * Shared result shape of both completeness resolvers.
 *
 * `firstIncompleteStep` is what the submit handler navigates to, so the offending field is on
 * screen when its error is revealed — the previous design blocked submit on a field that lived on
 * a step the user could not see.
 */
export type AccountCompleteness<K extends string> = {
  issues: FieldIssue<K>[];
  isComplete: boolean;
  firstIncompleteStep: Step | null;
};

/** Derives the summary fields both resolvers return from an already step-ordered issue list. */
export function summariseIssues<K extends string>(issues: FieldIssue<K>[]): AccountCompleteness<K> {
  return {
    issues,
    isComplete: issues.length === 0,
    firstIncompleteStep: issues[0]?.step ?? null,
  };
}
