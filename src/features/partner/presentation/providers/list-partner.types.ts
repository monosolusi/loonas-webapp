import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import React from "react";

export type ListPartnerContextProps = {
  partners: PartnerEntity[];
  searchQuery: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
};
export type ListPartnerProviderProps = {
  children: React.ReactNode;
};
