"use client";

import { useListOccupation } from "@/core/utilities/occupation/presentation/hooks/use-list-occupation";
import { useMemo } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";

type OccupationInputProps = {
  value?: OccupationEntity;
  onChange?: (occupation: OccupationEntity | undefined) => void;
  error?: string;
};

export function OccupationInput(props: OccupationInputProps) {
  const { occupations, loading } = useListOccupation();

  const options = useMemo(() => {
    if (!occupations) return [];
    return occupations.map((occupation) => ({
      value: occupation.id,
      label: occupation.label,
    }));
  }, [occupations]);

  const onChange = (selectedId: string) => {
    const selectedOccupation = occupations?.find((occupation) => occupation.id === selectedId);
    props.onChange?.(selectedOccupation);
  };

  return (
    <SelectInput
      label="Pekerjaan"
      required
      options={options}
      placeholder="Pilih pekerjaan Anda"
      value={props.value?.id ?? ""}
      onChange={(value) => onChange(value)}
      error={props.error}
      disabled={loading}
    />
  );
}
