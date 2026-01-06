"use client";

import { SelectInput } from "@/core/presentations/components/select-input";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { useListSubdistrict } from "@/core/utilities/address/presentation/hooks/use-list-subdistrict";
import { useMemo } from "react";

type SubdistrictInputProps = {
  value?: SubdistrictEntity;
  onChange?: (subdistrict: SubdistrictEntity | undefined) => void;
  district?: DistrictEntity;
};

export function SubdistrictInput(props: SubdistrictInputProps) {
  const { subdistricts, loading } = useListSubdistrict({ districtId: props.district?.id });

  const options = useMemo(() => {
    if (!subdistricts) return [];
    return subdistricts.map((subdistrict) => ({
      value: subdistrict.id,
      label: subdistrict.label,
    }));
  }, [subdistricts]);

  const onChange = (selectedId: string) => {
    const selectedSubdistrict = subdistricts?.find((subdistrict) => subdistrict.id === selectedId);
    props.onChange?.(selectedSubdistrict);
  };

  const isDisabled = useMemo(() => loading || !props.district, [loading, props.district]);

  return (
    <SelectInput
      options={options}
      label="Kelurahan"
      placeholder="Pilih Kelurahan"
      disabled={isDisabled}
      value={props.value?.id}
      onChange={onChange}
    />
  );
}
