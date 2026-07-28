"use client";

import clsx from "clsx";

type ProductListRowProps = {
  primaryLabel: string;
  /** Right-aligned content. Any composition of price, badges, chevron, etc. */
  right: React.ReactNode;
  /** Optional second line under the label. Omitted rows keep their original height. */
  secondary?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function ProductListRow({
  primaryLabel,
  right,
  secondary,
  active = false,
  disabled = false,
  onClick,
}: ProductListRowProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={clsx(
        "flex min-h-11 w-full flex-row items-center gap-x-3 border-b border-b-neutral-100 px-3 py-2 text-left transition-colors",
        disabled && "cursor-not-allowed opacity-60",
        !disabled && (active ? "bg-primary-300/10" : "hover:bg-neutral-50"),
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span
          className={clsx("line-clamp-2 text-sm leading-5", disabled ? "text-neutral-400" : "text-neutral-500")}
        >
          {primaryLabel}
        </span>
        {secondary}
      </div>
      <div className="flex shrink-0 self-center flex-row items-center gap-x-2 text-sm leading-5 tabular-nums text-neutral-400">
        {right}
      </div>
    </button>
  );
}
