"use client";

import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

export function BackArrow() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.back()}
      className="mb-4 flex flex-cols cursor-pointer hover:text-primary-default"
    >
      <ArrowLongLeftIcon className="size-5 mr-1 mt-0.5" />
      <span>Kembali</span>
    </div>
  );
}