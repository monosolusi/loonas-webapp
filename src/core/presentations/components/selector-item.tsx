"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/20/solid";

export interface SelectorItemProps {
  image?: {
    src: string;
    alt?: string;
    className?: string;
  };
  title: string;
  href: string;
  description: string;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SelectorItem({
                               image,
                               title,
                               href,
                               description,
                               disabled = false,
                               icon = <ArrowLongRightIcon className="size-5" />,
                               className = "",
                               onClick
                             }: SelectorItemProps) {
  const content = (
    <>
      {image && (
        <div className="flex-none mr-4 shrink-0 self-center">
          <img
            alt={image.alt || title}
            src={image.src}
            className={`mx-auto w-32 h-auto group-data-[disabled=true]:grayscale ${image.className || ""}`}
          />
        </div>
      )}
      <div className="flex-1 my-4 md:mx-4 self-center">
        <p className="text-lg font-semibold group-data-[disabled=true]:text-gray-400">{title}</p>
        <p className="text-gray-600 group-data-[disabled=true]:text-gray-400">{description}</p>
      </div>
      <div className="hidden flex-none self-center lg:flex">
        {icon && <div className={`group-data-[disabled=true]:text-gray-400`}>{icon}</div>}
      </div>
    </>
  );

  return (
    <div className={`group ${className}`} data-disabled={disabled}>
      <Link
        href={disabled ? "#" : href}
        className="flex flex-col lg:flex-row py-8 px-8 hover:bg-white-100 hover:rounded-md group-data-[disabled=true]:hover:bg-transparent group-data-[disabled=true]:cursor-not-allowed"
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        tabIndex={disabled ? -1 : undefined}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    </div>
  );
}