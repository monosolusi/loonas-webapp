"use client";

import { SelectInput } from "@/core/presentations/components/select-input";
import { useMemo } from "react";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { useListCity } from "../hooks/use-list-city";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";

interface SelectCityProps {
  title?: string;
  onChange?: (value: CityEntity) => void;
  value?: CityEntity;
  province?: ProvinceEntity;
}

export function SelectCity(props: SelectCityProps) {
  const { cities, error, loading } = useListCity({ provinceId: props.province?.id });

  const value = useMemo(() => {
    if (!props.value) return undefined;
    return props.value.id;
  }, [props.value]);

  const data = useMemo(() => {
    const defaultData = [{ label: "Pilih Kota / Kabupaten", value: "" }];
    if (error) return defaultData;
    if (loading) return defaultData;
    if (!cities) return defaultData;

    const data = cities.map((p) => ({
      label: p.label,
      value: p.id,
    }));

    return [...defaultData, ...data];
  }, [cities, error, loading]);

  const handleChange = (data: { label: string; value: string }) => {
    if (!cities) return null;
    if (!props.onChange) return null;

    const found = cities.find((p) => p.id === data.value);
    if (!found) return null;

    props.onChange(found);
  };

  return (
    <SelectInput
      data={data}
      value={value}
      title={props.title ?? "Kota / Kabupaten"}
      onChange={handleChange}
      disableFirstOption
    />
  );
}
