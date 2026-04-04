import clsx from "clsx";

interface MiniToggleProps {
  active: boolean;
}

export function MiniToggle({ active }: MiniToggleProps) {
  return (
    <div
      className={clsx(
        "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
        active ? "bg-success-300" : "bg-neutral-200",
      )}
    >
      <span
        className={clsx(
          "pointer-events-none mt-0.5 ml-0.5 inline-block size-4 transform rounded-full bg-white shadow transition duration-200",
          active ? "translate-x-4" : "translate-x-0",
        )}
      />
    </div>
  );
}
