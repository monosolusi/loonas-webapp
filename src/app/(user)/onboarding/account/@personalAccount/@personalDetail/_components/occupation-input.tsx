"use client";

import { useMemo } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useListOccupation } from "@/core/utilities/occupation/presentation/hooks/use-list-occupation";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/_providers/create-account";

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

  return (
    <SelectInput
      label="Pekerjaan"
      options={options}
      placeholder="Pilih pekerjaan Anda"
      value={data.occupation ?? ""}
      onChange={(value) => update?.({ occupation: value })}
      disabled={loading}
    />
  );
}
