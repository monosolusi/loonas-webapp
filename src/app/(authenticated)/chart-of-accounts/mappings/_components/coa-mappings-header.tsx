"use client";

import { useCoaMappings } from "@/app/(authenticated)/chart-of-accounts/mappings/_providers/coa-mappings-provider";

export function CoaMappingsHeader() {
  const { meta } = useCoaMappings();

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-3xl leading-9 font-bold tracking-tight">Pemetaan Akun</h1>
      <p className="leading-6 text-neutral-300">{meta ? `${meta.total} pemetaan akun` : "Memuat..."}</p>
    </div>
  );
}
