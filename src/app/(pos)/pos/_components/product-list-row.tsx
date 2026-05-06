"use client";

import clsx from "clsx";

type ProductListRowProps = {
  primaryLabel: string;
  /** Right-aligned content. Any composition of price, badges, chevron, etc. */
  right: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function ProductListRow({ primaryLabel, right, active = false, disabled = false, onClick }: ProductListRowProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={clsx(
        "flex h-11 w-full flex-row items-center gap-x-3 border-b border-b-neutral-100 px-3 text-left transition-colors",
        disabled && "cursor-not-allowed opacity-60",
        !disabled && (active ? "bg-primary-300/10" : "hover:bg-neutral-50"),
      )}
    >
      <span className={clsx("flex-1 truncate text-sm leading-5", disabled ? "text-neutral-400" : "text-neutral-500")}>
        {primaryLabel}
      </span>
      <div className="flex shrink-0 flex-row items-center gap-x-2 text-sm leading-5 tabular-nums text-neutral-400">
        {right}
      </div>
    </button>
  );
}
