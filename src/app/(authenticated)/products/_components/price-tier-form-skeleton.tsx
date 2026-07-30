"use client";

export function PriceTierFormSkeleton() {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="h-24 animate-pulse rounded-lg bg-neutral-100" />
      <div className="h-11 animate-pulse rounded-lg bg-neutral-100" />
      <div className="h-11 animate-pulse rounded-lg bg-neutral-100" />
    </div>
  );
}
