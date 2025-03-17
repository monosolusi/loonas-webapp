"use client";

import { ProvinceProvider, useProvince } from "@/core/utilities/address/presentation/providers/province";
import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";
import React from "react";
import { Label } from "./label";
import { Select } from "./select";

export function ProvinceSelect() {
  return (
    <ProvinceProvider>
      <ProvinceSelectComponent />
    </ProvinceProvider>
  );
}

function ProvinceSelectComponent() {
  const [provinces] = useProvince();
  const {
    province,
    setProvince,
    setCity,
    setDistrict,
    setSubdistrict
  } = useCreatePersonalAccount();

  function transformData(data: any[]) {
    const newData = data.map((d) => ({
      value: d.id,
      label: d.label
    }));

    return [{ value: "", label: "Pilih Provinsi" }, ...newData];
  }

  function handleChange(data: { value: string; label: string }) {
    // Search for a province based on the id and value
    const selectedProvince = provinces.find((p) => p.id === data.value);
    setProvince?.(selectedProvince);
    setCity?.(undefined);
    setDistrict?.(undefined);
    setSubdistrict?.(undefined);
  }

  return (
    <>
      <Label title="Provinsi" htmlFor="state" />
      <div className="mt-2">
        <Select
          id="state"
          onChange={handleChange}
          value={province?.id || ""}
          data={transformData(provinces)}
          disableFirstOption
          required
        />
      </div>
    </>
  );
}