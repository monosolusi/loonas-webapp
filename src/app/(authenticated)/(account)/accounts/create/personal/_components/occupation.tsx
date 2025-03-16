"use client";

import React from "react";
import { OccupationProvider, useOccupation } from "@/core/utilities/occupation/presentation/providers/occupation";
import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";
import { Label } from "./label";
import { Select } from "./select";

export function Occupation() {
  return (
    <OccupationProvider>
      <OccupationSelectComponent />
    </OccupationProvider>
  );
}

function OccupationSelectComponent() {
  const [occupations] = useOccupation();
  const { occupation, setOccupation } = useCreatePersonalAccount();

  function transformData(data: any[]) {
    const newData = data.map((d) => ({
      value: d.id,
      label: d.label
    }));

    return [{ value: "", label: "Pilih Pekerjaan" }, ...newData];
  }

  function handleChange(data: { value: string; label: string }) {
    // Search for a province based on the id and value
    const selected = occupations.find((p) => p.id === data.value);
    setOccupation?.(selected);
  }

  return (
    <div className="sm:col-span-4">
      <Label
        title="Pekerjaan"
        description="Masukkan pekerjaanmu yang sedang kamu tekuni saat ini, ya."
      />
      <div className="mt-2">
        <Select
          data={transformData(occupations)}
          onChange={handleChange}
          value={occupation?.id || ""}
          disableFirstOption
          required
        />
      </div>
    </div>
  );
}