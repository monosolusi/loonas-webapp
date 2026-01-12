"use client";

import React from "react";
import { DateTime } from "luxon";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";

type AccountType = "personal" | "business";

type PersonalStep = "personal.personal" | "personal.address" | "personal.documents";
type BusinessStep = "business.personal" | "business.address" | "business.documents";
type Step = PersonalStep | BusinessStep;

type BusinessAccountData = {
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

type PersonalAccountData = {
  nationality?: string;
  identityFile?: File | null;
  identityNumber?: string;
  fullName?: string;
  occupation?: OccupationEntity;
  placeOfBirth?: string;
  dateOfBirth?: DateTime;
  province?: ProvinceEntity;
  city?: CityEntity;
  district?: DistrictEntity;
  subDistrict?: SubdistrictEntity;
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
  if (!context) throw new ServerError(ErrorCodes.INVALID_HOOK_CALL);
  return context;
}
