"use client";

import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useCallback, useMemo, useState } from "react";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { useCreatePersonalAccount } from "@/features/account/presentation/hooks/use-create-personal-account";
import { useOrganizationList } from "@clerk/nextjs";
import { mapSubmitError, ERROR_COPY_NO_VALID_SESSION } from "@/app/(user)/onboarding/account/_lib/map-submit-error";
import { useRouter } from "next/navigation";
import { resolveDateOfBirth } from "@/app/(user)/onboarding/account/_utils/date-of-birth";
import { FieldIssue, Step } from "@/app/(user)/onboarding/account/_utils/account-form-data";
import {
  PersonalFieldKey,
  resolvePersonalAccountCompleteness,
} from "@/app/(user)/onboarding/account/_utils/personal-account-completeness";
import { SubmitStatus } from "@/app/(user)/onboarding/_utils/submit-status";

/**
 * Provider-internal — owns all personal-account submit state (submit status, error, incomplete
 * issues, created-account id). Must only be called from `PersonalAccountProvider`, which mounts a
 * single instance and shares it via context. Calling this directly from more than one component
 * gives each call site its own `useState`, so submit-status writes made by one component (e.g. the
 * form wrapper) are invisible to another (e.g. the error banner) — the exact bug this provider
 * exists to prevent. Consumers should import `usePersonalAccountData` from
 * `@/app/(user)/onboarding/account/@personalAccount/_providers/personal-account-provider` instead.
 */
export function usePersonalAccountState() {
  const {
    accountData,
    updatePersonalData,
    changeNationality,
    identityNumberCleared,
    currentStep,
    setCurrentStep,
    markStepAttempted,
    showFieldErrors,
  } = useCreateAccount();
  const { setActive } = useOrganizationList();
  if (accountData?.type !== "personal") throw new ServerError(ErrorCodes.INVALID_PERSONAL_ACCOUNT_HOOK_CALL);

  const { trigger } = useCreatePersonalAccount();
  const router = useRouter();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [createdAccountId, setCreatedAccountId] = useState<string | null>(null);
  const [setActiveAttempts, setSetActiveAttempts] = useState(0);

  const clearSubmitError = () => setSubmitError(null);

  const data = accountData.data;

  // Single point of derivation for the birth-date parts → real-date resolution. Both the
  // completeness resolver and `runCreate`'s payload read this SAME resolved value, never re-derive.
  const dateOfBirthResolution = useMemo(() => resolveDateOfBirth(data.dateOfBirth ?? {}), [data.dateOfBirth]);

  // Replaces the old `isClean` boolean. Note what is NOT in here: Clerk's `isLoaded`. Session
  // readiness is not form validity — mixing them is what left the submit button permanently dead
  // for a signed-out visitor with a complete form (QA finding F8). A missing session now fails at
  // submit time with copy that says so, which the user can act on.
  const completeness = useMemo(() => resolvePersonalAccountCompleteness(data), [data]);

  /** The issue for a field, if any — regardless of whether errors are revealed yet. */
  const issueFor = useCallback(
    (field: PersonalFieldKey) => completeness.issues.find((issue) => issue.field === field),
    [completeness],
  );

  /** A field's inline error copy, revealed only once its step has been attempted. */
  const fieldError = useCallback(
    (field: PersonalFieldKey) => (showFieldErrors ? issueFor(field)?.message : undefined),
    [issueFor, showFieldErrors],
  );

  /** The issues belonging to one step — what "Selanjutnya" checks before advancing. */
  const issuesForStep = useCallback(
    (step: Step) => completeness.issues.filter((issue) => issue.step === step),
    [completeness],
  );

  const runCreate = async (): Promise<string> => {
    // Defensive guard — the completeness resolver already gates submit on this same resolution,
    // so this should be unreachable, but never non-null-assert a value that isn't structurally
    // guaranteed to exist.
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
  const incompleteIssues: FieldIssue<PersonalFieldKey>[] = submitAttempted ? completeness.issues : [];

  return {
    data,
    update: updatePersonalData,
    changeNationality,
    identityNumberCleared,
    completeness,
    incompleteIssues,
    issueFor,
    fieldError,
    issuesForStep,
    validateCurrentStep,
    dateOfBirthResolution,
    submitStatus,
    isCreating: submitStatus === "submitting",
    submit,
    submitError,
    clearSubmitError,
    showFieldErrors,
  };
}
