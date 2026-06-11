import Image from "next/image";

interface InvoiceSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function InvoiceSearchInput({ value, onChange, placeholder }: InvoiceSearchInputProps) {
  return (
    <div className="flex flex-row items-center gap-x-2 rounded-lg border border-neutral-200 px-3 py-2">
      <Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="Search" width={20} height={20} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-64 text-sm leading-5 text-neutral-500 outline-none placeholder:text-neutral-300"
      />
    </div>
  );
}
