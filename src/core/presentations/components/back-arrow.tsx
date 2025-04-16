"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function BackArrow() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.back()}
      className="mb-4 flex flex-cols cursor-pointer hover:text-primary-default"
    >
      <ArrowLeftIcon className="size-5 mr-1 mt-0.5" />
      <span>Kembali</span>
    </div>
  );
}