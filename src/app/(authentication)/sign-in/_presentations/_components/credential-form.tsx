"use client";

import React from "react";
import { EmailInput } from "@/app/(authentication)/sign-in/_presentations/_components/email-input";
import { PasswordInput } from "@/app/(authentication)/sign-in/_presentations/_components/password-input";
import { useSignInProvider } from "@/app/(authentication)/sign-in/_presentations/_providers/sign-in";

export function CredentialForm() {
  const { email, password, setEmail, setPassword, login, loading } = useSignInProvider();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EmailInput value={email} onChange={setEmail} />
      <PasswordInput value={password} onChange={setPassword} />

      <div className="flex items-center justify-between">
        <div className="text-sm/6">
          <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
            Lupa Kata Sandi?
          </a>
        </div>
      </div>

      <div className="group">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
          disabled={loading}
        >
          <svg
            className="hidden mr-3 -ml-1 size-5 animate-spin text-white group-has-disabled:block"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="group-has-disabled:hidden">Masuk</span>
        </button>
      </div>
    </form>
  );
}