import clsx from "clsx";

export type StatusChipVariant = "success" | "warning" | "error" | "primary" | "neutral";

interface StatusChipProps {
  label: string;
  variant: StatusChipVariant;
  compact?: boolean;
}

const VARIANT_CLASSES: Record<StatusChipVariant, string> = {
  success: "bg-success-50 text-success-500",
  warning: "bg-warning-50 text-warning-500",
  error: "bg-error-50 text-error-500",
  primary: "bg-primary-50 text-primary-500",
  neutral: "bg-neutral-100 text-neutral-400",
};

export function StatusChip({ label, variant, compact }: StatusChipProps) {
  return (
    <span
      className={clsx(
        VARIANT_CLASSES[variant],
        compact ? "rounded-sm px-2 py-0.5 text-xs leading-4 font-medium" : "rounded-sm px-2.5 py-1 text-xs leading-4 font-medium",
      )}
    >
      {label}
    </span>
  );
}
