"use client";

import Link from "next/link";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";

type DataKurangCardProps = {
  title: string;
  description: string;
  productId: string;
};

export function DataKurangCard({ title, description, productId }: DataKurangCardProps) {
  return (
    <SectionCard title={title}>
      <div className="flex flex-col items-start gap-y-3">
        <div className="flex flex-row items-center gap-x-2">
          <ClipboardDocumentListIcon className="size-6 text-neutral-200" />
          <StatusChip variant="neutral" label="Data Kurang" compact />
        </div>
        <p className="text-sm font-semibold text-neutral-500">Data produk belum lengkap</p>
        <p className="text-sm text-neutral-300">{description}</p>
        <Link href={`/products/${productId}`} className="text-sm text-primary-300 underline hover:text-primary-400">
          Lihat detail produk
        </Link>
      </div>
    </SectionCard>
  );
}