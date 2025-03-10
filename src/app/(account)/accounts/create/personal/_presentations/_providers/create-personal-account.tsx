"use client";

import React, { createContext, useContext, useState } from "react";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";

interface CreatePersonalAccountContextProps {
  province?: ProvinceEntity;
  city?: CityEntity;
  setProvince?: React.Dispatch<React.SetStateAction<ProvinceEntity | undefined>>;
  setCity?: React.Dispatch<React.SetStateAction<CityEntity | undefined>>;
}

const CreatePersonalAccountContext = createContext<CreatePersonalAccountContextProps>({});

export function CreatePersonalAccountProvider({ children }: { children: any }) {
  const [province, setProvince] = useState<ProvinceEntity>();
  const [city, setCity] = useState<CityEntity>();

  return (
    <CreatePersonalAccountContext.Provider
      value={{
        province,
        city,
        setProvince,
        setCity
      }}
    >
      {children}
    </CreatePersonalAccountContext.Provider>
  );
}

export function useCreatePersonalAccount() {
  return useContext(CreatePersonalAccountContext);
}