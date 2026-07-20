import clsx from "clsx";

type StatusBannerVariant = "pending" | "received" | "processing" | "completed";

interface StatusBannerProps {
  variant: StatusBannerVariant;
  title: string;
  description: string;
  totalAmount: string;
}

const variantStyles: Record<StatusBannerVariant, { border: string; bg: string }> = {
  pending: { border: "border-neutral-300", bg: "bg-white" },
  received: { border: "border-success-400", bg: "bg-success-50" },
  processing: { border: "border-warning-400", bg: "bg-warning-50" },
  completed: { border: "border-primary-400", bg: "bg-primary-50" },
};

export function StatusBanner(props: StatusBannerProps) {
  const styles = variantStyles[props.variant];

  return (
    <div
      className={clsx(
        "relative flex flex-col gap-y-4 overflow-hidden rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-y-0",
        styles.border,
        styles.bg,
      )}
    >
      {/* Decorative blur */}
      <div className="absolute right-0 top-[-16px] size-32 rounded-full bg-white/10 blur-[24px]" />

      {/* Left: Text */}
      <div className="flex flex-col gap-y-1">
        <div className="leading-5 font-bold">{props.title}</div>
        <div className="text-sm leading-5 font-medium opacity-90">{props.description}</div>
      </div>

      {/* Right: Total Amount */}
      <div className="flex flex-col gap-y-1 sm:text-right">
        <div className="text-xs leading-4 font-semibold tracking-wide uppercase opacity-70">
          Total Nominal
        </div>
        <div className="text-xl leading-7 font-bold tracking-tight">{props.totalAmount}</div>
      </div>
    </div>
  );
}
