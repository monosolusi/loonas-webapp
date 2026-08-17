"use client";

import { useListOccupation } from "@/core/utilities/occupation/presentation/hooks/use-list-occupation";
import { useMemo } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { SelectFieldRetryButton } from "@/app/(user)/onboarding/_components/select-field-retry-button";
import { SelectFieldAnnouncer } from "@/app/(user)/onboarding/_components/select-field-announcer";
import { resolveSelectFieldState } from "@/app/(user)/onboarding/_utils/resolve-select-field-state";

type OccupationInputProps = {
  value?: OccupationEntity;
  onChange?: (occupation: OccupationEntity | undefined) => void;
  error?: string;
};

const FETCH_ERROR_COPY = "Gagal memuat daftar pekerjaan.";

/**
 * Tops its own chain like `ProvinceInput` — no parent field gates it, so only its own fetch can make
 * it inert, and `resolveSelectFieldState` owns saying so.
 */
export function OccupationInput(props: OccupationInputProps) {
  const { occupations, error: fetchError, loading, refresh } = useListOccupation();

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

  const fieldState = resolveSelectFieldState({
    hasFetchError: !!fetchError,
    loading,
    canRetry: true,
    fetchErrorCopy: FETCH_ERROR_COPY,
    parent: { hasParent: false },
    callerError: props.error,
  });

  return (
    <div className="flex flex-col gap-1">
      <SelectInput
        label="Pekerjaan"
        required
        options={options}
        placeholder="Pilih pekerjaan Anda"
        value={props.value?.id ?? ""}
        onChange={(value) => onChange(value)}
        disabled={fieldState.disabled}
        error={fieldState.error}
        description={fieldState.description}
      />
      <SelectFieldAnnouncer message={fieldState.error ?? fieldState.description} />
      {fieldState.showRetry && <SelectFieldRetryButton onRetry={() => refresh()} />}
    </div>
  );
}
