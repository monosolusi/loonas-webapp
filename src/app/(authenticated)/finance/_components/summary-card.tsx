import clsx from "clsx";

type SummaryCardVariant = "primary" | "success" | "warning" | "error" | "neutral";

type SummaryCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  variant?: SummaryCardVariant;
  loading?: boolean;
};

const VARIANT_CLASSES: Record<SummaryCardVariant, string> = {
  primary: "border-primary-300/20 bg-primary-300/5",
  success: "border-success-300/20 bg-success-300/5",
  warning: "border-warning-300/20 bg-warning-300/5",
  error: "border-error-300/20 bg-error-300/5",
  neutral: "border-neutral-200 bg-white",
};

const VALUE_CLASSES: Record<SummaryCardVariant, string> = {
  primary: "text-primary-300",
  success: "text-success-300",
  warning: "text-warning-300",
  error: "text-error-300",
  neutral: "text-neutral-500",
};

export function SummaryCard({ label, value, subtitle, variant = "neutral", loading }: SummaryCardProps) {
  return (
    <div className={clsx("flex flex-col gap-y-1 rounded-lg border px-5 py-4", VARIANT_CLASSES[variant])}>
      <span className="text-xs font-medium text-neutral-300">{label}</span>
      {loading ? (
        <div className="h-7 w-32 animate-pulse rounded bg-neutral-100" />
      ) : (
        <span className={clsx("text-xl font-bold", VALUE_CLASSES[variant])}>{value}</span>
      )}
      {subtitle && <span className="text-xs text-neutral-200">{subtitle}</span>}
    </div>
  );
}
