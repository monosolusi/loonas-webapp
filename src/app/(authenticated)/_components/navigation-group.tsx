"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

type NavigationGroupProps = {
  label: string;
  iconPath: string;
  selectedIconPath: string;
  matchPrefixes: string[];
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function NavigationGroup({ label, iconPath, selectedIconPath, matchPrefixes, defaultOpen = false, children }: NavigationGroupProps) {
  const pathname = usePathname();
  const isChildActive = useMemo(() => matchPrefixes.some((p) => pathname.startsWith(p)), [pathname, matchPrefixes]);
  const [isOpen, setIsOpen] = useState(defaultOpen || isChildActive);

  // Auto-expand when navigating into a child route
  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  const icon = isChildActive ? selectedIconPath : iconPath;
  const foreground = isChildActive ? "text-primary-300" : "text-neutral-300";

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex w-full cursor-pointer flex-row items-center gap-x-3 rounded-md p-3 transition-colors duration-200",
          "hover:bg-primary-300/20",
        )}
      >
        <Image src={icon} alt={label} width={16} height={16} />
        <span className={clsx("flex-1 text-left text-sm leading-5 font-medium", foreground)}>{label}</span>
        <ChevronDownIcon className={clsx("size-4 text-neutral-200 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && <div className="flex flex-col gap-y-0.5 pt-0.5">{children}</div>}
    </div>
  );
}
