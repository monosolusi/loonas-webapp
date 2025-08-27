"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface BackArrowProps {
  onClick?: () => void;
}

/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the BackButton component instead.
 * @see BackButton
 */
export function BackArrow(props: BackArrowProps) {
  const router = useRouter();

  function handleClick() {
    if (props.onClick) props.onClick();
    else router.back();
  }

  return (
    <div onClick={handleClick} className="flex-cols hover:text-primary-default mb-4 flex cursor-pointer">
      <ArrowLeftIcon className="mt-0.5 mr-1 size-4" />
      <span>Kembali</span>
    </div>
  );
}
