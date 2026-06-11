import { SelectorProps } from "@/features/invoice/presentations/components/selector.types";

export function Selector(props: SelectorProps) {
  return (
    <div className="flex max-h-[350px] flex-col overflow-y-auto rounded-lg border border-neutral-200">
      {props.children}
    </div>
  );
}
