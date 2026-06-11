"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { useListDistrict } from "@/core/utilities/address/presentation/hooks/use-list-district";

type DistrictInputProps = {
  value?: DistrictEntity;
  onChange?: (district: DistrictEntity | undefined) => void;
  city?: CityEntity;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

export function DistrictInput({
  value,
  onChange: onChangeProp,
  city,
  label = "Kecamatan",
  placeholder = "Pilih Kecamatan",
  disabled,
  ...restProps
}: DistrictInputProps) {
  const { districts, loading } = useListDistrict({ cityId: city?.id });

  const options = useMemo(() => {
    if (!districts) return [];
    return districts.map((district) => ({
      value: district.id,
      label: district.label,
    }));
  }, [districts]);

  const onChange = (selectedId: string) => {
    const selectedDistrict = districts?.find((district) => district.id === selectedId);
    onChangeProp?.(selectedDistrict);
  };

  const isDisabled = disabled || loading || !city;

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
