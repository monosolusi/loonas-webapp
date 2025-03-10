"use client";

import React, { createContext, useContext, useState } from "react";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";

interface CreatePersonalAccountContextProps {
  province?: ProvinceEntity;
  city?: CityEntity;
  district?: DistrictEntity;
  subdistrict?: SubdistrictEntity;
  setProvince?: React.Dispatch<React.SetStateAction<ProvinceEntity | undefined>>;
  setCity?: React.Dispatch<React.SetStateAction<CityEntity | undefined>>;
  setDistrict?: React.Dispatch<React.SetStateAction<DistrictEntity | undefined>>;
  setSubdistrict?: React.Dispatch<React.SetStateAction<SubdistrictEntity | undefined>>;
}

const CreatePersonalAccountContext = createContext<CreatePersonalAccountContextProps>({});

export function CreatePersonalAccountProvider({ children }: { children: any }) {
  const [province, setProvince] = useState<ProvinceEntity>();
  const [city, setCity] = useState<CityEntity>();
  const [district, setDistrict] = useState<DistrictEntity>();
  const [subdistrict, setSubdistrict] = useState<SubdistrictEntity>();

  return (
    <CreatePersonalAccountContext.Provider
      value={{
        province,
        city,
        district,
        subdistrict,
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