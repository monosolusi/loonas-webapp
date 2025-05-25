"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function BackArrow(props: { onClick?: () => void }) {
  const router = useRouter();

  function handleClick() {
    if (props.onClick) props.onClick();
    else router.back();
  }

  return (
    <div
      onClick={handleClick}
      className="mb-4 flex flex-cols cursor-pointer hover:text-primary-default"
    >
      <ArrowLeftIcon className="size-4 mr-1 mt-0.5" />
      <span>Kembali</span>
    </div>
  );
}
