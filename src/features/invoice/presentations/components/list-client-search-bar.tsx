import Image from "next/image";
import { useListPartnerProvider } from "@/features/invoice/presentations/providers/list-partner";

export function ListClientSearchBar() {
  const { searchQuery, setSearchQuery } = useListPartnerProvider();

  return (
    <div className="w-full rounded-md border border-neutral-200 px-3 py-3.5">
      <div className="flex flex-row gap-x-2">
        <Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="search icon" width={20} height={20} />
        <input
          type="text"
          className="w-full placeholder-neutral-300 focus:outline-none"
          placeholder="Cari nama klien..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
