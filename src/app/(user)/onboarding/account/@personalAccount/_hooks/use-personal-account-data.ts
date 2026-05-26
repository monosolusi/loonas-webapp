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
      !!data.dateOfBirth &&
      data.dateOfBirth.isValid === true &&
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
    data.dateOfBirth,
    data.province,
    data.city,
    data.district,
    data.subDistrict,
    data.address,
    data.identityFile,
    isLoaded,
  ]);

  const runCreate = async (): Promise<string> => {
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
            dateOfBirth: data.dateOfBirth!,
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
    isCreating: isMutating,
    submit,
    submitError,
    clearSubmitError,
    submitAttempted,
    markSubmitAttempted,
  };
}
