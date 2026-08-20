"use client";

import React, { useMemo } from "react";
import clsx from "clsx";

type TextAreaInputBaseProps = {
  description?: string;
  error?: string | null;
  onChange?: (value: string) => void;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">;

type TextAreaInputWithLabel = TextAreaInputBaseProps & {
  label: string;
  noLabel?: false;
};

type TextAreaInputWithoutLabel = TextAreaInputBaseProps & {
  label?: string;
  noLabel: true;
};

export type TextAreaInputProps = TextAreaInputWithLabel | TextAreaInputWithoutLabel;

/**
 * Custom text area input component.
 *
 * @param props
 * @constructor
 */
export function TextAreaInput(props: TextAreaInputProps) {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) props.onChange(e.target.value);
  };

  const cleanedInputProps = useMemo(() => {
    // `error` is destructured out with the other non-DOM props so it never spreads onto the
    // native <textarea> as an unknown attribute.
    const { label, onChange, description, error, noLabel, ...cleanedProps } = props;
    return cleanedProps;
  }, [props]);

  const hasError = !!props.error;

  return (
    <div className="flex flex-col gap-2 transition-all">
      {!props.noLabel && (
        <span className="text-base">
          {props.label}
          {props.required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <div
        className={clsx(
          "display flex flex-row items-start gap-3 rounded-lg border border-solid p-3 transition-all focus-within:ring-2",
          hasError
            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
            : "focus-within:ring-primary-300/20 focus-within:border-primary-300 border-neutral-100",
        )}
      >
        <textarea
          {...cleanedInputProps}
          onChange={onChange}
          aria-invalid={hasError || undefined}
          className="min-h-24 flex-1 resize-none text-base outline-none placeholder:text-neutral-200"
        />
      </div>
      {hasError && <span className="text-xs leading-4 font-normal text-red-500">{props.error}</span>}
      {!hasError && props.description && (
        <span className="text-xs leading-4 font-normal text-neutral-200">{props.description}</span>
      )}
    </div>
  );
}
