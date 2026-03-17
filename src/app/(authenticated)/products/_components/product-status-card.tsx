"use client";

import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";

type ProductStatusCardProps = {
  status: string;
  onStatusChange: (status: string) => void;
};

export function ProductStatusCard({ status, onStatusChange }: ProductStatusCardProps) {
  return (
    <SectionCard title="Status" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm text-neutral-500">{status === "active" ? "Aktif" : "Nonaktif"}</span>
        <Switch
          checked={status === "active"}
          onChange={(checked) => onStatusChange(checked ? "active" : "inactive")}
          className={clsx(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
            status === "active" ? "bg-success-300" : "bg-neutral-100",
          )}
        >
          <span
            className={clsx(
              "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              status === "active" ? "translate-x-5" : "translate-x-0",
            )}
          />
        </Switch>
      </div>
    </SectionCard>
  );
}
