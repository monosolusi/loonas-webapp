"use client";

interface DashboardRecentActivityArrowIconProps {
  direction: "in" | "out";
  className?: string;
}

export function DashboardRecentActivityArrowIcon({ direction, className }: DashboardRecentActivityArrowIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      {direction === "in" ? (
        <path
          d="M11 3L3 11M3 11H9M3 11V5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M3 11L11 3M11 3H5M11 3V9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
