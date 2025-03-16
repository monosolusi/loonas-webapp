import React from "react";
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/20/solid";

export function AccountSelector({ img, title, href, description, disabled }: {
  img?: string;
  title: string;
  href: string,
  description: string
  disabled?: boolean
}) {
  return (
    <div className="group" data-disabled={disabled}>
      <Link
        href={href}
        className="flex flex-col lg:flex-row py-8 px-8 hover:bg-white-100 hover:rounded-md group-data-[disabled=true]:hover:bg-transparent group-data-[disabled=true]:cursor-not-allowed"
      >
        <div className="flex-none mr-4 shrink-0 self-center">
          <img
            alt="Akun"
            src={img}
            className="mx-auto w-32 h-auto group-data-[disabled=true]:grayscale"
          />
        </div>
        <div className="flex-1 my-4 md:mx-4 self-center">
          <p className="text-lg font-semibold group-data-[disabled=true]:text-gray-400">{title}</p>
          <p className="text-gray-600 group-data-[disabled=true]:text-gray-400">{description}</p>
        </div>
        <div className="hidden flex-none self-center lg:flex">
          <ArrowLongRightIcon className="size-5 group-data-[disabled=true]:text-gray-400" />
        </div>
      </Link>
    </div>
  );
}