"use client";

import React, { useCallback } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  ACCOUNT_STEPS,
  AccountData,
  AccountType,
  BusinessAccountData,
  PersonalAccountData,
  Step,
} from "@/app/(user)/onboarding/account/_utils/account-form-data";
import { Nationality } from "@/app/(user)/onboarding/account/_utils/personal-account-completeness";
import { resolveNationalityChange } from "@/app/(user)/onboarding/account/_utils/nationality-change";

type CreateAccountContextProps = {
  type?: AccountType;
  currentStep?: Step;
  setType?: React.Dispatch<React.SetStateAction<AccountType | undefined>>;
  setCurrentStep?: React.Dispatch<React.SetStateAction<Step | undefined>>;
  nextStep?: () => void;
  prevStep?: () => void;
  accountData?: AccountData;
  updatePersonalData?: (data: Partial<PersonalAccountData>) => void;
  updateBusinessData?: (data: Partial<BusinessAccountData>) => void;
  /**
   * The ONLY writer of the nationality/identityNumber pair — see `resolveNationalityChange` for
   * why a first selection preserves the identity number (QA finding F9) while a genuine switch
   * clears it. Kept off `updatePersonalData` so that invariant lives with the buffer owner
   * instead of being re-derived at a UI call site.
   */
  changeNationality?: (next: Nationality) => void;
  /** Set by `changeNationality` when a genuine switch just cleared a filled identity number. */
  identityNumberCleared?: boolean;
  /** Ends the cleared notice once the user edits the field it refers to. */
  dismissIdentityNumberCleared?: () => void;
  /** Steps the user has already tried to leave or submit from. */
  attemptedSteps?: Step[];
  markStepAttempted?: (step: Step) => void;
  /** Whether the CURRENT step's fields may render their validation errors yet. */
  showFieldErrors?: boolean;
};

type CreateAccountProviderProps = {
  children: React.ReactNode;
};

const CreateAccountContext = React.createContext<CreateAccountContextProps>({});

export function CreateAccountProvider(props: CreateAccountProviderProps) {
  const [type, setType] = React.useState<AccountType>();
  const [currentStep, setCurrentStep] = React.useState<Step>();
  const [personalData, setPersonalData] = React.useState<PersonalAccountData>({});
  const [businessData, setBusinessData] = React.useState<BusinessAccountData>({});

  // Error revelation is tracked PER STEP, not as one global "submit was attempted" latch. With a
  // single latch, pressing "Selanjutnya" on step 1 would light up step 2's untouched fields the
  // moment the user arrived there — errors for data they had not been asked for yet. Every field
  // renders only on its own step, so "this step has been attempted" is exactly the right scope.
  const [attemptedSteps, setAttemptedSteps] = React.useState<Step[]>([]);

  const markStepAttempted = useCallback((step: Step) => {
    setAttemptedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  }, []);

  const showFieldErrors = !!currentStep && attemptedSteps.includes(currentStep);

  const nextStep = () => {
    // Type and currentStep are guaranteed to be filled after type selection
    const steps = ACCOUNT_STEPS[type!];
    const currentIndex = steps.indexOf(currentStep!);
    const nextIndex = currentIndex + 1;

    if (nextIndex < steps.length) setCurrentStep(steps[nextIndex]);
  };

  const prevStep = () => {
    const steps = ACCOUNT_STEPS[type!];
    const currentIndex = steps.indexOf(currentStep!);
    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      setType(undefined);
      setCurrentStep(undefined);
    } else setCurrentStep(steps[prevIndex]);
  };

  const updatePersonalData = (data: Partial<PersonalAccountData>) => {
    setPersonalData((prev) => ({ ...prev, ...data }));
  };

  // Set only by `changeNationality`. This is a LATCH, not a derived value, so it needs an explicit
  // end: `identity-number-input.tsx` also guards on `value === ""`, but that guard alone is
  // one-way — after the user refills the field and then deletes it back to empty, the latch would
  // still be true and the notice would falsely reappear claiming a citizenship change that
  // happened several edits ago. The field's own edit path dismisses it instead.
  const [identityNumberCleared, setIdentityNumberCleared] = React.useState(false);

  const dismissIdentityNumberCleared = () => setIdentityNumberCleared(false);

  // Deliberately a PLAIN function, not `useCallback`. `resolveNationalityChange` answers two
  // questions at once — the patch to apply, and whether a filled identity number was destroyed —
  // and the second answer has to drive a SEPARATE setter. That rules out computing it inside a
  // functional `setPersonalData` updater, since a side effect in an updater body fires twice under
  // StrictMode's double-invoke. So it reads `personalData` from the closure instead, which is safe
  // for a click handler but means it must NOT be memoized without `personalData` in its deps or it
  // would resolve against a stale buffer. `markStepAttempted` above gets away with `useCallback`
  // only because it uses a functional updater and touches nothing else.
  const changeNationality = (next: Nationality) => {
    const { patch, didClearIdentityNumber } = resolveNationalityChange(personalData, next);
    setPersonalData((prev) => ({ ...prev, ...patch }));
    setIdentityNumberCleared(didClearIdentityNumber);
  };

  const updateBusinessData = (data: Partial<BusinessAccountData>) => {
    setBusinessData((prev) => ({ ...prev, ...data }));
  };

  const accountData: AccountData | undefined = type
    ? type === "personal"
      ? { type: "personal", data: personalData }
      : { type: "business", data: businessData }
    : undefined;

  return (
    <CreateAccountContext.Provider
      value={{
        type,
        setType,
        currentStep,
        accountData,
        updatePersonalData,
        updateBusinessData,
        changeNationality,
        identityNumberCleared,
        dismissIdentityNumberCleared,
        setCurrentStep,
        nextStep,
        prevStep,
        attemptedSteps,
        markStepAttempted,
        showFieldErrors,
      }}
    >
      {props.children}
    </CreateAccountContext.Provider>
  );
}

export function useCreateAccount() {
  const context = React.useContext(CreateAccountContext);
  if (!context) throw new ServerError(ErrorCodes.INVALID_HOOK_CALL);
  return context;
}
