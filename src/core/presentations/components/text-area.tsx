"use client";

import React from "react";
import { Label } from "@/core/presentations/components/label";

export type TextAreaProps = {
  title: string;
  description?: string;
  boldLabel?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
} & Omit<
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
  "value" | "onChange" | "rows"
>;

export function TextArea(props: TextAreaProps) {
  return (
    <div className={props.className}>
      <Label title={props.title} description={props.description} bold={props.boldLabel} />
      <div className="mt-2">
        <textarea
          {...props}
          rows={props.rows ?? 4}
          className="focus:outline-primary-default block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
          value={props.value}
          onChange={(e) => props.onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
