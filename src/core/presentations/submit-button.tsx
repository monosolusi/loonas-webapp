import React from "react";

type HTMLButtonType = "button" | "reset" | "submit" | undefined;

export function SubmitButton({ children, loading, type, onClick }: {
  children?: any,
  loading?: boolean,
  type?: HTMLButtonType
  onClick?: () => void,
}) {
  return (
    <div className="group">
      <button
        type={type || "submit"}
        className="inline-flex w-full justify-center rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
        disabled={loading}
        onClick={onClick}
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
        <span className="group-has-disabled:hidden">{children}</span>
      </button>
    </div>
  );
}