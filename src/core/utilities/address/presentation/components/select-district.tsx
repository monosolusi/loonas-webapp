"use client";

import { SelectInput } from "@/core/presentations/components/select-input";
import { useMemo } from "react";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { useListDistrict } from "@/core/utilities/address/presentation/hooks/use-list-district";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";

interface SelectDistrictProps {
  title?: string;
  onChange?: (value: DistrictEntity) => void;
  value?: DistrictEntity;
  city?: CityEntity;
}

export function SelectDistrict(props: SelectDistrictProps) {
  const { districts, error, loading } = useListDistrict({ cityId: props.city?.id });

  const value = useMemo(() => {
    if (!props.value) return undefined;
    return props.value.id;
  }, [props.value]);

  const data = useMemo(() => {
    const defaultData = [{ label: "Pilih Kecamatan", value: "" }];
    if (error) return defaultData;
    if (loading) return defaultData;
    if (!districts) return defaultData;

    const data = districts.map((p) => ({
      label: p.label,
      value: p.id,
    }));

    return [...defaultData, ...data];
  }, [districts, error, loading]);

  const handleChange = (data: { label: string; value: string }) => {
    if (!districts) return null;
    if (!props.onChange) return null;

    const found = districts.find((p) => p.id === data.value);
    if (!found) return null;

    props.onChange(found);
  };

  return (
    <SelectInput
      data={data}
      value={value}
      title={props.title ?? "Kecamatan"}
      onChange={handleChange}
      disableFirstOption
    />
  );
}
