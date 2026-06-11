"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { useListSubdistrict } from "@/core/utilities/address/presentation/hooks/use-list-subdistrict";

type SubdistrictInputProps = {
  value?: SubdistrictEntity;
  onChange?: (subdistrict: SubdistrictEntity | undefined) => void;
  district?: DistrictEntity;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

export function SubdistrictInput({
  value,
  onChange: onChangeProp,
  district,
  label = "Kelurahan",
  placeholder = "Pilih Kelurahan",
  disabled,
  ...restProps
}: SubdistrictInputProps) {
  const { subdistricts, loading } = useListSubdistrict({ districtId: district?.id });

  const options = useMemo(() => {
    if (!subdistricts) return [];
    return subdistricts.map((subdistrict) => ({
      value: subdistrict.id,
      label: subdistrict.label,
    }));
  }, [subdistricts]);

  const onChange = (selectedId: string) => {
    const selectedSubdistrict = subdistricts?.find((subdistrict) => subdistrict.id === selectedId);
    onChangeProp?.(selectedSubdistrict);
  };

  const isDisabled = disabled || loading || !district;

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
