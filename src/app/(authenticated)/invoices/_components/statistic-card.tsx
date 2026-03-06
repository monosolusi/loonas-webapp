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
    border: "border-b-warning-200/50 border-warning-50 border-warning-200/60",
    iconBg: "bg-warning-50",
    subtitleText: "text-warning-400",
  },
  error: {
    border: "border-b-error-200/50 border-error-50 border-error-200/60",
    iconBg: "bg-error-50",
    subtitleText: "text-error-400",
  },
  success: {
    border: "border-b-success-200/50 border-success-50 border-success-200/60",
    iconBg: "bg-success-50",
    subtitleText: "text-success-400",
  },
  primary: {
    border: "border-b-primary-200/50 border-primary-50 border-primary-200/60",
    iconBg: "bg-primary-50",
    subtitleText: "text-primary-300",
  },
};

export function StatisticCard({ label, value, subtitle, iconSrc, iconSize = 20, theme, href, count }: StatisticCardProps) {
  const styles = themeStyles[theme];
  const baseClass = `${styles.border} flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5`;

  const content = (
    <>
      <div className="flex flex-col gap-y-3">
        <span className="text-sm leading-5 text-neutral-300">{label}</span>
        <div className="flex flex-col gap-y-1.5">
          <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">{value}</span>
          <span className={`${styles.subtitleText} text-xs leading-4`}>{subtitle}</span>
        </div>
      </div>
      <div className={`${styles.iconBg} flex size-10 items-center justify-center rounded-lg`}>
        <Image src={iconSrc} alt={label} width={iconSize} height={iconSize} />
      </div>
    </>
  );

  if (href && count > 0) {
    return (
      <Link href={href} className={`${baseClass} transition-shadow hover:shadow-sm`}>
        {content}
      </Link>
    );
  }

  if (href) {
    return <div className={`${baseClass} opacity-50`}>{content}</div>;
  }

  return <div className={baseClass}>{content}</div>;
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
