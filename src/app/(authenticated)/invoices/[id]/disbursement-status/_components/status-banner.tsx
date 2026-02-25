import Image from "next/image";

type StatusBannerVariant = "pending" | "received" | "processing" | "completed";

interface StatusBannerProps {
  variant: StatusBannerVariant;
  iconSrc: string;
  title: string;
  description: string;
  totalAmount: string;
}

const variantStyles: Record<StatusBannerVariant, { border: string; bg: string }> = {
  pending: { border: "border-[#bdbdbd]", bg: "bg-white" },
  received: { border: "border-[#47cd89]", bg: "bg-[#f6fef9]" },
  processing: { border: "border-[#fdb022]", bg: "bg-[#fffcf5]" },
  completed: { border: "border-[#4ca2ff]", bg: "bg-[#f0f7ff]" },
};

export function StatusBanner(props: StatusBannerProps) {
  const styles = variantStyles[props.variant];

  return (
    <div
      className={`relative flex flex-row items-center justify-between overflow-hidden rounded-lg border p-6 ${styles.border} ${styles.bg}`}
    >
      {/* Decorative blur */}
      <div className="absolute right-0 top-[-16px] size-32 rounded-full bg-white/10 blur-[24px]" />

      {/* Left: Icon + Text */}
      <div className="flex flex-row items-center gap-x-4">
        <div className="flex size-12 items-center justify-center rounded-full border border-black/5 bg-white/60">
          <Image src={props.iconSrc} alt="" width={20} height={20} />
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="leading-5 font-bold">{props.title}</div>
          <div className="text-sm leading-5 font-medium opacity-90">{props.description}</div>
        </div>
      </div>

      {/* Right: Total Amount */}
      <div className="flex flex-col gap-y-1 text-right">
        <div className="text-xs leading-4 font-semibold tracking-wide uppercase opacity-70">
          Total Nominal
        </div>
        <div className="text-xl leading-7 font-bold tracking-tight">{props.totalAmount}</div>
      </div>
    </div>
  );
}
