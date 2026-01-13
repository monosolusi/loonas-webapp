import Image from "next/image";

export function AccountCard() {
  return (
    <div className="flex flex-col gap-y-6 rounded-lg border border-neutral-200 bg-white p-6">
      {/* Icons */}
      <div className="flex w-[250px] flex-row items-start justify-between">
        <div className="bg-success-50 border-success-100 text-success-400 flex size-12 flex-col items-center justify-center rounded-lg shadow-sm">
          <Image
            src="/assets/images/suitcase-icon-success-400-w24-h24.svg"
            alt="Suitcase Icon"
            width={24}
            height={24}
          />
        </div>
        <div className="bg-success-50 border-success-100 rounded-md border px-2 py-1">
          <div className="text-success-400 text-xs leading-4">Bisnis</div>
        </div>
      </div>

      {/*  Account Information */}
      <div className="flex flex-col gap-y-1">
        <div className="truncate text-xl leading-7 font-bold">PT Maju Jaya</div>
        <div className="flex flex-row items-center gap-x-2">
          <div className="bg-success-300 size-2 rounded-full"></div>
          <div className="text-sm leading-5 text-neutral-300">Aktif</div>
        </div>
      </div>

      {/*  Action */}
      <button type="button">
        <div className="hover:bg-primary-300/10 hover:text-primary-400 flex cursor-pointer flex-row justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 transition duration-100 ease-in-out focus:outline-none data-closed:opacity-0">
          <div className="text-sm leading-5 font-medium">Masuk Dashboard</div>
          <Image
            src="/assets/images/arrow-tailed-right-icon-neutral-500-w16-h16.svg"
            alt="Arrow Right Icon"
            width={16}
            height={16}
          />
        </div>
      </button>
    </div>
  );
}
