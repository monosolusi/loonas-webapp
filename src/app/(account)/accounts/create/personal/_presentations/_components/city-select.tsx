"use client";

import React from "react";
import { Label } from "@/app/(account)/accounts/create/personal/_presentations/_components/label";
import { Select } from "@/app/(account)/accounts/create/personal/_presentations/_components/select";
import { CityProvider, useCity } from "@/core/utilities/address/presentation/providers/city";
import {
  useCreatePersonalAccount
} from "@/app/(account)/accounts/create/personal/_presentations/_providers/create-personal-account";

export function CitySelect() {
  const { province } = useCreatePersonalAccount();

  return (
    <CityProvider provinceId={province?.id}>
      <CitySelectComponent />
    </CityProvider>
  );
}

function CitySelectComponent() {
  const [cities] = useCity();
  const {
    city,
    setCity,
    setDistrict,
    setSubdistrict
  } = useCreatePersonalAccount();

  function transformData(data: any[]) {
    const newData = data.map((d) => ({
      value: d.id,
      label: d.label
    }));

    return [{ value: "", label: "Pilih Kota / Kabupaten" }, ...newData];
  }

  function handleChange(data: { value: string; label: string }) {
    // Search for a province based on the id and value
    const selected = cities.find((p) => p.id === data.value);
    setCity?.(selected);
    setDistrict?.(undefined);
    setSubdistrict?.(undefined);
  }

  return (
    <>
      <Label title="Kota / Kabupaten" htmlFor="city" />
      <div className="mt-2">
        <Select
          id="city"
          onChange={handleChange}
          value={city?.id || ""}
          data={transformData(cities)}
          disableFirstOption
          required
        />
      </div>
    </>
  );
}