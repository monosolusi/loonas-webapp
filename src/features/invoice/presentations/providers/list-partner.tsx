import { createContext, useContext, useMemo, useState } from "react";
import {
  ListPartnerContextProps,
  ListPartnerProviderProps,
} from "@/features/invoice/presentations/providers/list-partner.types";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useListPartner } from "@/features/partner/presentation/hooks/use-list-partner";

const ListPartnerContext = createContext<ListPartnerContextProps>({
  partners: [],
  searchQuery: "",
});

export function ListPartnerProvider(props: ListPartnerProviderProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { partners } = useListPartner();

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => partner.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [partners, searchQuery]);

  return (
    <ListPartnerContext.Provider value={{ partners: filteredPartners, searchQuery, setSearchQuery }}>
      {props.children}
    </ListPartnerContext.Provider>
  );
}

export function useListPartnerProvider() {
  const context = useContext(ListPartnerContext);
  if (!context) throw new ServerError(ErrorCodes.INVALID_HOOK_CALL);
  return context;
}
