import React from "react";
import { Label } from "@/core/presentations/components/label";

interface TextInputWithLeftAddOnProps {
  title: string;
  rightAddOn: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  textDirection?: "text-left" | "text-right" | "text-center";
}

export function TextInputWithRightAddOn(props: TextInputWithLeftAddOnProps) {
  return (
    <div>
      <Label title={props.title} />
      <div className="mt-2 flex">
        <input
          type="text"
          className={`${props.textDirection} -ml-px block w-full grow rounded-l-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none disabled:border-gray-200 disabled:cursor-not-allowed disabled:text-gray-500`}
          value={props.value ?? ""}
          onChange={(e) => props.onChange?.(e.target.value)}
          disabled={props.disabled === undefined ? false : props.disabled}
        />
        <div
          className="flex shrink-0 items-center rounded-r-md bg-white px-3 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6">
          {props.rightAddOn}
        </div>
      </div>
    </div>
  );
}
