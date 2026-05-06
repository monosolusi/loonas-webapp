"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type PosTopBarNavLinkProps = {
  href: string;
  label: string;
  exact?: boolean;
};

export function PosTopBarNavLink({ href, label, exact = false }: PosTopBarNavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={clsx(
        "flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
        active ? "bg-primary-300/10 text-primary-300" : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-500",
      )}
    >
      {label}
    </Link>
  );
}
