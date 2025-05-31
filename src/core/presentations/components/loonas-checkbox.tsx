import { Checkbox, Field } from "@headlessui/react";
import React from "react";

interface LoonasCheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void | Promise<void>;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function LoonasCheckbox(props: LoonasCheckboxProps) {
  const handleLabelClick = () => {
    if (!props.onChange) return;
    props.onChange(!props.checked);
  };

  return (
    <Field className="flex flex-1 flex-row space-x-2">
      <Checkbox
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
        className="group data-[checked]:bg-primary-default data-[checked]:border-primary-default mt-1 flex size-5 flex-row items-center justify-center rounded-sm border-1 border-gray-500 bg-white disabled:border-gray-200 data-[disabled]:border-gray-200 data-[disabled]:bg-gray-50"
      >
        <svg
          fill="none"
          viewBox="0 0 14 14"
          className="pointer-events-none size-3.5 stroke-white p-0.5 group-has-disabled:stroke-gray-950/25"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-data-[checked]:opacity-100 group-data-[disabled]:opacity-0"
          />
        </svg>
      </Checkbox>
      <div className="flex-1 select-none" onClick={handleLabelClick}>
        {props.children}
      </div>
    </Field>
  );
}
