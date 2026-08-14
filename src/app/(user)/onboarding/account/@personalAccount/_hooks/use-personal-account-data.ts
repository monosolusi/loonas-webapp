"use client";

import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useMemo, useState } from "react";
import { isNonEmptyString } from "@/core/utilities/validation-patterns";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { useCreatePersonalAccount } from "@/features/account/presentation/hooks/use-create-personal-account";
import { useOrganizationList } from "@clerk/nextjs";
import { NIK_PATTERN, PASSPORT_PATTERN } from "@/features/account/domain/constants/identity-field-limits";
import { mapSubmitError, ERROR_COPY_NO_VALID_SESSION } from "@/app/(user)/onboarding/account/_lib/map-submit-error";
import { useRouter } from "next/navigation";
import { resolveDateOfBirth } from "@/app/(user)/onboarding/account/_utils/date-of-birth";

export function usePersonalAccountData() {
  const { accountData, updatePersonalData, submitAttempted, markSubmitAttempted } = useCreateAccount();
  const { isLoaded, setActive } = useOrganizationList();
  if (accountData?.type !== "personal") throw new ServerError(ErrorCodes.INVALID_PERSONAL_ACCOUNT_HOOK_CALL);

  const { trigger, isMutating } = useCreatePersonalAccount();
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdAccountId, setCreatedAccountId] = useState<string | null>(null);
  const [setActiveAttempts, setSetActiveAttempts] = useState(0);

  const clearSubmitError = () => setSubmitError(null);

  const data = accountData.data;

  // Single point of derivation for the birth-date parts → real-date resolution. Both the
  // `isClean` gate and `runCreate`'s payload read this SAME resolved value, never re-derive.
  const dateOfBirthResolution = useMemo(() => resolveDateOfBirth(data.dateOfBirth ?? {}), [data.dateOfBirth]);

  const isClean = useMemo(() => {
    return (
      isNonEmptyString(data.nationality) &&
      isNonEmptyString(data.fullName) &&
      isNonEmptyString(data.identityNumber) &&
      (data.nationality === "WNA"
        ? PASSPORT_PATTERN.test(data.identityNumber ?? "")
        : NIK_PATTERN.test(data.identityNumber ?? "")) &&
      !!data.occupation &&
      isNonEmptyString(data.placeOfBirth) &&
      dateOfBirthResolution.status === "valid" &&
      !!data.province &&
      !!data.city &&
      !!data.district &&
      !!data.subDistrict &&
      isNonEmptyString(data.address) &&
      !!data.identityFile &&
      data.identityFile instanceof File &&
      data.identityFile.size > 0 &&
      data.identityFile.size <= 1024 * 1024 * 5 &&
      isLoaded
    );
  }, [
    data.nationality,
    data.fullName,
    data.identityNumber,
    data.occupation,
    data.placeOfBirth,
    dateOfBirthResolution,
    data.province,
    data.city,
    data.district,
    data.subDistrict,
    data.address,
    data.identityFile,
    isLoaded,
  ]);

  const runCreate = async (): Promise<string> => {
    // Defensive guard — `isClean` already gates the submit button on this same
    // resolution, so this should be unreachable, but never non-null-assert a value
    // that isn't structurally guaranteed to exist.
    if (dateOfBirthResolution.status !== "valid") throw new ServerError(ErrorCodes.VALIDATION_FAILED);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(new DOMException("TimeoutError", "TimeoutError"));
    }, 60_000);

    try {
      const raceResult = await Promise.race([
        trigger({
          personal: {
            nationality: data.nationality!,
            fullName: data.fullName!,
            idNumber: data.identityNumber!,
            occupation: data.occupation!,
            placeOfBirth: data.placeOfBirth!,
            dateOfBirth: dateOfBirthResolution.value,
          },
          address: {
            province: data.province!,
            city: data.city!,
            district: data.district!,
            subdistrict: data.subDistrict!,
            address: data.address!,
          },
          documents: { idFile: data.identityFile! },
        }),
        new Promise<never>((_, reject) =>
          controller.signal.addEventListener("abort", () =>
            reject(new DOMException("TimeoutError", "TimeoutError")),
          ),
        ),
      ]);
      clearTimeout(timeoutId);
      return raceResult.metadata.clerkId;
    } catch (err) {
      clearTimeout(timeoutId);
      controller.abort();
      throw err;
    }
  };

  const runSetActive = async (clerkId: string): Promise<void> => {
    if (!setActive) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    await setActive({ organization: clerkId });
    router.push("/onboarding/kyc-summary");
  };

  const submit = async (): Promise<void> => {
    setSubmitError(null);

    let accountClerkId = createdAccountId;

    if (accountClerkId === null) {
      try {
        accountClerkId = await runCreate();
        setCreatedAccountId(accountClerkId);
      } catch (err) {
        setSubmitError(mapSubmitError(err));
        return;
      }
    }

    try {
      await runSetActive(accountClerkId);
    } catch (err) {
      const nextAttempts = setActiveAttempts + 1;
      setSetActiveAttempts(nextAttempts);
      if (nextAttempts >= 2) {
        setSubmitError(ERROR_COPY_NO_VALID_SESSION);
      } else {
        setSubmitError(mapSubmitError(err));
      }
    }
  };

  return {
    data,
    update: updatePersonalData,
    isClean,
    dateOfBirthResolution,
    isCreating: isMutating,
    submit,
    submitError,
    clearSubmitError,
    submitAttempted,
    markSubmitAttempted,
  };
}
