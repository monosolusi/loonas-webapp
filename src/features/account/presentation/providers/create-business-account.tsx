"use client";

import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import React, { useEffect } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useRouter } from "next/navigation";
import { useCreateBusinessAccount } from "@/features/account/presentation/hooks/use-create-business-account";

interface CreateBusinessAccountContextProps {
  companyName?: string;
  companyEmail?: string;
  companyPhoneNumber?: string;
  companyProvince?: ProvinceEntity;
  companyCity?: CityEntity;
  companyDistrict?: DistrictEntity;
  companySubdistrict?: SubdistrictEntity;
  companyAddress?: string;
  companyDeedOfEstablishment?: File | null;
  companyMostRecentDeedOfAmendment?: File | null;
  companyBusinessIdentificationNumber?: File | null;
  directorNationalIdentityCard?: File | null;
  companyFinancialStatement?: File | null;
  companyBankStatement?: File | null;
  openConfirmationDialog: boolean;
  errorList: ServerError[];
  isCreating: boolean;
  setCompanyName?: React.Dispatch<React.SetStateAction<string>>;
  setCompanyEmail?: React.Dispatch<React.SetStateAction<string>>;
  setCompanyPhoneNumber?: React.Dispatch<React.SetStateAction<string>>;
  setCompanyProvince?: React.Dispatch<React.SetStateAction<ProvinceEntity | undefined>>;
  setCompanyCity?: React.Dispatch<React.SetStateAction<CityEntity | undefined>>;
  setCompanyDistrict?: React.Dispatch<React.SetStateAction<DistrictEntity | undefined>>;
  setCompanySubdistrict?: React.Dispatch<React.SetStateAction<SubdistrictEntity | undefined>>;
  setCompanyAddress?: React.Dispatch<React.SetStateAction<string>>;
  setCompanyDeedOfEstablishment?: React.Dispatch<React.SetStateAction<File | null>>;
  setCompanyMostRecentDeedOfAmendment?: React.Dispatch<React.SetStateAction<File | null>>;
  setCompanyBusinessIdentificationNumber?: React.Dispatch<React.SetStateAction<File | null>>;
  setDirectorNationalIdentityCard?: React.Dispatch<React.SetStateAction<File | null>>;
  setCompanyFinancialStatement?: React.Dispatch<React.SetStateAction<File | null>>;
  setCompanyBankStatement?: React.Dispatch<React.SetStateAction<File | null>>;
  setOpenConfirmationDialog?: React.Dispatch<React.SetStateAction<boolean>>;
  createAccount?: () => Promise<void>;
  isInputClean?: () => boolean;
}

const CreateBusinessAccountContext = React.createContext<CreateBusinessAccountContextProps>({
  openConfirmationDialog: false,
  isCreating: false,
  errorList: [],
});

export function CreateBusinessAccountProvider(props: { children: React.ReactNode }) {
  const { trigger, data: createResult, error: createError, isMutating: isCreating } = useCreateBusinessAccount();
  const router = useRouter();

  const [companyName, setCompanyName] = React.useState<string>("");
  const [companyEmail, setCompanyEmail] = React.useState<string>("");
  const [companyPhoneNumber, setCompanyPhoneNumber] = React.useState<string>("");
  const [companyProvince, setCompanyProvince] = React.useState<ProvinceEntity>();
  const [companyCity, setCompanyCity] = React.useState<CityEntity>();
  const [companyDistrict, setCompanyDistrict] = React.useState<DistrictEntity>();
  const [companySubdistrict, setCompanySubdistrict] = React.useState<SubdistrictEntity>();
  const [companyAddress, setCompanyAddress] = React.useState<string>("");
  const [companyDeedOfEstablishment, setCompanyDeedOfEstablishment] = React.useState<File | null>(null);
  const [companyMostRecentDeedOfAmendment, setCompanyMostRecentDeedOfAmendment] = React.useState<File | null>(null);
  const [companyBusinessIdentificationNumber, setCompanyBusinessIdentificationNumber] = React.useState<File | null>(
    null,
  );
  const [directorNationalIdentityCard, setDirectorNationalIdentityCard] = React.useState<File | null>(null);
  const [companyFinancialStatement, setCompanyFinancialStatement] = React.useState<File | null>(null);
  const [companyBankStatement, setCompanyBankStatement] = React.useState<File | null>(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] = React.useState<boolean>(false);
  const [errorList, setErrorList] = React.useState<ServerError[]>([]);

  const isInputClean = () => {
    const errorList: ServerError[] = [];

    if (!companyName) errorList.push(new ServerError(ErrorCodes.COMPANY_NAME_EMPTY));
    if (!companyEmail) errorList.push(new ServerError(ErrorCodes.COMPANY_EMAIL_EMPTY));
    if (!companyPhoneNumber) errorList.push(new ServerError(ErrorCodes.COMPANY_PHONE_NUMBER_EMPTY));
    if (!companyProvince) errorList.push(new ServerError(ErrorCodes.COMPANY_PROVINCE_EMPTY));
    if (!companyCity) errorList.push(new ServerError(ErrorCodes.COMPANY_CITY_EMPTY));
    if (!companyDistrict) errorList.push(new ServerError(ErrorCodes.COMPANY_DISTRICT_EMPTY));
    if (!companySubdistrict) errorList.push(new ServerError(ErrorCodes.COMPANY_SUBDISTRICT_EMPTY));
    if (!companyAddress) errorList.push(new ServerError(ErrorCodes.COMPANY_ADDRESS_EMPTY));
    if (!companyDeedOfEstablishment) errorList.push(new ServerError(ErrorCodes.COMPANY_DEED_OF_ESTABLISHMENT_EMPTY));
    if (!companyBusinessIdentificationNumber) {
      errorList.push(new ServerError(ErrorCodes.COMPANY_BUSINESS_IDENTIFICATION_NUMBER_EMPTY));
    }

    if (!directorNationalIdentityCard) {
      errorList.push(new ServerError(ErrorCodes.DIRECTOR_NATIONAL_IDENTITY_CARD_EMPTY));
    }

    if (!companyFinancialStatement && !companyBankStatement) {
      errorList.push(new ServerError(ErrorCodes.COMPANY_FINANCIAL_OR_BANK_STATEMENT_REQUIRED));
    }

    // True if no error inside the errorList array.
    setErrorList(errorList);
    return errorList.length === 0;
  };

  const createAccount = async () => {
    if (!isInputClean()) return;

    // Double-check the address.province, address.city, address.district, address.subdistrict
    if (!companyProvince) throw new ServerError(ErrorCodes.COMPANY_PROVINCE_EMPTY);
    if (!companyCity) throw new ServerError(ErrorCodes.COMPANY_CITY_EMPTY);
    if (!companyDistrict) throw new ServerError(ErrorCodes.COMPANY_DISTRICT_EMPTY);
    if (!companySubdistrict) throw new ServerError(ErrorCodes.COMPANY_SUBDISTRICT_EMPTY);
    if (!companyDeedOfEstablishment) throw new ServerError(ErrorCodes.COMPANY_DEED_OF_ESTABLISHMENT_EMPTY);
    if (!companyBusinessIdentificationNumber) {
      throw new ServerError(ErrorCodes.COMPANY_BUSINESS_IDENTIFICATION_NUMBER_EMPTY);
    }
    if (!directorNationalIdentityCard) throw new ServerError(ErrorCodes.DIRECTOR_NATIONAL_IDENTITY_CARD_EMPTY);

    await trigger({
      company: {
        name: companyName,
        email: companyEmail,
        phoneNumber: companyPhoneNumber,
        address: {
          province: companyProvince,
          city: companyCity,
          district: companyDistrict,
          subdistrict: companySubdistrict,
          address: companyAddress,
        },
        deedOfEstablishment: companyDeedOfEstablishment,
        mostRecentDeedOfAmendment:
          companyMostRecentDeedOfAmendment === null ? undefined : companyMostRecentDeedOfAmendment,
        businessIdentificationNumber: companyBusinessIdentificationNumber,
        financial: {
          statement: companyFinancialStatement === null ? undefined : companyFinancialStatement,
          bankStatement: companyBankStatement === null ? undefined : companyBankStatement,
        },
      },
      director: { nationalIdentityCard: directorNationalIdentityCard },
    });
  };

  useEffect(() => {
    if (createError) setErrorList([new ServerError(ErrorCodes.ACCOUNT_CREATION_FAILED)]);
    if (createResult && !createError) router.replace(`/accounts/${createResult.id}/verifications`);
  }, [createError, createResult]);

  useEffect(() => {
    setCompanyCity(undefined);
    setCompanyDistrict(undefined);
    setCompanySubdistrict(undefined);
  }, [companyProvince]);

  useEffect(() => {
    setCompanyDistrict(undefined);
    setCompanySubdistrict(undefined);
  }, [companyCity]);

  useEffect(() => {
    setCompanySubdistrict(undefined);
  }, [companyDistrict]);

  return (
    <CreateBusinessAccountContext.Provider
      value={{
        companyName,
        companyEmail,
        companyPhoneNumber,
        companyProvince,
        companyCity,
        companyDistrict,
        companySubdistrict,
        companyAddress,
        companyDeedOfEstablishment,
        companyMostRecentDeedOfAmendment,
        companyBusinessIdentificationNumber,
        directorNationalIdentityCard,
        companyFinancialStatement,
        companyBankStatement,
        openConfirmationDialog,
        errorList,
        isCreating,
        setCompanyName,
        setCompanyEmail,
        setCompanyPhoneNumber,
        setCompanyProvince,
        setCompanyCity,
        setCompanyDistrict,
        setCompanySubdistrict,
        setCompanyAddress,
        setCompanyDeedOfEstablishment,
        setCompanyMostRecentDeedOfAmendment,
        setCompanyBusinessIdentificationNumber,
        setDirectorNationalIdentityCard,
        setCompanyFinancialStatement,
        setCompanyBankStatement,
        setOpenConfirmationDialog,
        isInputClean,
        createAccount,
      }}
    >
      {props.children}
    </CreateBusinessAccountContext.Provider>
  );
}

export function useCreateBusinessAccountState() {
  return React.useContext(CreateBusinessAccountContext);
}
