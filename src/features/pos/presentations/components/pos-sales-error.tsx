import { ServerError } from "@/core/resources/server-error";

type PosSalesErrorProps = {
  error: ServerError;
};

export function PosSalesError({ error }: PosSalesErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 px-6 py-16 text-center">
      <span className="text-sm font-medium text-error-300">Gagal memuat riwayat</span>
      <span className="text-xs text-neutral-400">{error.message || "Terjadi kesalahan"}</span>
    </div>
  );
}
