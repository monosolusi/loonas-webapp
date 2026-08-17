"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { useListSubdistrict } from "@/core/utilities/address/presentation/hooks/use-list-subdistrict";
import { SelectFieldRetryButton } from "@/app/(user)/onboarding/_components/select-field-retry-button";
import { SelectFieldAnnouncer } from "@/app/(user)/onboarding/_components/select-field-announcer";
import { resolveSelectFieldState } from "@/app/(user)/onboarding/_utils/resolve-select-field-state";

type SubdistrictInputProps = {
  value?: SubdistrictEntity;
  onChange?: (subdistrict: SubdistrictEntity | undefined) => void;
  district?: DistrictEntity;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

const FETCH_ERROR_COPY = "Gagal memuat daftar kelurahan.";
const PARENT_HINT_COPY = "Pilih kecamatan terlebih dahulu";

/** Gated on a chosen district — see `CityInput` for why the resolver owns the inert-reason copy. */
export function SubdistrictInput({
  value,
  onChange: onChangeProp,
  district,
  label = "Kelurahan",
  placeholder = "Pilih Kelurahan",
  disabled,
  error,
  description,
  ...restProps
}: SubdistrictInputProps) {
  const { subdistricts, error: fetchError, loading, refresh } = useListSubdistrict({ districtId: district?.id });

  const options = useMemo(() => {
    if (!subdistricts) return [];
    return subdistricts.map((subdistrict) => ({
      value: subdistrict.id,
      label: subdistrict.label,
    }));
  }, [subdistricts]);

  const onChange = (selectedId: string) => {
    const selectedSubdistrict = subdistricts?.find((subdistrict) => subdistrict.id === selectedId);
    onChangeProp?.(selectedSubdistrict);
  };

  const fieldState = resolveSelectFieldState({
    hasFetchError: !!fetchError,
    loading,
    canRetry: true,
    fetchErrorCopy: FETCH_ERROR_COPY,
    parent: { hasParent: true, parentChosen: !!district, parentHintCopy: PARENT_HINT_COPY },
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
