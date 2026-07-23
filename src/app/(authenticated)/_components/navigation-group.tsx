"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

type NavigationGroupProps = {
  id: string;
  label: string;
  iconPath: string;
  selectedIconPath: string;
  matchPrefixes: string[];
  openGroup: string | null;
  onOpenChange: (id: string) => void;
  children: React.ReactNode;
};

export function NavigationGroup({
  id,
  label,
  iconPath,
  selectedIconPath,
  matchPrefixes,
  openGroup,
  onOpenChange,
  children,
}: NavigationGroupProps) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLButtonElement>(null);
  const isChildActive = useMemo(() => matchPrefixes.some((p) => pathname.startsWith(p)), [pathname, matchPrefixes]);
  const isOpen = isChildActive && openGroup === null ? true : openGroup === id;

  // Scroll the group header into view when the user manually opens this group.
  useEffect(() => {
    if (openGroup !== id) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    headerRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
  }, [openGroup, id]);

  const icon = isChildActive ? selectedIconPath : iconPath;
  const foreground = isChildActive ? "text-primary-300" : "text-neutral-300";

  return (
    <div className="flex flex-col">
      <button
        ref={headerRef}
        type="button"
        onClick={() => onOpenChange(id)}
        className={clsx(
          "flex w-full cursor-pointer flex-row items-center gap-x-3 rounded-md p-3 transition-colors duration-200",
          "hover:bg-primary-300/20",
        )}
      >
        <Image src={icon} alt={label} width={16} height={16} />
        <span className={clsx("flex-1 text-left text-sm leading-5 font-medium", foreground)}>{label}</span>
        <ChevronDownIcon
          className={clsx(
            "size-4 text-neutral-200 transition-transform duration-200 ease-out-quart motion-reduce:transition-none",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-out-quart motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-y-0.5 pt-0.5">{children}</div>
        </div>
      </div>
    </div>
  );
}
