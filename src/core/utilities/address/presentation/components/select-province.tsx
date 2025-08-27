"use client";

import { SelectInput } from "@/core/presentations/components/select-input";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { useMemo } from "react";
import { useListProvince } from "@/core/utilities/address/presentation/hooks/use-list-province";

interface SelectProvinceProps {
  title?: string;
  onChange?: (value: ProvinceEntity) => void;
  value?: ProvinceEntity;
}

export function SelectProvince(props: SelectProvinceProps) {
  const { provinces, error, loading } = useListProvince();

  const value = useMemo(() => {
    if (!props.value) return undefined;
    return props.value.id;
  }, [props.value]);

  const data = useMemo(() => {
    const defaultData = [{ label: "Pilih Provinsi", value: "" }];
    if (error) return defaultData;
    if (loading) return defaultData;
    if (!provinces) return defaultData;

    const data = provinces.map((p) => ({
      label: p.label,
      value: p.id,
    }));

    return [...defaultData, ...data];
  }, [provinces, error, loading]);

  const handleChange = (data: { label: string; value: string }) => {
    if (!provinces) return null;
    if (!props.onChange) return null;

    const found = provinces.find((p) => p.id === data.value);
    if (!found) return null;

    props.onChange(found);
  };

  return (
    <SelectInput
      data={data}
      value={value}
      title={props.title ?? "Provinsi"}
      onChange={handleChange}
      disableFirstOption
    />
  );
}
