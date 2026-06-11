"use client";

import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useMemo, useState } from "react";
import { isNonEmptyString, isValidFile } from "@/core/utilities/validation-patterns";
import { useCreateBusinessAccount } from "@/features/account/presentation/hooks/use-create-business-account";
import { useOrganizationList } from "@clerk/nextjs";
import { mapSubmitError, ERROR_COPY_NO_VALID_SESSION } from "@/app/(user)/onboarding/account/_lib/map-submit-error";
import { useRouter } from "next/navigation";

export function useBusinessAccountData() {
  const { accountData, updateBusinessData, submitAttempted, markSubmitAttempted } = useCreateAccount();
  const { setActive } = useOrganizationList();
  if (accountData?.type !== "business") throw new ServerError(ErrorCodes.INVALID_BUSINESS_ACCOUNT_HOOK_CALL);

  const { trigger, isMutating } = useCreateBusinessAccount();
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdAccountId, setCreatedAccountId] = useState<string | null>(null);
  const [setActiveAttempts, setSetActiveAttempts] = useState(0);

  const clearSubmitError = () => setSubmitError(null);

  const data = accountData.data;
  const isClean = useMemo(() => {
    return (
      isNonEmptyString(data.companyName) &&
      isNonEmptyString(data.companyEmail) &&
      isNonEmptyString(data.companyPhone) &&
      !!data.companyProvince &&
      !!data.companyCity &&
      !!data.companyDistrict &&
      !!data.companySubdistrict &&
      isNonEmptyString(data.companyAddress) &&
      isValidFile(data.deedOfEstablishment) &&
      isValidFile(data.businessRegistrationNumber) &&
      isValidFile(data.directorNationalIdentityCard) &&
      isValidFile(data.bankStatement)
    );
  }, [
    data.companyName,
    data.companyEmail,
    data.companyPhone,
    data.companyProvince,
    data.companyCity,
    data.companyDistrict,
    data.companySubdistrict,
    data.companyAddress,
    data.deedOfEstablishment,
    data.businessRegistrationNumber,
    data.directorNationalIdentityCard,
    data.bankStatement,
  ]);

  const runCreate = async (): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(new DOMException("TimeoutError", "TimeoutError"));
    }, 60_000);

    try {
      const raceResult = await Promise.race([
        trigger({
          company: {
            name: data.companyName!,
            email: data.companyEmail!,
            phoneNumber: data.companyPhone!,
            address: {
              province: data.companyProvince!,
              city: data.companyCity!,
              district: data.companyDistrict!,
              subdistrict: data.companySubdistrict!,
              address: data.companyAddress!,
            },
            deedOfEstablishment: data.deedOfEstablishment!,
            mostRecentDeedOfAmendment: data.mostRecentDeededOfEstablishment ?? undefined,
            businessIdentificationNumber: data.businessRegistrationNumber!,
            financial: { bankStatement: data.bankStatement! },
          },
          director: {
            nationalIdentityCard: data.directorNationalIdentityCard!,
          },
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
    update: updateBusinessData,
    isClean,
    isCreating: isMutating,
    submit,
    submitError,
    clearSubmitError,
    submitAttempted,
    markSubmitAttempted,
  };
}
