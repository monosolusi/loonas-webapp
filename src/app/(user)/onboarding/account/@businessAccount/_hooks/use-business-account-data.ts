"use client";

import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useCallback, useMemo, useState } from "react";
import { useCreateBusinessAccount } from "@/features/account/presentation/hooks/use-create-business-account";
import { useOrganizationList } from "@clerk/nextjs";
import { mapSubmitError, ERROR_COPY_NO_VALID_SESSION } from "@/app/(user)/onboarding/account/_lib/map-submit-error";
import { useRouter } from "next/navigation";
import { FieldIssue, Step } from "@/app/(user)/onboarding/account/_utils/account-form-data";
import {
  BusinessFieldKey,
  resolveBusinessAccountCompleteness,
} from "@/app/(user)/onboarding/account/_utils/business-account-completeness";
import { SubmitStatus } from "@/app/(user)/onboarding/_utils/submit-status";

export function useBusinessAccountData() {
  const { accountData, updateBusinessData, currentStep, setCurrentStep, markStepAttempted, showFieldErrors } =
    useCreateAccount();
  const { setActive } = useOrganizationList();
  if (accountData?.type !== "business") throw new ServerError(ErrorCodes.INVALID_BUSINESS_ACCOUNT_HOOK_CALL);

  const { trigger } = useCreateBusinessAccount();
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [createdAccountId, setCreatedAccountId] = useState<string | null>(null);
  const [setActiveAttempts, setSetActiveAttempts] = useState(0);

  const clearSubmitError = () => setSubmitError(null);

  const data = accountData.data;

  // Replaces the old `isClean` boolean, for the same reason as the personal flow: one boolean
  // over the whole form could only ever render as a grey button, so whichever field was missing,
  // the user saw the same dead end (QA finding F8).
  const completeness = useMemo(() => resolveBusinessAccountCompleteness(data), [data]);

  const issueFor = useCallback(
    (field: BusinessFieldKey) => completeness.issues.find((issue) => issue.field === field),
    [completeness],
  );

  const fieldError = useCallback(
    (field: BusinessFieldKey) => (showFieldErrors ? issueFor(field)?.message : undefined),
    [issueFor, showFieldErrors],
  );

  const issuesForStep = useCallback(
    (step: Step) => completeness.issues.filter((issue) => issue.step === step),
    [completeness],
  );

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

  /**
   * Answers an incomplete form instead of silently refusing it: reveals errors on every step that
   * carries one, and moves the user to the earliest such step so the field is actually on screen.
   */
  const reportIncomplete = (): void => {
    setSubmitError(null);
    setSubmitAttempted(true);
    setSubmitStatus("failed");

    for (const step of new Set(completeness.issues.map((issue) => issue.step))) {
      markStepAttempted?.(step);
    }
    if (completeness.firstIncompleteStep) setCurrentStep?.(completeness.firstIncompleteStep);
  };

  const submit = async (): Promise<void> => {
    setSubmitError(null);

    if (!completeness.isComplete) {
      reportIncomplete();
      return;
    }

    setSubmitStatus("submitting");

    let accountClerkId = createdAccountId;

    if (accountClerkId === null) {
      try {
        accountClerkId = await runCreate();
        setCreatedAccountId(accountClerkId);
      } catch (err) {
        setSubmitError(mapSubmitError(err));
        setSubmitStatus("failed");
        return;
      }
    }

    try {
      await runSetActive(accountClerkId);
      // Terminal: the account exists and the route change is in flight. Never fall back to idle,
      // or the button re-arms mid-redirect and invites a second submit.
      setSubmitStatus("succeeded");
    } catch (err) {
      const nextAttempts = setActiveAttempts + 1;
      setSetActiveAttempts(nextAttempts);
      if (nextAttempts >= 2) {
        setSubmitError(ERROR_COPY_NO_VALID_SESSION);
      } else {
        setSubmitError(mapSubmitError(err));
      }
      setSubmitStatus("failed");
    }
  };

  const validateCurrentStep = (): boolean => {
    if (!currentStep) return false;
    const stepIssues = issuesForStep(currentStep);
    if (stepIssues.length === 0) return true;

    markStepAttempted?.(currentStep);
    return false;
  };

  // Derived live from the current buffer, never snapshotted: the list has to shrink as the user
  // fixes fields and vanish once the form is complete. A snapshot taken at submit time would keep
  // naming fields that have since been filled in.
  const incompleteIssues: FieldIssue<BusinessFieldKey>[] = submitAttempted ? completeness.issues : [];

  return {
    data,
    update: updateBusinessData,
    completeness,
    incompleteIssues,
    issueFor,
    fieldError,
    issuesForStep,
    validateCurrentStep,
    submitStatus,
    isCreating: submitStatus === "submitting",
    submit,
    submitError,
    clearSubmitError,
    showFieldErrors,
  };
}
