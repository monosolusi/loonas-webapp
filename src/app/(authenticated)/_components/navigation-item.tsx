"use client";

import Image from "next/image";
import { NavigationItemProps } from "@/app/(authenticated)/_components/navigation-item.types";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function NavigationItem(props: NavigationItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const selected = useMemo(() => {
    return props.exact ? pathname === props.href : pathname.startsWith(props.href);
  }, [pathname, props.href, props.exact]);

  const iconPath = useMemo(() => {
    if (selected || isHovered) return props.selectedIconPath ?? props.iconPath;
    else return props.iconPath;
  }, [selected, isHovered, props.selectedIconPath, props.iconPath]);

  const background = useMemo(() => {
    if (isHovered) return "bg-primary-300/20";
    if (selected) return "bg-primary-300/10";
    return "bg-transparent";
  }, [selected, isHovered]);

  const foreground = useMemo(() => {
    if (selected || isHovered) return "text-primary-300";
    else return "text-neutral-300";
  }, [selected, isHovered]);

  const onClick = () => {
    router.push(props.href);
  };

  return (
    <div
      className={`flex w-full flex-row items-center gap-x-3 p-3 ${background} cursor-pointer rounded-md transition-colors duration-200`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image src={iconPath} alt={props.label} width={16} height={16} />
      <div className={`text-sm leading-5 font-medium ${foreground}`}>{props.label}</div>
    </div>
  );
}
