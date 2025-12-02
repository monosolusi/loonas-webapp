"use client";

import React from "react";

type AccountType = "personal" | "business";

type CreateAccountContextProps = {
  type?: AccountType;
  setType?: React.Dispatch<React.SetStateAction<AccountType | undefined>>;
};

type CreateAccountProviderProps = {
  children: React.ReactNode;
};

const CreateAccountContext = React.createContext<CreateAccountContextProps>({});

export function CreateAccountProvider(props: CreateAccountProviderProps) {
  const [type, setType] = React.useState<AccountType>();

  return <CreateAccountContext.Provider value={{ type, setType }}>{props.children}</CreateAccountContext.Provider>;
}

export function useCreateAccount() {
  return React.useContext(CreateAccountContext);
}
