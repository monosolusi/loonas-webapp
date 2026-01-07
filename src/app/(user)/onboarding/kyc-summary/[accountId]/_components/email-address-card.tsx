"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

export function EmailAddressCard() {
  const { accountId } = useParams<{ accountId: string }>();

  return (
    <div className="flex flex-row items-center gap-x-4 rounded-xl border border-neutral-100 bg-white p-5">
      {/*  Icon */}
      <div className="bg-primary-300/5 flex flex-col items-center justify-center rounded-lg p-3">
        <Image src="/assets/images/email-icon-primary-300-w24-h24.svg" alt="Email Icon" width={24} height={24} />
      </div>

      {/*  Title and Description */}
      <div className="flex w-full flex-col gap-1">
        <div className="text-sm leading-5 font-medium">Email Terdaftar</div>
        <div className="text-base leading-6 font-semibold">john.doe@gmail.com</div>
        <div className="text-sm leading-5 font-normal text-neutral-200">Kami akan mengirimkan update ke email ini</div>
      </div>
    </div>
  );
}
