"use client";

import { useMemo } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useListCity } from "@/core/utilities/address/presentation/hooks/use-list-city";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/_providers/create-account";

export function CityInput() {
  const { data, update } = usePersonalAccountData();
  const { cities, loading } = useListCity({ provinceId: data.province });

  const options = useMemo(() => {
    if (!cities) return [];
    return cities.map((city) => ({
      value: city.id,
      label: city.label,
    }));
  }, [cities]);

  const isDisabled = loading || !data.province;

  return (
    <SelectInput
      label="Kabupaten/Kota"
      options={options}
      placeholder="Pilih Kabupaten/Kota"
      value={data.city ?? ""}
      onChange={(value) => update?.({ city: value })}
      disabled={isDisabled}
    />
  );
}
