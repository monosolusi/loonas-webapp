import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";

export function PeriodsEmptyContent() {
  const { statusFilter } = usePeriods();

  const message =
    statusFilter === "closed"
      ? "Tidak ada periode terkunci."
      : statusFilter === "open"
        ? "Tidak ada periode terbuka."
        : "Belum ada periode akuntansi.";

  return (
    <div className="flex items-center justify-center py-12">
      <span className="text-sm text-neutral-300">{message}</span>
    </div>
  );
}
