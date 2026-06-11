"use client";

import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";

type ProductStatusCardProps = {
  active: boolean;
  onActiveChange: (active: boolean) => void;
};

export function ProductStatusCard({ active, onActiveChange }: ProductStatusCardProps) {
  return (
    <SectionCard title="Status" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm text-neutral-500">{active ? "Aktif" : "Nonaktif"}</span>
        <Switch
          checked={active}
          onChange={onActiveChange}
          className={clsx(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
            active ? "bg-success-300" : "bg-neutral-100",
          )}
        >
          <span
            className={clsx(
              "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              active ? "translate-x-5" : "translate-x-0",
            )}
          />
        </Switch>
      </div>
    </SectionCard>
  );
}
