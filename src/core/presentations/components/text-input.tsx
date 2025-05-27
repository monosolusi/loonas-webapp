"use client";

import React from "react";
import { Label } from "@/core/presentations/components/label";

export type TextInputProps = {
  title: string;
  description?: string;
  htmlFor?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  boldLabel?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type">;


export function TextInput({
                            type = "text",
                            title,
                            description,
                            htmlFor,
                            value,
                            onChange,
                            className,
                            boldLabel = false,
                            ...props
                          }: TextInputProps) {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e.target.value);
  }

  return (
    <div className={className}>
      <div className="flex flex-col">
        <Label
          htmlFor={htmlFor}
          title={title}
          description={description}
          bold={boldLabel}
        />
        <div className="mt-2 flex-1">
          <input
            {...props}
            id={htmlFor}
            name={htmlFor}
            type={type}
            value={value}
            onChange={handleChange}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
          />
        </div>
      </div>
    </div>
  );
}
