"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { useListCity } from "@/core/utilities/address/presentation/hooks/use-list-city";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";

type CityInputProps = {
  value?: CityEntity;
  onChange?: (city: CityEntity | undefined) => void;
  province?: ProvinceEntity;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

export function CityInput({
  value,
  onChange: onChangeProp,
  province,
  label = "Kabupaten/Kota",
  placeholder = "Pilih Kabupaten/Kota",
  disabled,
  ...restProps
}: CityInputProps) {
  const { cities, loading } = useListCity({ provinceId: province?.id });

  const options = useMemo(() => {
    if (!cities) return [];
    return cities.map((city) => ({
      value: city.id,
      label: city.label,
    }));
  }, [cities]);

  const onChange = (selectedId: string) => {
    const selectedCity = cities?.find((p) => p.id === selectedId);
    onChangeProp?.(selectedCity);
  };

  const isDisabled = disabled || loading || !province;

  return (
    <SelectInput
      {...restProps}
      label={label}
      options={options}
      placeholder={placeholder}
      value={value?.id ?? ""}
      onChange={onChange}
      disabled={isDisabled}
    />
  );
}
