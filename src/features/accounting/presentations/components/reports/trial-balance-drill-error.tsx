type TrialBalanceDrillErrorProps = {
  onRetry: () => void;
};

export function TrialBalanceDrillError({ onRetry }: TrialBalanceDrillErrorProps) {
  return (
    <div className="flex flex-row items-center gap-x-2 py-4 pl-14 pr-4 text-sm text-error-400">
      <span>Gagal memuat jurnal.</span>
      <button type="button" onClick={onRetry} className="font-medium underline hover:no-underline">
        Coba lagi
      </button>
    </div>
  );
}
