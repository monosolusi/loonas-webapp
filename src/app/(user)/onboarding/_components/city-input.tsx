"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { useListCity } from "@/core/utilities/address/presentation/hooks/use-list-city";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { SelectFieldRetryButton } from "@/app/(user)/onboarding/_components/select-field-retry-button";
import { SelectFieldAnnouncer } from "@/app/(user)/onboarding/_components/select-field-announcer";
import { resolveSelectFieldState } from "@/app/(user)/onboarding/_utils/resolve-select-field-state";

type CityInputProps = {
  value?: CityEntity;
  onChange?: (city: CityEntity | undefined) => void;
  province?: ProvinceEntity;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

const FETCH_ERROR_COPY = "Gagal memuat daftar kabupaten/kota.";
const PARENT_HINT_COPY = "Pilih provinsi terlebih dahulu";

/**
 * Gated on a chosen province. `resolveSelectFieldState` owns telling the user which of the three
 * reasons ("province not chosen yet", "list loading", "list failed") is holding the field inert —
 * before this, all three rendered as the same silent, empty dropdown.
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
  const { cities, error: fetchError, loading, refresh } = useListCity({ provinceId: province?.id });

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
    hasFetchError: !!fetchError,
    loading,
    canRetry: true,
    fetchErrorCopy: FETCH_ERROR_COPY,
    parent: { hasParent: true, parentChosen: !!province, parentHintCopy: PARENT_HINT_COPY },
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
      <SelectFieldAnnouncer message={fieldState.error ?? fieldState.description} />
      {fieldState.showRetry && <SelectFieldRetryButton onRetry={() => refresh()} />}
    </div>
  );
}
