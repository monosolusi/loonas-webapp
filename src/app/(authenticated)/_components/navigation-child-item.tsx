"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavigationChildItemProps = {
  href: string;
  label: string;
};

export function NavigationChildItem({ href, label }: NavigationChildItemProps) {
  const pathname = usePathname();
  const selected = useMemo(() => pathname.startsWith(href), [pathname, href]);

  return (
    <Link
      href={href}
      className={clsx(
        "flex w-full flex-row items-center rounded-md py-2.5 pl-9 pr-3 transition-colors duration-200",
        selected ? "bg-primary-300/10 text-primary-300" : "text-neutral-300 hover:bg-primary-300/20 hover:text-primary-300",
      )}
    >
      <span className="text-sm leading-5 font-medium">{label}</span>
    </Link>
  );
}
