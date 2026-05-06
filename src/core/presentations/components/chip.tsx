"use client";

import clsx from "clsx";

type ChipProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
};

export function Chip({ label, active = false, disabled = false, onClick, title }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={clsx(
        "h-11 shrink-0 rounded-full border px-4 text-sm leading-5 transition-colors",
        disabled
          ? "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-300"
          : active
            ? "border-primary-300 bg-primary-300 text-white"
            : "border-neutral-200 bg-white text-neutral-400 hover:border-primary-300/50 hover:text-primary-300",
      )}
    >
      {label}
    </button>
  );
}
