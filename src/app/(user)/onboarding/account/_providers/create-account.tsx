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
