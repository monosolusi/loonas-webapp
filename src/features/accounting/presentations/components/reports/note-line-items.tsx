import { NoteLineEntity } from "@/features/accounting/domain/entities/notes";
import { NumberDisplay } from "@/core/presentations/components/number-display";

type NoteLineItemsProps = {
  lines: NoteLineEntity[];
};

export function NoteLineItems({ lines }: NoteLineItemsProps) {
  if (lines.length === 0) return null;

  return (
    <dl className="divide-y divide-neutral-100">
      {lines.map((line, index) => (
        <div key={`${line.bucket}-${index}`} className="flex items-baseline justify-between py-2.5">
          <dt className="text-sm text-neutral-500">{line.label}</dt>
          <dd className="text-right text-sm tabular-nums text-neutral-500">
            <NumberDisplay value={line.amount} prefix="Rp" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
