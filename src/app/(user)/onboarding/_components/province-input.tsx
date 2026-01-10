"use client";

import { useMemo } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useListProvince } from "@/core/utilities/address/presentation/hooks/use-list-province";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";

type ProvinceInputProps = {
  value?: ProvinceEntity;
  onChange?: (province: ProvinceEntity | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

/**
 * Province select input component.
 * Fetches provinces list internally and renders a controlled select input.
 *
 * @param props.value - ProvinceEntity
 * @param props.onChange - Callback returning the full ProvinceEntity (or undefined if cleared)
 * @param props.placeholder - Placeholder text
 * @param props.disabled - Additional disabled state (combined with loading state)
 */
export function ProvinceInput(props: ProvinceInputProps) {
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
    props.onChange?.(selectedProvince);
  };

  return (
    <SelectInput
      label="Provinsi"
      options={options}
      placeholder={props.placeholder ?? "Pilih Provinsi"}
      value={props.value?.id ?? ""}
      onChange={onChange}
      disabled={props.disabled || loading}
    />
  );
}
