import { DocumentChartBarIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";

type ReportShellEmptyProps = {
  title: string;
};

export function ReportShellEmpty({ title }: ReportShellEmptyProps) {
  return (
    <SectionCard title={title} bodyClassName="p-6">
      <div className="flex flex-col items-center gap-y-3 py-8 text-center">
        <DocumentChartBarIcon className="size-8 text-neutral-200" aria-hidden="true" />
        <p className="text-sm text-neutral-300">Tidak ada data untuk periode yang dipilih.</p>
        <p className="text-xs text-neutral-200">Coba pilih rentang tanggal yang berbeda.</p>
      </div>
    </SectionCard>
  );
}
