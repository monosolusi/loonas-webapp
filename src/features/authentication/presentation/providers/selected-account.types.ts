import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

export type SelectedAccountContextProps = {
  states: [boolean]; // loading
  selectedAccount?: AccountTypeEntity;
  changeAccount?: (account: AccountTypeEntity, reload?: boolean) => void | Promise<void>;
};

export type SelectedAccountProviderProps = {
  children: React.ReactNode;
};
