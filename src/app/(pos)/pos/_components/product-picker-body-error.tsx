import { ServerError } from "@/core/resources/server-error";

type ProductPickerBodyErrorProps = {
  error: ServerError;
};

export function ProductPickerBodyError({ error }: ProductPickerBodyErrorProps) {
  return <div className="p-6 text-sm text-error-300">{error.message ?? "Gagal memuat produk."}</div>;
}
