"use client";

import { useListOccupation } from "@/core/utilities/occupation/presentation/hooks/use-list-occupation";
import { useMemo } from "react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { SelectFieldRetryButton } from "@/app/(user)/onboarding/_components/select-field-retry-button";
import { SelectFieldAnnouncer } from "@/app/(user)/onboarding/_components/select-field-announcer";
import {
  resolveSelectFieldList,
  resolveSelectFieldState,
} from "@/app/(user)/onboarding/_utils/resolve-select-field-state";
import { SELECT_FIELD_COPY } from "@/app/(user)/onboarding/_utils/select-field-copy";

type OccupationInputProps = {
  value?: OccupationEntity;
  onChange?: (occupation: OccupationEntity | undefined) => void;
  error?: string;
};

/**
 * Tops its own chain like `ProvinceInput` — no parent field gates it, so only its own fetch can make
 * it inert, and `resolveSelectFieldState` owns saying so.
 *
 * The retry matters more here than anywhere else in the flow: `CreateAccountProvider` holds the whole
 * form in plain `useState` with no persistence, so advising "muat ulang halaman" on step 3 of a
 * 3-step KYC form would destroy everything the user typed. Reloading just this list is the only
 * non-destructive recovery, which is why `useListOccupation` was widened to expose `refresh`.
 */
export function OccupationInput(props: OccupationInputProps) {
  const { occupations, error: fetchError, validating, refresh } = useListOccupation();

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
    list: resolveSelectFieldList(occupations),
    validating,
    hasFetchError: !!fetchError,
    fetchErrorCopy: SELECT_FIELD_COPY.fetchError.occupation,
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
      <SelectFieldAnnouncer message={fieldState.announcement} />
      {fieldState.retry !== "hidden" && <SelectFieldRetryButton state={fieldState.retry} onRetry={() => refresh()} />}
    </div>
  );
}
