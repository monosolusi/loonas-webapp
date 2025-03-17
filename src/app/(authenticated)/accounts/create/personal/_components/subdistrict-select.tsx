"use client";

import { SubdistrictProvider, useSubdistrict } from "@/core/utilities/address/presentation/providers/subdistrict";
import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";
import React from "react";
import { Label } from "./label";
import { Select } from "./select";

export function SubdistrictSelect() {
  const { district } = useCreatePersonalAccount();

  return (
    <SubdistrictProvider districtId={district?.id}>
      <SubdistrictSelectComponent />
    </SubdistrictProvider>
  );
}

function SubdistrictSelectComponent() {
  const [subdistricts] = useSubdistrict();
  const { subdistrict, setSubdistrict } = useCreatePersonalAccount();


  function transformData(data: any[]) {
    const newData = data.map((d) => ({
      value: d.id,
      label: d.label
    }));

    return [{ value: "", label: "Pilih Kelurahan" }, ...newData];
  }

  function handleChange(data: { value: string; label: string }) {
    // Search for a province based on the id and value
    const selected = subdistricts.find((p) => p.id === data.value);
    setSubdistrict?.(selected);
  }

  return (
    <>
      <Label title="Kelurahan" htmlFor="subdistrict" />
      <div className="mt-2">
        <Select
          id="city"
          onChange={handleChange}
          value={subdistrict?.id || ""}
          data={transformData(subdistricts)}
          disableFirstOption
          required
        />
      </div>
    </>
  );
}