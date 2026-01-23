"use client";

import React, { useMemo } from "react";
import clsx from "clsx";

export type TextInputProps = {
  label: string;
  description?: string;
  error?: string | null;
  onChange?: (value: string) => void;
  leftIcon?: React.ReactNode; // Must be width and height props of 20x20
  rightIcon?: React.ReactNode; // Must be width and height props of 20x20
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

/**
 * Custom text input component with left and right icons as optional.
 * Please note that the leftIcon and rightIcon props must be width and height props of 20x20.
 *
 * @param props
 * @constructor
 */
export function TextInput(props: TextInputProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(e.target.value);
  };

  const cleanedInputProps = useMemo(() => {
    // Remove props that doesn't belong to the input element.
    const { leftIcon, rightIcon, label, onChange, description, error, ...cleanedProps } = props;
    return Object.assign({}, cleanedProps, {
      value: cleanedProps.value ?? "",
    }) as React.InputHTMLAttributes<HTMLInputElement>;
  }, [props]);

  const hasError = useMemo(() => !!props.error, [props.error]);
  const isDisabled = useMemo(() => !!props.disabled, [props.disabled]);

  return (
    <div className="flex flex-col gap-2 transition-all">
      <span className={clsx("text-base", isDisabled && "text-neutral-200")}>
        {props.label}
        {props.required && <span className="text-red-500"> *</span>}
      </span>
      <div
        className={clsx(
          "display flex flex-row items-center gap-3 rounded-lg border border-solid p-3 transition-all focus-within:ring-2",
          isDisabled
            ? "cursor-not-allowed border-neutral-100 bg-neutral-100 focus-within:ring-0"
            : hasError
              ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
              : "focus-within:border-primary-300 focus-within:ring-primary-300/20 border-neutral-100",
        )}
      >
        {props.leftIcon && <div className={clsx("shrink-0", isDisabled && "opacity-50")}>{props.leftIcon}</div>}
        <input
          {...cleanedInputProps}
          onChange={onChange}
          className={clsx(
            "flex-1 text-base outline-none placeholder:text-neutral-200",
            isDisabled && "cursor-not-allowed bg-neutral-100 text-neutral-300",
          )}
        />
        {props.rightIcon && <div className={clsx("shrink-0", isDisabled && "opacity-50")}>{props.rightIcon}</div>}
      </div>
      {hasError && <span className="text-xs leading-4 font-normal text-red-500">{props.error}</span>}
      {!hasError && props.description && (
        <span className="text-xs leading-4 font-normal text-neutral-200">{props.description}</span>
      )}
    </div>
  );
}
