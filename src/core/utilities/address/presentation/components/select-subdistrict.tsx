"use client";

import { SelectInput } from "@/core/presentations/components/select-input";
import { useMemo } from "react";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { useListSubdistrict } from "@/core/utilities/address/presentation/hooks/use-list-subdistrict";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";

interface SelectSubdistrictProps {
  title?: string;
  onChange?: (value: SubdistrictEntity) => void;
  value?: SubdistrictEntity;
  district?: DistrictEntity;
}

export function SelectSubdistrict(props: SelectSubdistrictProps) {
  const { subdistricts, error, loading } = useListSubdistrict({ districtId: props.district?.id });

  const value = useMemo(() => {
    if (!props.value) return undefined;
    return props.value.id;
  }, [props.value]);

  const data = useMemo(() => {
    const defaultData = [{ label: "Pilih Keluaran", value: "" }];
    if (error) return defaultData;
    if (loading) return defaultData;
    if (!subdistricts) return defaultData;

    const data = subdistricts.map((p) => ({
      label: p.label,
      value: p.id,
    }));

    return [...defaultData, ...data];
  }, [subdistricts, error, loading]);

  const handleChange = (data: { label: string; value: string }) => {
    if (!subdistricts) return null;
    if (!props.onChange) return null;

    const found = subdistricts.find((p) => p.id === data.value);
    if (!found) return null;

    props.onChange(found);
  };

  return (
    <SelectInput
      data={data}
      value={value}
      title={props.title ?? "Keluaran"}
      onChange={handleChange}
      disableFirstOption
    />
  );
}
