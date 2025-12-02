"use client";

import { useMemo } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useListProvince } from "@/core/utilities/address/presentation/hooks/use-list-province";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/_providers/create-account";

export function ProvinceInput() {
  const { provinces, loading } = useListProvince();
  const { data, update } = usePersonalAccountData();

  const options = useMemo(() => {
    if (!provinces) return [];
    return provinces.map((province) => ({
      value: province.id,
      label: province.label,
    }));
  }, [provinces]);

  return (
    <SelectInput
      label="Provinsi"
      options={options}
      placeholder="Pilih Provinsi"
      value={data.province ?? ""}
      onChange={(value) => update?.({ province: value })}
      disabled={loading}
    />
  );
}
