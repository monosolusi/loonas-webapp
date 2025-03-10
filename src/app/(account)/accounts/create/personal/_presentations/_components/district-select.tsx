"use client";

import React from "react";
import { Label } from "@/app/(account)/accounts/create/personal/_presentations/_components/label";
import { Select } from "@/app/(account)/accounts/create/personal/_presentations/_components/select";
import {
  useCreatePersonalAccount
} from "@/app/(account)/accounts/create/personal/_presentations/_providers/create-personal-account";
import { DistrictProvider, useDistrict } from "@/core/utilities/address/presentation/providers/district";

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

  function transformData(data: any[]) {
    const newData = data.map((d) => ({
      value: d.id,
      label: d.label
    }));

    return [{ value: "", label: "Pilih Kecamatan" }, ...newData];
  }

  return (
    <>
      <Label title="Kecamatan" htmlFor="district" />
      <div className="mt-2">
        <Select
          id="city"
          data={transformData(districts)}
          disableFirstOption
        />
      </div>
    </>
  );
}