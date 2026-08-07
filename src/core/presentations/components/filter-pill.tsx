"use client";

import { XMarkIcon } from "@heroicons/react/16/solid";

type FilterPillProps = {
  label: string;
  onRemove: () => void;
};

export function FilterPill({ label, onRemove }: FilterPillProps) {
  return (
    <span className="inline-flex items-center gap-x-1 rounded-md bg-primary-300/10 px-2 py-0.5 text-xs font-medium text-primary-300">
      {label}
      <button type="button" onClick={onRemove} className="transition-colors hover:text-primary-400">
        <XMarkIcon className="size-3.5" />
      </button>
    </span>
  );
}