"use client";

import React from "react";
import { Label } from "@/app/(account)/accounts/create/personal/_presentations/_components/label";
import { Select } from "@/app/(account)/accounts/create/personal/_presentations/_components/select";
import { ProvinceProvider, useProvince } from "@/core/utilities/address/presentation/providers/province";

import {
  useCreatePersonalAccount
} from "@/app/(account)/accounts/create/personal/_presentations/_providers/create-personal-account";

export function ProvinceSelect() {
  return (
    <ProvinceProvider>
      <ProvinceSelectComponent />
    </ProvinceProvider>
  );
}

function ProvinceSelectComponent() {
  const [provinces] = useProvince();
  const { province, setProvince } = useCreatePersonalAccount();

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
        />
      </div>
    </>
  );
}