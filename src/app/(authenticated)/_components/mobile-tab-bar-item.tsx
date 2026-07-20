"use client";

import Link from "next/link";
import clsx from "clsx";

type MobileTabBarItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  /** Renders a Link when provided; otherwise renders a button that calls onClick. */
  href?: string;
  onClick?: () => void;
};

export function MobileTabBarItem({ icon: Icon, label, active, href, onClick }: MobileTabBarItemProps) {
  const className = clsx(
    "flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200 motion-reduce:transition-none",
    active ? "text-primary-300" : "text-neutral-300",
  );

  const content = (
    <>
      <Icon className="size-6" />
      <span className="text-[11px] leading-none font-medium">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-current={active ? "page" : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-current={active ? "page" : undefined}>
      {content}
    </button>
  );
}
