"use client";

type CashEntryDetailInfoRowProps = {
  label: string;
  children: React.ReactNode;
};

export function CashEntryDetailInfoRow({ label, children }: CashEntryDetailInfoRowProps) {
  return (
    <div className="flex flex-row items-start justify-between gap-x-4">
      <span className="shrink-0 text-sm text-neutral-400">{label}</span>
      <span className="text-right text-sm text-neutral-500">{children}</span>
    </div>
  );
}
