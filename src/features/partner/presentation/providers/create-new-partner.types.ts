import React from "react";

export type CreateNewPartnerContextProps = {
  name: string;
  email: string;
  phone: string;
  loading: boolean;
  setName?: React.Dispatch<React.SetStateAction<string>>;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  setPhone?: React.Dispatch<React.SetStateAction<string>>;
  create?: () => Promise<void>;
  clearInput?: () => void;
};

export type CreateNewPartnerProviderProps = {
  children: React.ReactNode;
};
