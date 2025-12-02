"use client";

import React from "react";

type AccountType = "personal" | "business";

type PersonalStep = "personal.personal" | "personal.address" | "personal.documents";
type BusinessStep = "business.personal" | "business.address" | "business.documents";
type Step = PersonalStep | BusinessStep;

const ACCOUNT_STEPS: Record<AccountType, Step[]> = {
  personal: ["personal.personal", "personal.address", "personal.documents"],
  business: ["business.personal", "business.address", "business.documents"],
} as const;

type CreateAccountContextProps = {
  type?: AccountType;
  currentStep?: Step;
  setType?: React.Dispatch<React.SetStateAction<AccountType | undefined>>;
  setCurrentStep?: React.Dispatch<React.SetStateAction<Step | undefined>>;
  nextStep?: () => void;
  prevStep?: () => void;
};

type CreateAccountProviderProps = {
  children: React.ReactNode;
};

const CreateAccountContext = React.createContext<CreateAccountContextProps>({});

export function CreateAccountProvider(props: CreateAccountProviderProps) {
  const [type, setType] = React.useState<AccountType>();
  const [currentStep, setCurrentStep] = React.useState<Step>();

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

  return (
    <CreateAccountContext.Provider value={{ type, setType, currentStep, setCurrentStep, nextStep, prevStep }}>
      {props.children}
    </CreateAccountContext.Provider>
  );
}

export function useCreateAccount() {
  return React.useContext(CreateAccountContext);
}
