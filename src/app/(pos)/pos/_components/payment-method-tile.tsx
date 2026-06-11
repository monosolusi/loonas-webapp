"use client";

import Image from "next/image";
import clsx from "clsx";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

type PaymentMethodTileProps = {
  iconSrc: string;
  title: string;
  description: string;
  disabled?: boolean;
  onClick?: () => void;
};

export function PaymentMethodTile({ iconSrc, title, description, disabled, onClick }: PaymentMethodTileProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={clsx(
        "flex h-24 w-full flex-row items-center gap-x-4 rounded-lg border p-4 text-left transition-colors",
        disabled
          ? "cursor-not-allowed border-neutral-200 opacity-50"
          : "cursor-pointer border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/40",
      )}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
        <Image src={iconSrc} alt="" width={24} height={24} />
      </div>
      <div className="flex flex-1 flex-col gap-y-0.5">
        <span className="text-base font-semibold text-neutral-500">{title}</span>
        <span className="text-sm text-neutral-400">{description}</span>
      </div>
      {!disabled && <ChevronRightIcon className="size-4 shrink-0 text-neutral-300" />}
    </button>
  );
}
