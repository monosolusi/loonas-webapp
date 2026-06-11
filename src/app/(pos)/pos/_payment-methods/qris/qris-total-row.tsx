import { NumberDisplay } from "@/core/presentations/components/number-display";

type QrisTotalRowProps = {
  total: number;
};

export function QrisTotalRow({ total }: QrisTotalRowProps) {
  return (
    <div className="flex flex-row items-baseline justify-between border-b border-b-neutral-100 px-6 py-4 text-sm">
      <span className="text-neutral-400">Total</span>
      <span className="tabular-nums text-neutral-500">
        <NumberDisplay value={total} suffix="IDR" />
      </span>
    </div>
  );
}
