"use client";

import { DocumentChartBarIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";

export function CostValuationGapsEmpty() {
  return (
    <SectionCard title="HPP Belum Tercatat" bodyClassName="p-6">
      <div className="flex flex-col items-center gap-y-3 py-8 text-center">
        <DocumentChartBarIcon className="size-8 text-neutral-200" aria-hidden="true" />
        <p className="text-sm text-neutral-300">Belum ada HPP yang belum tercatat.</p>
      </div>
    </SectionCard>
  );
}