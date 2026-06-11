"use client";

import React, { useMemo } from "react";

type TextAreaInputBaseProps = {
  description?: string;
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
    const { label, onChange, description, noLabel, ...cleanedProps } = props;
    return cleanedProps;
  }, [props]);

  return (
    <div className="flex flex-col gap-2 transition-all">
      {!props.noLabel && (
        <span className="text-base">
          {props.label}
          {props.required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <div className="display focus-within:ring-primary-300/20 focus-within:border-primary-300 flex flex-row items-start gap-3 rounded-lg border border-solid border-neutral-100 p-3 transition-all focus-within:ring-2">
        <textarea
          {...cleanedInputProps}
          onChange={onChange}
          className="min-h-24 flex-1 resize-none text-base outline-none placeholder:text-neutral-200"
        />
      </div>
      {props.description && <span className="text-xs leading-4 font-normal text-neutral-200">{props.description}</span>}
    </div>
  );
}
