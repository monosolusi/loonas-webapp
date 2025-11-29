"use client";

import React, { useMemo } from "react";
import Image from "next/image";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectInputBaseProps = {
  description?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode; // Must be width and height props of 20x20
};

type SelectInputWithLabel = SelectInputBaseProps & {
  label: string;
  noLabel?: false;
};

type SelectInputWithoutLabel = SelectInputBaseProps & {
  label?: string;
  noLabel: true;
};

export type SelectInputProps = (SelectInputWithLabel | SelectInputWithoutLabel) &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange">;

/**
 * Custom select input component with left icon as optional.
 * Uses chevron-down icon for the dropdown arrow.
 *
 * @param props
 * @constructor
 */
export function SelectInput(props: SelectInputProps) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.onChange) props.onChange(e.target.value);
  };

  const cleanedInputProps = useMemo(() => {
    const { leftIcon, label, onChange, description, options, placeholder, noLabel, ...cleanedProps } = props;
    return cleanedProps;
  }, [props]);

  const hasValue = props.value !== undefined && props.value !== "";

  return (
    <div className="flex flex-col gap-2 transition-all">
      {!props.noLabel && <span className="text-base">{props.label}</span>}
      <div className="display focus-within:ring-primary-300/20 focus-within:border-primary-300 relative flex flex-row items-center gap-3 rounded-lg border border-solid border-neutral-100 p-3 transition-all focus-within:ring-2">
        {props.leftIcon && <div className="shrink-0">{props.leftIcon}</div>}
        {!hasValue && props.placeholder && (
          <span className="pointer-events-none absolute left-3 text-base text-neutral-200">{props.placeholder}</span>
        )}
        <select
          {...cleanedInputProps}
          onChange={onChange}
          className={`flex-1 cursor-pointer appearance-none bg-transparent text-base outline-none ${!hasValue ? "text-transparent" : ""}`}
        >
          <option value="" disabled></option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none shrink-0">
          <Image
            src="/assets/images/chevron-down-icon-neutral-200-w20-h20.svg"
            alt="Dropdown arrow"
            width={20}
            height={20}
          />
        </div>
      </div>
      {props.description && <span className="text-xs leading-4 font-normal text-neutral-200">{props.description}</span>}
    </div>
  );
}
