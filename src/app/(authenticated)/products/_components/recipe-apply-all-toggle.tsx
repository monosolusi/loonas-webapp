"use client";

import { Switch } from "@headlessui/react";
import clsx from "clsx";

type RecipeApplyAllToggleProps = {
  applyAll: boolean;
  variantNames: string[];
  onToggle: (checked: boolean) => void;
};

export function RecipeApplyAllToggle({ applyAll, variantNames, onToggle }: RecipeApplyAllToggleProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col gap-y-0.5">
        <span className="text-sm font-medium text-neutral-500">Apply untuk semua varian</span>
        {applyAll && (
          <span className="text-xs text-neutral-200">
            Resep berlaku untuk: {variantNames.join(", ")}
          </span>
        )}
      </div>
      <Switch
        checked={applyAll}
        onChange={onToggle}
        className={clsx(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
          applyAll ? "bg-primary-300" : "bg-neutral-100",
        )}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            applyAll ? "translate-x-5" : "translate-x-0",
          )}
        />
      </Switch>
    </div>
  );
}
