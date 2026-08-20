"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { useListCity } from "@/core/utilities/address/presentation/hooks/use-list-city";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { SelectFieldRetryButton } from "@/app/(user)/onboarding/_components/select-field-retry-button";
import { SelectFieldAnnouncer } from "@/app/(user)/onboarding/_components/select-field-announcer";
import {
  resolveSelectFieldList,
  resolveSelectFieldState,
} from "@/app/(user)/onboarding/_utils/resolve-select-field-state";
import { SELECT_FIELD_COPY } from "@/app/(user)/onboarding/_utils/select-field-copy";

type CityInputProps = {
  value?: CityEntity;
  onChange?: (city: CityEntity | undefined) => void;
  province?: ProvinceEntity;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

/**
 * Gated on a chosen province. `resolveSelectFieldState` owns telling the user which reason is holding
 * the field — province not chosen yet, list loading, list failed, or no options at all. Before this,
 * every one of them rendered as the same silent, empty dropdown.
 */
export function CityInput({
  value,
  onChange: onChangeProp,
  province,
  label = "Kabupaten/Kota",
  placeholder = "Pilih Kabupaten/Kota",
  disabled,
  error,
  description,
  ...restProps
}: CityInputProps) {
  const { cities, error: fetchError, validating, refresh } = useListCity({ provinceId: province?.id });

  const options = useMemo(() => {
    if (!cities) return [];
    return cities.map((city) => ({
      value: city.id,
      label: city.label,
    }));
  }, [cities]);

  const onChange = (selectedId: string) => {
    const selectedCity = cities?.find((p) => p.id === selectedId);
    onChangeProp?.(selectedCity);
  };

  const fieldState = resolveSelectFieldState({
    // Derived from the hook's raw `data`, not from `options` — the memo returns `[]` both before the
    // request resolves and for a genuinely empty response, which are different states.
    list: resolveSelectFieldList(cities),
    validating,
    hasFetchError: !!fetchError,
    fetchErrorCopy: SELECT_FIELD_COPY.fetchError.city,
    parent: { hasParent: true, parentChosen: !!province, parentHintCopy: SELECT_FIELD_COPY.parentHint.city },
    callerError: error ?? undefined,
    callerDescription: description,
  });

  return (
    <div className="flex flex-col gap-1">
      <SelectInput
        {...restProps}
        label={label}
        options={options}
        placeholder={placeholder}
        value={value?.id ?? ""}
        onChange={onChange}
        disabled={disabled || fieldState.disabled}
        error={fieldState.error}
        description={fieldState.description}
      />
      <SelectFieldAnnouncer message={fieldState.announcement} />
      {fieldState.retry !== "hidden" && <SelectFieldRetryButton state={fieldState.retry} onRetry={() => refresh()} />}
    </div>
  );
}
