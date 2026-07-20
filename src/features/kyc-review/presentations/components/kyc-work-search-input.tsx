import Image from "next/image";

interface KycWorkSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function KycWorkSearchInput({ value, onChange, placeholder }: KycWorkSearchInputProps) {
  return (
    <div className="flex w-full flex-row items-center gap-x-2 rounded-lg border border-neutral-200 px-3 py-2 sm:w-auto">
      <Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="Search" width={20} height={20} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm leading-5 text-neutral-500 outline-none placeholder:text-neutral-300 sm:w-64"
      />
    </div>
  );
}
