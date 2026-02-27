import React from "react";

type HTMLButtonType = "button" | "reset" | "submit" | undefined;

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function OutlinedButton({
  children,
  loading,
  type,
  onClick,
  disabled = false,
  className,
}: {
  children?: any;
  loading?: boolean;
  disabled?: boolean;
  type?: HTMLButtonType;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div className="group">
      <button
        type={type || "button"}
        className={classNames(
          "focus-visible:outline-primary-default inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-white disabled:text-neutral-200 disabled:shadow-none disabled:ring-neutral-100",
          className,
        )}
        disabled={loading || disabled}
        data-loading={loading}
        onClick={onClick}
      >
        {loading && (
          <svg
            className="mr-3 -ml-1 size-5 animate-spin text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && children}
      </button>
    </div>
  );
}
