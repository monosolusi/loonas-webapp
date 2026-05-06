import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type CheckoutStepMethodBodyErrorProps = {
  error: ServerError;
};

export function CheckoutStepMethodBodyError({ error }: CheckoutStepMethodBodyErrorProps) {
  return (
    <div className="px-4 py-6 text-sm text-error-300">
      {error.message || "Gagal memuat metode pembayaran."}
      {error.code && error.code !== ErrorCodes.UNKNOWN.code && (
        <span className="ml-1 text-neutral-300">({error.code})</span>
      )}
    </div>
  );
}
