import { useListPartnerProvider } from "@/features/partner/presentation/providers/list-partner";
import { SearchBar } from "@/features/invoice/presentations/components/search-bar";

export function ListClientSearchBar() {
  const { searchQuery, setSearchQuery } = useListPartnerProvider();

  return <SearchBar value={searchQuery} onChange={setSearchQuery} />;
}
