"use client";

import React, { useEffect } from "react";
import { DateTime } from "luxon";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type AccountType = "personal" | "business";

type PersonalStep = "personal.personal" | "personal.address" | "personal.documents";
type BusinessStep = "business.personal" | "business.address" | "business.documents";
type Step = PersonalStep | BusinessStep;

type BusinessAccountData = {};

type PersonalAccountData = {
  nationality?: string;
  identityFile?: File;
  identityNumber?: string;
  fullName?: string;
  occupation?: string;
  placeOfBirth?: string;
  dateOfBirth?: DateTime;
  province?: string;
  city?: string;
  district?: string;
  subDistrict?: string;
  address?: string;
};

type AccountData = { type: "personal"; data: PersonalAccountData } | { type: "business"; data: BusinessAccountData };

export const ACCOUNT_STEPS: Record<AccountType, Step[]> = {
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
  accountData?: AccountData;
  updatePersonalData?: (data: Partial<PersonalAccountData>) => void;
  updateBusinessData?: (data: Partial<BusinessAccountData>) => void;
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

  useEffect(() => {
    console.log(accountData);
  }, [accountData]);

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
      }}
    >
      {props.children}
    </CreateAccountContext.Provider>
  );
}

export function useCreateAccount() {
  const context = React.useContext(CreateAccountContext);
  if (!context)
    throw new ServerError(ErrorCodes.UNKNOWN, { error: "useCreateAccount must be used within CreateAccountProvider" });
  return context;
}

export function usePersonalAccountData() {
  const { accountData, updatePersonalData } = useCreateAccount();
  if (accountData?.type !== "personal") {
    throw new ServerError(ErrorCodes.UNKNOWN, {
      error: "usePersonalAccountData must be used in personal account flow",
    });
  }

  return { data: accountData.data, update: updatePersonalData };
}

export function useBusinessAccountData() {
  const { accountData, updateBusinessData } = useCreateAccount();
  if (accountData?.type !== "business") {
    throw new Error("useBusinessAccountData must be used in business account flow");
  }

  return { data: accountData.data, update: updateBusinessData };
}
