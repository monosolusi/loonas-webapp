"use client";

import React from "react";

export function PasswordInput({ id, value, onChange, label }: {
  value?: string,
  onChange?: (value: string) => void,
  label?: string
  id?: string
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e.target.value);
  }

  return (
    <div>
      <label htmlFor={id || "password"} className="block text-sm/6 font-medium text-gray-900">
        {label || "Kata Sandi"}
      </label>
      <div className="mt-2">
        <input
          id={id || "password"}
          name="password"
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={handleChange}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
          required
        />
      </div>
    </div>
  );
}