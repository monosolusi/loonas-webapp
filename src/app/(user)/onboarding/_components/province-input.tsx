"use client";

import { useMemo } from "react";
import { SelectInput, SelectInputProps } from "@/core/presentations/components/select-input";
import { useListProvince } from "@/core/utilities/address/presentation/hooks/use-list-province";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";
import { SelectFieldRetryButton } from "@/app/(user)/onboarding/_components/select-field-retry-button";
import { SelectFieldAnnouncer } from "@/app/(user)/onboarding/_components/select-field-announcer";
import {
  resolveSelectFieldList,
  resolveSelectFieldState,
} from "@/app/(user)/onboarding/_utils/resolve-select-field-state";
import { SELECT_FIELD_COPY } from "@/app/(user)/onboarding/_utils/select-field-copy";

type ProvinceInputProps = {
  value?: ProvinceEntity;
  onChange?: (province: ProvinceEntity | undefined) => void;
  label?: string;
  placeholder?: string;
} & Omit<SelectInputProps, "value" | "onChange" | "options" | "label">;

/**
 * Province select input component.
 * Fetches provinces list internally and renders a controlled select input.
 *
 * Tops its own chain — no parent field gates it, so only its own fetch can make it inert, and
 * `resolveSelectFieldState` owns saying so (a failed fetch used to render this enabled, empty and
 * silent).
 *
 * @param props.value - ProvinceEntity
 * @param props.onChange - Callback returning the full ProvinceEntity (or undefined if cleared)
 * @param props.label - Label text (default: "Provinsi")
 * @param props.placeholder - Placeholder text (default: "Pilih Provinsi")
 */
export function ProvinceInput({
  value,
  onChange: onChangeProp,
  label = "Provinsi",
  placeholder = "Pilih Provinsi",
  disabled,
  error,
  description,
  ...restProps
}: ProvinceInputProps) {
  const { provinces, error: fetchError, validating, refresh } = useListProvince();

  const options = useMemo(() => {
    if (!provinces) return [];
    return provinces.map((province) => ({
      value: province.id,
      label: province.label,
    }));
  }, [provinces]);

  const onChange = (selectedId: string) => {
    const selectedProvince = provinces?.find((p) => p.id === selectedId);
    onChangeProp?.(selectedProvince);
  };

  const fieldState = resolveSelectFieldState({
    // Derived from the hook's raw `data`, not from `options` — the memo returns `[]` both before the
    // request resolves and for a genuinely empty response, which are different states.
    list: resolveSelectFieldList(provinces),
    validating,
    hasFetchError: !!fetchError,
    fetchErrorCopy: SELECT_FIELD_COPY.fetchError.province,
    parent: { hasParent: false },
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
        // A caller-supplied `disabled` is composed in here rather than inside the resolver: the
        // caller owns explaining its own reason.
        disabled={disabled || fieldState.disabled}
        error={fieldState.error}
        description={fieldState.description}
      />
      <SelectFieldAnnouncer message={fieldState.announcement} />
      {fieldState.retry !== "hidden" && <SelectFieldRetryButton state={fieldState.retry} onRetry={() => refresh()} />}
    </div>
  );
}
