import clsx from "clsx";

function toCompactIDR(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    const n = abs / 1_000_000_000;
    return `${sign}Rp${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1).replace(".", ",")}M`;
  }
  if (abs >= 1_000_000) {
    const n = abs / 1_000_000;
    return `${sign}Rp${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1).replace(".", ",")}Jt`;
  }
  if (abs >= 1_000) {
    const n = abs / 1_000;
    return `${sign}Rp${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1).replace(".", ",")}Rb`;
  }
  return `${sign}Rp${abs}`;
}

const themeClasses = {
  primary: {
    borderBottom: "border-b-primary-200/50",
    borderSide: "border-primary-50 border-primary-200/60",
    subtext: "text-primary-300",
  },
  warning: {
    borderBottom: "border-b-warning-200/50",
    borderSide: "border-warning-50 border-warning-200/60",
    subtext: "text-warning-400",
  },
  error: {
    borderBottom: "border-b-red-200/50",
    borderSide: "border-red-50 border-red-200/60",
    subtext: "text-red-400",
  },
};

interface StatCard {
  label: string;
  value: string;
  subtitle: string;
  theme: keyof typeof themeClasses;
}

const stats: StatCard[] = [
  {
    label: "Piutang",
    value: toCompactIDR(28750000),
    subtitle: "dari 6 faktur",
    theme: "primary",
  },
  {
    label: "Hutang",
    value: toCompactIDR(12500000),
    subtitle: "dari 4 faktur",
    theme: "warning",
  },
  {
    label: "Menunggu Pembayaran",
    value: "10 faktur",
    subtitle: "5 masukan, 5 keluaran",
    theme: "error",
  },
];

export function DashboardStatistics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const theme = themeClasses[stat.theme];
        return (
          <div
            key={stat.label}
            className={clsx(
              "flex flex-col gap-y-3 rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5",
              theme.borderBottom,
              theme.borderSide,
            )}
          >
            <span className="text-sm leading-5 text-neutral-300">{stat.label}</span>
            <div className="flex flex-col gap-y-1.5">
              <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">{stat.value}</span>
              <span className={clsx("text-xs leading-4", theme.subtext)}>{stat.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
