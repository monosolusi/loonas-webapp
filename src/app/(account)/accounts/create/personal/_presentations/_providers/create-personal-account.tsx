"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { DateTime } from "luxon";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

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
}

const CreatePersonalAccountContext = createContext<CreatePersonalAccountContextProps>({
  nationality: "WNI",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  dobError: false
});

export function CreatePersonalAccountProvider({ children }: { children: any }) {
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

  useEffect(() => {
    try {
      if (!dobDay || !dobMonth || !dobYear) return;

      const dob = `${dobYear}-${dobMonth}-${dobDay}`;
      const dobDate = DateTime.fromFormat(dob, "yyyy-MM-dd");
      if (!dobDate.isValid) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setDob(dobDate);
      setDobError(false);
    } catch (err) {
      setDobError(true);
    }

  }, [dobDay, dobMonth, dobYear]);

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
        setAddress
      }}
    >
      {children}
    </CreatePersonalAccountContext.Provider>
  );
}

export function useCreatePersonalAccount() {
  return useContext(CreatePersonalAccountContext);
}