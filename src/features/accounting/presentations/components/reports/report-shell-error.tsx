import { SectionCard } from "@/core/presentations/components/section-card";

type ReportShellErrorProps = {
  title: string;
  onRetry: () => void;
};

export function ReportShellError({ title, onRetry }: ReportShellErrorProps) {
  return (
    <SectionCard title={title} bodyClassName="p-6">
      <div className="flex flex-col items-center gap-y-4 py-8 text-center">
        <span className="rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-medium text-error-400">
          Gagal memuat
        </span>
        <p className="text-sm text-neutral-300">
          Laporan tidak dapat dimuat. Periksa koneksi Anda dan coba lagi.
        </p>
        <button type="button" onClick={onRetry} className="text-sm font-medium text-primary-300 hover:underline">
          Muat ulang
        </button>
      </div>
    </SectionCard>
  );
}
