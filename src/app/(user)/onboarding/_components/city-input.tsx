"use client";

import { useMemo } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useListCity } from "@/core/utilities/address/presentation/hooks/use-list-city";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";

type CityInputProps = {
  value?: CityEntity;
  onChange?: (city: CityEntity | undefined) => void;
  province?: ProvinceEntity;
};

export function CityInput(props: CityInputProps) {
  const { cities, loading } = useListCity({ provinceId: props.province?.id });

  const options = useMemo(() => {
    if (!cities) return [];
    return cities.map((city) => ({
      value: city.id,
      label: city.label,
    }));
  }, [cities]);

  const onChange = (selectedId: string) => {
    const selectedCity = cities?.find((p) => p.id === selectedId);
    props.onChange?.(selectedCity);
  };

  const isDisabled = loading || !props.province;
  return (
    <SelectInput
      label="Kabupaten/Kota"
      options={options}
      placeholder="Pilih Kabupaten/Kota"
      value={props.value?.id ?? ""}
      onChange={onChange}
      disabled={isDisabled}
    />
  );
}
