"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";
import { useListDistrict } from "@/core/utilities/address/presentation/hooks/use-list-district";
import { SelectFieldRetryButton } from "@/app/(user)/onboarding/_components/select-field-retry-button";
import { SelectFieldAnnouncer } from "@/app/(user)/onboarding/_components/select-field-announcer";
import {
  resolveSelectFieldList,
  resolveSelectFieldState,
} from "@/app/(user)/onboarding/_utils/resolve-select-field-state";
import { SELECT_FIELD_COPY } from "@/app/(user)/onboarding/_utils/select-field-copy";

type DistrictInputProps = {
  value?: DistrictEntity;
  onChange?: (district: DistrictEntity | undefined) => void;
  city?: CityEntity;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

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
  const { districts, error: fetchError, validating, refresh } = useListDistrict({ cityId: city?.id });

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
    list: resolveSelectFieldList(districts),
    validating,
    hasFetchError: !!fetchError,
    fetchErrorCopy: SELECT_FIELD_COPY.fetchError.district,
    parent: { hasParent: true, parentChosen: !!city, parentHintCopy: SELECT_FIELD_COPY.parentHint.district },
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
