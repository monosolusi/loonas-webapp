"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AccountServiceImpl } from "../../data/sources/account";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { AccountRepositoryImpl } from "../../data/repositories/account";
import {
  CreatePersonalAccountUseCase,
  CreatePersonalAccountUseCaseParams,
} from "../../domain/usecases/create-personal-account";
import { DataFailed } from "@/core/resources/data-state";
import { HttpRequest } from "@/core/helpers/http-request";

interface CreatePersonalAccountContextProps {
  nationality: string;
  pob?: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  dobError: boolean;
  identityDocument?: File | null;
  idNumber?: string;
  fullName?: string;
  occupation?: OccupationEntity;
  province?: ProvinceEntity;
  city?: CityEntity;
  district?: DistrictEntity;
  subdistrict?: SubdistrictEntity;
  address?: string;
  errorList: string[];
  openConfirmationDialog: boolean;
  loading: boolean;
  setPob?: React.Dispatch<React.SetStateAction<string>>;
  setDobDay?: React.Dispatch<React.SetStateAction<string>>;
  setDobMonth?: React.Dispatch<React.SetStateAction<string>>;
  setDobYear?: React.Dispatch<React.SetStateAction<string>>;
  setIdentityDocument?: React.Dispatch<React.SetStateAction<File | null>>;
  setIdNumber?: React.Dispatch<React.SetStateAction<string>>;
  setFullName?: React.Dispatch<React.SetStateAction<string>>;
  setOccupation?: React.Dispatch<React.SetStateAction<OccupationEntity | undefined>>;
  setProvince?: React.Dispatch<React.SetStateAction<ProvinceEntity | undefined>>;
  setCity?: React.Dispatch<React.SetStateAction<CityEntity | undefined>>;
  setDistrict?: React.Dispatch<React.SetStateAction<DistrictEntity | undefined>>;
  setSubdistrict?: React.Dispatch<React.SetStateAction<SubdistrictEntity | undefined>>;
  setAddress?: React.Dispatch<React.SetStateAction<string>>;
  setOpenConfirmationDialog?: React.Dispatch<React.SetStateAction<boolean>>;
  createAccount?: () => Promise<void>;
}

const CreatePersonalAccountContext = createContext<CreatePersonalAccountContextProps>({
  nationality: "WNI",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  dobError: false,
  errorList: [],
  openConfirmationDialog: false,
  loading: false,
});

export function CreatePersonalAccountProvider({ children }: { children: any }) {
  const router = useRouter();

  const [nationality] = useState<string>("WNI");

  const [pob, setPob] = useState<string>("");
  const [dobDay, setDobDay] = useState<string>("");
  const [dobMonth, setDobMonth] = useState<string>("");
  const [dobYear, setDobYear] = useState<string>("");
  const [dob, setDob] = useState<DateTime>();
  const [dobError, setDobError] = useState<boolean>(false);

  const [identityDocument, setIdentityDocument] = useState<File | null>(null);
  const [idNumber, setIdNumber] = useState<string>("");

  const [fullName, setFullName] = useState<string>("");
  const [occupation, setOccupation] = useState<OccupationEntity>();
  const [province, setProvince] = useState<ProvinceEntity>();
  const [city, setCity] = useState<CityEntity>();
  const [district, setDistrict] = useState<DistrictEntity>();
  const [subdistrict, setSubdistrict] = useState<SubdistrictEntity>();
  const [address, setAddress] = useState<string>("");

  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      if (error instanceof ServerError && error.code === ErrorCodes.INCOMPLETE_FORM.code) return;
      else throw error;
    }
  }, [error]);

  useEffect(() => {
    try {
      if (!dobDay || !dobMonth || !dobYear) return;

      const dob = `${dobYear}-${dobMonth}-${dobDay}`;
      const dobDate = DateTime.fromFormat(dob, "yyyy-MM-dd");
      if (!dobDate.isValid) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setDob(dobDate);
      setDobError(false);
    } catch (_) {
      setDobError(true);
    }
  }, [dobDay, dobMonth, dobYear]);

  async function createAccount() {
    try {
      setLoading(true);

      // Making sure that all the data has been filled in.
      const errorList = [];
      if (!pob) errorList.push("Tempat lahir tidak boleh kosong");
      if (!dob) errorList.push("Tanggal lahir tidak boleh kosong");
      if (!identityDocument) errorList.push("Foto KTP tidak boleh kosong");
      if (!idNumber) errorList.push("Nomor KTP tidak boleh kosong");
      if (!fullName) errorList.push("Nama lengkap tidak boleh kosong");
      if (!occupation) errorList.push("Pekerjaan tidak boleh kosong");
      if (!province) errorList.push("Provinsi tidak boleh kosong");
      if (!city) errorList.push("Kota tidak boleh kosong");
      if (!district) errorList.push("Kecamatan tidak boleh kosong");
      if (!subdistrict) errorList.push("Kelurahan tidak boleh kosong");
      if (!address) errorList.push("Alamat tidak boleh kosong");

      if (errorList.length > 0) {
        setErrorList(errorList);
        throw new ServerError(ErrorCodes.INCOMPLETE_FORM);
      }

      // Re-check again for the sake of typescript because typescript cannot detect the above check.
      if (!identityDocument) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!occupation) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!dob) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!province) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!city) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!district) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!subdistrict) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // We are sure we don't have any error, so we can proceed to create the account
      const http = new HttpRequest();
      const accountService = new AccountServiceImpl(http);
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const accountRepository = new AccountRepositoryImpl(accountService);
      const createAccount = new CreatePersonalAccountUseCase(accountRepository, sessionRepository);
      const createAccountParams = new CreatePersonalAccountUseCaseParams({
        nationality,
        idNumber,
        idDocument: identityDocument,
        fullName,
        occupation,
        pob,
        dob,
        province,
        city,
        district,
        subdistrict,
        address,
      });

      const account = await createAccount.execute(createAccountParams);
      if (account instanceof DataFailed) throw account.error;
      if (!account.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // It is a success!
      router.replace(`/accounts/${account.data.id}/verifications`);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CreatePersonalAccountContext.Provider
      value={{
        nationality,
        pob,
        dobDay,
        dobMonth,
        dobYear,
        dobError,
        identityDocument,
        idNumber,
        fullName,
        occupation,
        province,
        city,
        district,
        subdistrict,
        address,
        errorList,
        openConfirmationDialog,
        loading,
        setPob,
        setDobDay,
        setDobMonth,
        setDobYear,
        setIdentityDocument,
        setIdNumber,
        setFullName,
        setOccupation,
        setProvince,
        setCity,
        setDistrict,
        setSubdistrict,
        setAddress,
        setOpenConfirmationDialog,
        createAccount,
      }}
    >
      {children}
    </CreatePersonalAccountContext.Provider>
  );
}

export function useCreatePersonalAccount() {
  return useContext(CreatePersonalAccountContext);
}
