"use client";

import React from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

interface SelectData {
  value: string;
  label: string;
}

export function Select({ id, data, value, onChange, disableFirstOption }: {
  id?: string;
  value?: string,
  onChange?: (data: SelectData) => void;
  data: SelectData[];
  disableFirstOption?: boolean;
}) {

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const label = e.target.options[e.target.selectedIndex].text;
    onChange?.({ value, label });
  }

  return (
    <div className="grid grid-cols-1">
      <select
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
      >
        {data.map((item, index) => (
          <option
            key={item.value}
            value={item.value}
            disabled={index === 0 && disableFirstOption ? true : false}>
            {item.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
      />
    </div>
  );
}