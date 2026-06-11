"use client";

import clsx from "clsx";

type ChipProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
  /**
   * Visual size variant.
   * - `default` — `h-11` button (44px, standard interactive height)
   * - `compact` — visually `h-9` pill but wrapped in a `h-11` tap-target
   */
  size?: "default" | "compact";
};

export function Chip({ label, active = false, disabled = false, onClick, title, size = "default" }: ChipProps) {
  if (size === "compact") {
    return (
      <div className="flex h-11 shrink-0 items-center">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          title={title}
          className={clsx(
            "h-9 shrink-0 rounded-full border px-3 text-xs leading-5 transition-colors",
            disabled
              ? "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-300"
              : active
                ? "border-primary-300 bg-primary-300 text-white"
                : "border-neutral-200 bg-white text-neutral-400 hover:border-primary-300/50 hover:text-primary-300",
          )}
        >
          {label}
        </button>
      </div>
    );
  }

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
