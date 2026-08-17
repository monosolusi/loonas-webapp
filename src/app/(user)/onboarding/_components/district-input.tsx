"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { useListDistrict } from "@/core/utilities/address/presentation/hooks/use-list-district";
import { SelectFieldRetryButton } from "@/app/(user)/onboarding/_components/select-field-retry-button";
import { SelectFieldAnnouncer } from "@/app/(user)/onboarding/_components/select-field-announcer";
import { resolveSelectFieldState } from "@/app/(user)/onboarding/_utils/resolve-select-field-state";

type DistrictInputProps = {
  value?: DistrictEntity;
  onChange?: (district: DistrictEntity | undefined) => void;
  city?: CityEntity;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

const FETCH_ERROR_COPY = "Gagal memuat daftar kecamatan.";
const PARENT_HINT_COPY = "Pilih kabupaten/kota terlebih dahulu";

/** Gated on a chosen city — see `CityInput` for why the resolver owns the inert-reason copy. */
export function DistrictInput({
  value,
  onChange: onChangeProp,
  city,
  label = "Kecamatan",
  placeholder = "Pilih Kecamatan",
  disabled,
  error,
  description,
  ...restProps
}: DistrictInputProps) {
  const { districts, error: fetchError, loading, refresh } = useListDistrict({ cityId: city?.id });

  const options = useMemo(() => {
    if (!districts) return [];
    return districts.map((district) => ({
      value: district.id,
      label: district.label,
    }));
  }, [districts]);

  const onChange = (selectedId: string) => {
    const selectedDistrict = districts?.find((district) => district.id === selectedId);
    onChangeProp?.(selectedDistrict);
  };

  const fieldState = resolveSelectFieldState({
    hasFetchError: !!fetchError,
    loading,
    canRetry: true,
    fetchErrorCopy: FETCH_ERROR_COPY,
    parent: { hasParent: true, parentChosen: !!city, parentHintCopy: PARENT_HINT_COPY },
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
