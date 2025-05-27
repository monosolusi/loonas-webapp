"use client";

import React from "react";
import { CityProvider, useCity } from "@/core/utilities/address/presentation/providers/city";
import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";
import { Label } from "../../../../../../core/presentations/components/label";
import { Select } from "../../../../../../core/presentations/components/select";

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
