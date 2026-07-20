import { NumberDisplay } from "@/core/presentations/components/number-display";

type BalanceDisplayProps = {
  value: number;
};

export function BalanceDisplay({ value }: BalanceDisplayProps) {
  if (value < 0) {
    return (
      <span className="tabular-nums text-neutral-400">
        (<NumberDisplay value={Math.abs(value)} prefix="Rp" />)
      </span>
    );
  }

  return (
    <span className="tabular-nums">
      <NumberDisplay value={value} prefix="Rp" />
    </span>
  );
}
