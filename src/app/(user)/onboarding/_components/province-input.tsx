"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { useListProvince } from "@/core/utilities/address/presentation/hooks/use-list-province";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";

type ProvinceInputProps = {
  value?: ProvinceEntity;
  onChange?: (province: ProvinceEntity | undefined) => void;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

/**
 * Province select input component.
 * Fetches provinces list internally and renders a controlled select input.
 *
 * @param props.value - ProvinceEntity
 * @param props.onChange - Callback returning the full ProvinceEntity (or undefined if cleared)
 * @param props.label - Label text (default: "Provinsi")
 * @param props.placeholder - Placeholder text (default: "Pilih Provinsi")
 */
export function ProvinceInput({
  value,
  onChange: onChangeProp,
  label = "Provinsi",
  placeholder = "Pilih Provinsi",
  disabled,
  ...restProps
}: ProvinceInputProps) {
  const { provinces, loading } = useListProvince();

  const options = useMemo(() => {
    if (!provinces) return [];
    return provinces.map((province) => ({
      value: province.id,
      label: province.label,
    }));
  }, [provinces]);

  const onChange = (selectedId: string) => {
    const selectedProvince = provinces?.find((p) => p.id === selectedId);
    onChangeProp?.(selectedProvince);
  };

  return (
    <SelectInput
      {...restProps}
      label={label}
      options={options}
      placeholder={placeholder}
      value={value?.id ?? ""}
      onChange={onChange}
      disabled={disabled || loading}
    />
  );
}
