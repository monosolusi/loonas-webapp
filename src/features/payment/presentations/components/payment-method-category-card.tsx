"use client";

import Image from "next/image";
import clsx from "clsx";

interface PaymentMethodCategoryCardProps {
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  iconSrc?: string;
  children: React.ReactNode;
}

export function PaymentMethodCategoryCard(props: PaymentMethodCategoryCardProps) {
  return (
    <div
      className="flex cursor-pointer flex-row gap-x-4 rounded-lg border border-neutral-200 p-4 transition-transform"
      onClick={props.onToggle}
    >
      {/* Icon */}
      <div className="flex size-10 flex-row items-center justify-center rounded-lg bg-neutral-100">
        <Image
          src={props.iconSrc ?? "/assets/images/building-icon-neutral-500-w16-h16.svg"}
          alt=""
          width={20}
          height={20}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-row items-center justify-between">
          {/* Description */}
          <div className="flex flex-col">
            <div className="leading-6 font-bold">{props.title}</div>
            <div className="text-xs leading-4">{props.description}</div>
          </div>

          <Image
            src="/assets/images/arrow-down-icon-neutral-300-w16-h16.svg"
            alt=""
            width={16}
            height={16}
            className={clsx("transition-transform duration-300", props.isExpanded && "rotate-180")}
          />
        </div>

        {/* Collapsible content */}
        <div
          className={clsx(
            "grid transition-all duration-300 ease-in-out",
            props.isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-y-3 pt-6">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
