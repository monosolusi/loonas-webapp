"use client";

import { DistrictProvider, useDistrict } from "@/core/utilities/address/presentation/providers/district";
import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";
import React from "react";
import { Label } from "./label";
import { Select } from "./select";

export function DistrictSelect() {
  const { city } = useCreatePersonalAccount();

  return (
    <DistrictProvider cityId={city?.id}>
      <DistrictSelectComponent />
    </DistrictProvider>
  );
}

function DistrictSelectComponent() {
  const [districts] = useDistrict();
  const {
    district,
    setDistrict,
    setSubdistrict
  } = useCreatePersonalAccount();


  function transformData(data: any[]) {
    const newData = data.map((d) => ({
      value: d.id,
      label: d.label
    }));

    return [{ value: "", label: "Pilih Kecamatan" }, ...newData];
  }

  function handleChange(data: { value: string; label: string }) {
    // Search for a province based on the id and value
    const selected = districts.find((p) => p.id === data.value);
    setDistrict?.(selected);
    setSubdistrict?.(undefined);
  }

  return (
    <>
      <Label title="Kecamatan" htmlFor="district" />
      <div className="mt-2">
        <Select
          id="city"
          onChange={handleChange}
          value={district?.id || ""}
          data={transformData(districts)}
          disableFirstOption
          required
        />
      </div>
    </>
  );
}