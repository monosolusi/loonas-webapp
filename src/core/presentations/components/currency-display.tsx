import { NumberDisplay } from "@/core/presentations/components/number-display";

interface CurrencyDisplayProps {
  value: number;
  className?: string;
}

export function CurrencyDisplay({ value, className }: CurrencyDisplayProps) {
  return (
    <span className={className}>
      Rp <NumberDisplay value={value} />
    </span>
  );
}
