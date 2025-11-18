"use client";

import React, { useMemo } from "react";

export type TextInputProps = {
  label: string;
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
    const { leftIcon, rightIcon, label, onChange, ...cleanedProps } = props;
    return cleanedProps;
  }, [props]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-base">{props.label}</span>
      <div className="display flex flex-row items-center gap-3 rounded-lg border border-solid border-neutral-100 p-3">
        {props.leftIcon && <div className="shrink-0">{props.leftIcon}</div>}
        <input
          {...cleanedInputProps}
          onChange={onChange}
          className="flex-1 text-base outline-none placeholder:text-neutral-200"
        />
        {props.rightIcon && <div className="shrink-0">{props.rightIcon}</div>}
      </div>
    </div>
  );
}
