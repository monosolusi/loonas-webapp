"use client";

import React from "react";
import { Checkbox, Field } from "@headlessui/react";


export function DisclaimerCheckbox(props: {
  checked: boolean,
  onChange: (checked: boolean) => void,
  description: string
}) {

  function handleLabelClick() {
    props.onChange(!props.checked);
  }

  return (
    <Field className="flex items-start gap-2">
      <Checkbox
        checked={props.checked}
        onChange={props.onChange}
        className="group mt-1 block size-4 rounded border bg-white data-[checked]:bg-primary-default"
      >
        <svg
          fill="none"
          viewBox="0 0 14 14"
          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-data-[checked]:opacity-100"
          />
        </svg>
      </Checkbox>
      <div className="text-sm text-black select-none" onClick={handleLabelClick}>
        {props.description}
      </div>
    </Field>
  );
}