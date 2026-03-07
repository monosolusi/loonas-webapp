import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface StatisticCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  iconSrc: string;
  iconSize?: number;
  theme: "warning" | "error" | "success" | "primary";
  href?: string;
  count: number;
}

const themeStyles: Record<string, { border: string; iconBg: string; subtitleText: string }> = {
  warning: {
    border: "border-t-warning-50 border-r-warning-50 border-l-warning-50 border-b-warning-200/50",
    iconBg: "bg-warning-50",
    subtitleText: "text-warning-400",
  },
  error: {
    border: "border-t-error-50 border-r-error-50 border-l-error-50 border-b-error-200/50",
    iconBg: "bg-error-50",
    subtitleText: "text-error-400",
  },
  success: {
    border: "border-t-success-50 border-r-success-50 border-l-success-50 border-b-success-200/50",
    iconBg: "bg-success-50",
    subtitleText: "text-success-400",
  },
  primary: {
    border: "border-t-primary-50 border-r-primary-50 border-l-primary-50 border-b-primary-200/50",
    iconBg: "bg-primary-50",
    subtitleText: "text-primary-300",
  },
};

const BASE_CLASS = "flex flex-1 flex-row justify-between rounded-xl border border-b-4 bg-neutral-50 p-5";

export function StatisticCard({ label, value, subtitle, iconSrc, iconSize = 20, theme, href, count }: StatisticCardProps) {
  const styles = themeStyles[theme];
  const cardClass = clsx(BASE_CLASS, styles.border);

  const content = (
    <>
      <div className="flex flex-col gap-y-3">
        <span className="text-sm leading-5 text-neutral-300">{label}</span>
        <div className="flex flex-col gap-y-1.5">
          <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">{value}</span>
          <span className={clsx("text-xs leading-4", styles.subtitleText)}>{subtitle}</span>
        </div>
      </div>
      <div className={clsx("flex size-10 items-center justify-center rounded-lg", styles.iconBg)}>
        <Image src={iconSrc} alt={label} width={iconSize} height={iconSize} />
      </div>
    </>
  );

  if (href && count > 0) {
    return (
      <Link href={href} className={clsx(cardClass, "transition-shadow hover:shadow-sm")}>
        {content}
      </Link>
    );
  }

  if (href) {
    return <div className={clsx(cardClass, "opacity-50")}>{content}</div>;
  }

  return <div className={cardClass}>{content}</div>;
}

export function StatisticCardSkeleton() {
  return (
    <div className="flex flex-1 flex-row justify-between rounded-xl border border-neutral-100 bg-neutral-50 p-5">
      <div className="flex flex-col gap-y-3">
        <div className="h-5 w-24 animate-pulse rounded bg-neutral-100" />
        <div className="flex flex-col gap-y-1.5">
          <div className="h-8 w-36 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
      <div className="flex size-10 animate-pulse items-center justify-center rounded-lg bg-neutral-100" />
    </div>
  );
}
