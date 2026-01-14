"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function AddAccountCard() {
  const router = useRouter();

  const onClick = () => {
    // TODO: Untuk sementara langsung ke onboarding flow. In the future, this should create a new page account.
    router.push("/onboarding/account");
  };

  return (
    <div
      className="group hover:bg-primary-300/10 hover:border-primary-300/20 flex w-[256px] cursor-pointer flex-col items-center justify-center gap-y-4 rounded-lg border border-neutral-200 bg-white p-6 transition-all ease-out"
      onClick={onClick}
    >
      <div className="group-hover:border-primary-300/20 flex size-14 flex-col items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-all ease-out group-hover:size-15">
        <Image src="/assets/images/plus-icon-neutral-400-w24-h24.svg" alt="Tambah Akun" width={24} height={24} />
      </div>
      <div className="flex flex-col items-center gap-y-1">
        <div className="leading-6 font-semibold">Buat Akun Baru</div>
        <div className="text-center text-sm leading-5 text-neutral-300">
          Tambahkan entitas bisnis atau personal lain
        </div>
      </div>
    </div>
  );
}
