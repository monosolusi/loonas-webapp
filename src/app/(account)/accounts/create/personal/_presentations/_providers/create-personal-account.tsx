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
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  dobError: boolean;
  identityDocument?: File | null;
  occupation?: OccupationEntity;
  province?: ProvinceEntity;
  city?: CityEntity;
  district?: DistrictEntity;
  subdistrict?: SubdistrictEntity;
  setDobDay?: React.Dispatch<React.SetStateAction<string>>;
  setDobMonth?: React.Dispatch<React.SetStateAction<string>>;
  setDobYear?: React.Dispatch<React.SetStateAction<string>>;
  setIdentityDocument?: React.Dispatch<React.SetStateAction<File | null>>;
  setOccupation?: React.Dispatch<React.SetStateAction<OccupationEntity | undefined>>;
  setProvince?: React.Dispatch<React.SetStateAction<ProvinceEntity | undefined>>;
  setCity?: React.Dispatch<React.SetStateAction<CityEntity | undefined>>;
  setDistrict?: React.Dispatch<React.SetStateAction<DistrictEntity | undefined>>;
  setSubdistrict?: React.Dispatch<React.SetStateAction<SubdistrictEntity | undefined>>;
}

const CreatePersonalAccountContext = createContext<CreatePersonalAccountContextProps>({
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  dobError: false
});

export function CreatePersonalAccountProvider({ children }: { children: any }) {
  const [dobDay, setDobDay] = useState<string>("");
  const [dobMonth, setDobMonth] = useState<string>("");
  const [dobYear, setDobYear] = useState<string>("");
  const [dob, setDob] = useState<DateTime>();
  const [dobError, setDobError] = useState<boolean>(false);

  const [identityDocument, setIdentityDocument] = useState<File | null>(null);
  const [occupation, setOccupation] = useState<OccupationEntity>();
  const [province, setProvince] = useState<ProvinceEntity>();
  const [city, setCity] = useState<CityEntity>();
  const [district, setDistrict] = useState<DistrictEntity>();
  const [subdistrict, setSubdistrict] = useState<SubdistrictEntity>();

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
        dobDay,
        dobMonth,
        dobYear,
        dobError,
        identityDocument,
        occupation,
        province,
        city,
        district,
        subdistrict,
        setDobDay,
        setDobMonth,
        setDobYear,
        setIdentityDocument,
        setOccupation,
        setProvince,
        setCity,
        setDistrict,
        setSubdistrict
      }}
    >
      {children}
    </CreatePersonalAccountContext.Provider>
  );
}

export function useCreatePersonalAccount() {
  return useContext(CreatePersonalAccountContext);
}