"use client";

import { useMemo } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useListOccupation } from "@/core/utilities/occupation/presentation/hooks/use-list-occupation";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_providers/use-create-personal-account-data";

export function OccupationInput() {
  const { occupations, loading } = useListOccupation();
  const { data, update } = usePersonalAccountData();

  const options = useMemo(() => {
    if (!occupations) return [];
    return occupations.map((occupation) => ({
      value: occupation.id,
      label: occupation.label,
    }));
  }, [occupations]);

  const onChange = (selectedId: string) => {
    const selectedOccupation = occupations?.find((occupation) => occupation.id === selectedId);
    update?.({ occupation: selectedOccupation });
  };

  return (
    <SelectInput
      label="Pekerjaan"
      options={options}
      placeholder="Pilih pekerjaan Anda"
      value={data.occupation?.id ?? ""}
      onChange={(value) => onChange(value)}
      disabled={loading}
    />
  );
}
