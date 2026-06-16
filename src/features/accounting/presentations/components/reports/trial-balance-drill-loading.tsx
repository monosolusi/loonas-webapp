import clsx from "clsx";

const DELAY_CLASSES = [
  "[animation-delay:0ms]",
  "[animation-delay:75ms]",
  "[animation-delay:150ms]",
] as const;

export function TrialBalanceDrillLoading() {
  return (
    <div className="flex flex-col gap-y-2 p-4 pl-14">
      {DELAY_CLASSES.map((delayClass, i) => (
        <div key={i} className={clsx("h-8 animate-pulse rounded bg-neutral-100", delayClass)} />
      ))}
    </div>
  );
}
