"use client";

import clsx from "clsx";

type IncludeZeroToggleProps = {
  readonly active: boolean;
  readonly onToggle: () => void;
};

export function IncludeZeroToggle({ active, onToggle }: IncludeZeroToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label="Tampilkan akun dengan saldo nol"
      onClick={onToggle}
      className={clsx(
        "flex h-11 flex-row items-center gap-x-2 rounded-lg border px-4 text-sm font-medium transition-colors",
        active
          ? "border-primary-300/30 bg-primary-300/5 text-primary-300"
          : "border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:text-neutral-500",
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "inline-flex h-4 w-7 shrink-0 items-center rounded-full border transition-colors",
          active ? "border-primary-300 bg-primary-300" : "border-neutral-200 bg-neutral-100",
        )}
      >
        <span
          className={clsx(
            "h-3 w-3 shrink-0 rounded-full bg-white shadow-sm transition-transform motion-safe:duration-150",
            active ? "translate-x-3.5" : "translate-x-0.5",
          )}
        />
      </span>
      <span>Tampilkan saldo nol</span>
    </button>
  );
}
