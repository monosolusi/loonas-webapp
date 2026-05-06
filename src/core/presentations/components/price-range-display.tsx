import { NumberDisplay } from "@/core/presentations/components/number-display";

type PriceRangeDisplayProps = {
  min: number;
  max: number;
};

export function PriceRangeDisplay({ min, max }: PriceRangeDisplayProps) {
  if (min === max) return <NumberDisplay value={min} />;
  return (
    <>
      <NumberDisplay value={min} />–<NumberDisplay value={max} />
    </>
  );
}
