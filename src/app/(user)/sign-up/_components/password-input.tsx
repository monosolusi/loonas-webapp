"use client";

import React from "react";

interface PasswordInputProps {
  label?: string;
  value?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
}

export function PasswordInput({ label, value, onChange }: PasswordInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e.target.value);
  }

  return (
    <div>
      <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
        {label || "Kata Sandi"}
      </label>
      <div className="mt-2">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={value}
          onChange={handleChange}
          className="focus:outline-primary-600 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
          required
        />
      </div>
    </div>
  );
}
