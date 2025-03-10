"use client";

import React from "react";
import { Label } from "@/app/(account)/accounts/create/personal/_components/label";
import { Select } from "@/app/(account)/accounts/create/personal/_components/select";
import { ProvinceProvider, useProvince } from "@/core/utilities/address/presentation/providers/province";

export function ProvinceSelect() {
  return (
    <ProvinceProvider>
      <ProvinceSelectComponent />
    </ProvinceProvider>
  );
}

function ProvinceSelectComponent() {
  const [provinces] = useProvince();

  function transformData(data: any[]) {
    return data.map((d) => ({
      value: d.id,
      label: d.label
    }));
  }

  return (
    <>
      <Label title="Provinsi" htmlFor="state" />
      <div className="mt-2">
        <Select
          id="state"
          data={transformData(provinces)}
        />
      </div>
    </>
  );
}